# views.py
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,generics
from django.db import transaction
from decimal import Decimal 
from django.shortcuts import get_object_or_404

from .utils import generate_invoice_pdf
from .models import User, Vehicle, JobCard, Part, PartUsage,Invoice
from .serializers import( LoginSerializer, UserResponseSerializer,VehicleSerializer, MechanicSerializer, JobCardCreateSerializer,
                         JobCardListSerializer,JobCardDetailSerializer, PartSerializer,  PartUsageSerializer,InvoiceCreateSerializer,InvoiceDetailSerializer )

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        pin = serializer.validated_data['pin']
        try:
            user = User.objects.get(username=username, pin=pin)
            user_data = UserResponseSerializer(user).data
            return Response(user_data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# API endpoint to find a vehicle by its registration number
class VehicleFindAPIView(APIView):
    """
    Find a vehicle by its registration number.
    Expects a GET request like: /api/vehicles/find/?registration_no=GJ01AB1234
    """
    def get(self, request, *args, **kwargs):
        reg_no = request.query_params.get('registration_no', None)
        if not reg_no:
            return Response(
                {"error": "Registration number is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            vehicle = Vehicle.objects.select_related('customer').get(registration_no__iexact=reg_no)
            serializer = VehicleSerializer(vehicle)
            return Response(serializer.data)
        except Vehicle.DoesNotExist:
            return Response(
                {"error": "Vehicle not found."},
                status=status.HTTP_404_NOT_FOUND
            )

# API endpoint to list all users with the 'mechanic' role
class MechanicListAPIView(generics.ListAPIView):
    """
    Returns a list of all mechanics along with their pending job counts.
    """
    queryset = User.objects.filter(role='mechanic')
    serializer_class = MechanicSerializer


class JobCardListCreateAPIView(generics.ListCreateAPIView):
    queryset = JobCard.objects.select_related('customer', 'vehicle', 'assigned_mechanic').all()

    def get_serializer_class(self):
        """
        Choose the serializer based on the request method.
        - Use JobCardListSerializer for GET requests (listing).
        - Use JobCardCreateSerializer for POST requests (creating).
        """
        if self.request.method == 'POST':
            return JobCardCreateSerializer
        return JobCardListSerializer

class JobCardDetailAPIView(generics.RetrieveAPIView):
    serializer_class = JobCardDetailSerializer

    def get_queryset(self):
        """
        Optimize the query to pre-fetch all related data needed for the detail view.
        This is more efficient than the default and ensures all data is included.
        """
        return JobCard.objects.prefetch_related(
            'tasks',
            'parts_used__part'  # This is the key fix: It fetches all PartUsage records AND the related Part for each.
        ).select_related(
            'customer',
            'vehicle',
            'assigned_mechanic',
            'invoice' # Also pre-fetch the invoice if it exists
        ).all()

# --- NEW: API Views for managing Parts inventory ---

# Handles GET (list) and POST (create) for Parts
class PartListCreateAPIView(generics.ListCreateAPIView):
    queryset = Part.objects.all().order_by('name')
    serializer_class = PartSerializer

# Handles GET (detail), PUT/PATCH (update), and DELETE for a single Part
class PartDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Part.objects.all()
    serializer_class = PartSerializer


# --- NEW: API View for the "Issue Part" action ---

class IssuePartAPIView(APIView):
    """
    An endpoint to issue a part to a specific job card.
    This action is transactional and updates stock quantity.
    """
    def post(self, request, pk, *args, **kwargs):
        # Find the job card using the 'pk' from the URL
        jobcard = get_object_or_404(JobCard, pk=pk)
        
        serializer = PartUsageSerializer(data=request.data)
        if serializer.is_valid():
            part_id = serializer.validated_data['part_id']
            quantity_to_use = serializer.validated_data['quantity_used']
            
            part = get_object_or_404(Part, pk=part_id)

            # Use a database transaction for this critical operation
            try:
                with transaction.atomic():
                    # 1. Check if there is enough stock
                    if part.stock_quantity < quantity_to_use:
                        return Response(
                            {"error": f"Not enough stock for '{part.name}'. Only {part.stock_quantity} available."},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    
                    # 2. Decrement the stock quantity
                    part.stock_quantity -= quantity_to_use
                    part.save()

                    # 3. Create the PartUsage record
                    PartUsage.objects.create(
                        jobcard=jobcard,
                        part=part,
                        quantity_used=quantity_to_use,
                        price_at_time_of_use=part.unit_price # Copy the current price
                    )
                
                return Response({"success": f"Successfully issued {quantity_to_use} x {part.name} to JobCard {jobcard.id}"}, status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InvoiceCreateAPIView(APIView):
    """
    Creates an Invoice for a given JobCard.
    This endpoint calculates totals and applies fixed business logic.
    """
    def post(self, request, pk, *args, **kwargs):
        jobcard = get_object_or_404(JobCard, pk=pk)

        # 1. Prevent creating a duplicate invoice
        if hasattr(jobcard, 'invoice'):
            return Response(
                {"error": "An invoice already exists for this job card."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Use a database transaction for this critical financial operation
        try:
            with transaction.atomic():
                # 2. Calculate the total cost of parts used
                parts_total = sum(
                    usage.price_at_time_of_use * usage.quantity_used 
                    for usage in jobcard.parts_used.all()
                )

                # 3. Get labor and discount from request, with defaults
                labor_charge = Decimal(request.data.get('labor_charge', '533.00'))
                discount = Decimal(request.data.get('discount', '0.00'))

                # 4. Calculate subtotal and GST (12%)
                subtotal = parts_total + labor_charge
                gst_amount = subtotal * Decimal('0.12')

                # 5. Calculate the final total amount
                total_amount = subtotal + gst_amount - discount

                # 6. Create the Invoice instance
                invoice = Invoice.objects.create(
                    jobcard=jobcard,
                    labor_charge=labor_charge,
                    parts_total=parts_total,
                    tax=gst_amount,
                    discount=discount,
                    total_amount=total_amount
                )

                # Optional: Update job card status to 'done' if it's not already
                if jobcard.status != 'done':
                    jobcard.status = 'done'
                    jobcard.save()

                serializer = InvoiceDetailSerializer(invoice)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- NEW: API View for downloading an Invoice PDF ---
class InvoicePDFView(APIView):
    """
    Generates and serves a PDF for a specific invoice.
    """
    def get(self, request, pk, *args, **kwargs):
        # The 'pk' here is the JobCard ID.
        jobcard = get_object_or_404(JobCard.objects.select_related('invoice'), pk=pk)
        
        if not hasattr(jobcard, 'invoice'):
            return Response({"error": "Invoice not found for this job card."}, status=status.HTTP_404_NOT_FOUND)

        invoice = jobcard.invoice
        pdf_buffer = generate_invoice_pdf(invoice)
        
        response = HttpResponse(pdf_buffer, content_type='application/pdf')
        # This header tells the browser to open a download dialog
        response['Content-Disposition'] = f'attachment; filename="invoice-{invoice.id}.pdf"'
        
        return response