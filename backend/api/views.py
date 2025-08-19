# views.py
from django.utils import timezone
from datetime import timedelta
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,generics
from django.db import transaction
from decimal import Decimal 
from django.db.models import Sum, Count, Avg
from django.db.models.functions import TruncDate
from django.shortcuts import get_object_or_404
import pytz # Import the pytz library for timezone handling
import time

from .utils import generate_invoice_pdf
from .models import ServiceTask, User, Vehicle, JobCard, Part, PartUsage,Invoice
from .serializers import( JobCardStatusUpdateSerializer, LoginSerializer, ServiceTaskUpdateSerializer, UserResponseSerializer,VehicleSerializer, MechanicSerializer, JobCardCreateSerializer,
                         JobCardListSerializer,IssuePartActionSerializer, JobCardDetailSerializer, PartSerializer,  PartUsageSerializer,InvoiceCreateSerializer,InvoiceDetailSerializer,InvoiceExportSerializer )

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
        jobcard = get_object_or_404(JobCard, pk=pk)
        
        # Use the new action-specific serializer
        serializer = IssuePartActionSerializer(data=request.data)
        if serializer.is_valid():
            part_id = serializer.validated_data['part_id']
            quantity_to_use = serializer.validated_data['quantity_used']
            
            part = get_object_or_404(Part, pk=part_id)

            try:
                with transaction.atomic():
                    if part.stock_quantity < quantity_to_use:
                        return Response(
                            {"error": f"Not enough stock for '{part.name}'. Only {part.stock_quantity} available."},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    
                    part.stock_quantity -= quantity_to_use
                    part.save()

                    PartUsage.objects.create(
                        jobcard=jobcard,
                        part=part,
                        quantity_used=quantity_to_use,
                        price_at_time_of_use=part.unit_price
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

class ReportsAPIView(APIView):
    """
    A single endpoint to provide aggregated data for the reports dashboard.
    Accepts a 'period' query parameter ('today', 'week', 'month').
    """
    def get(self, request, *args, **kwargs):
        # Determine the time period for filtering
        period = request.query_params.get('period', 'month') # Default to 'month'
        end_date = timezone.now()
        if period == 'today':
            start_date = end_date.replace(hour=0, minute=0, second=0, microsecond=0)
        elif period == 'week':
            start_date = end_date - timedelta(days=7)
        else: # 'month'
            start_date = end_date - timedelta(days=30)

        # Filter invoices and completed jobs within the date range
        invoices_in_period = Invoice.objects.filter(created_at__range=[start_date, end_date])
        completed_jobs_in_period = JobCard.objects.filter(status='done', invoice__created_at__range=[start_date, end_date])

        # --- 1. Calculate Financial KPIs ---
        financial_kpis = invoices_in_period.aggregate(
            total_revenue=Sum('total_amount', default=Decimal('0.0')),
            total_parts_cost=Sum('parts_total', default=Decimal('0.0')),
            total_labor_charge=Sum('labor_charge', default=Decimal('0.0')),
            avg_invoice_value=Avg('total_amount', default=Decimal('0.0'))
        )
        financial_kpis['total_profit'] = financial_kpis['total_revenue'] - financial_kpis['total_parts_cost']

        # --- 2. Calculate Revenue Over Time for the line chart ---
        revenue_over_time = (
            invoices_in_period
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(revenue=Sum('total_amount'))
            .order_by('date')
        )

        # --- 3. Calculate Operational KPIs ---
        operational_kpis = {
            'jobs_completed': completed_jobs_in_period.count(),
            'mechanic_performance': list(
                completed_jobs_in_period
                .values('assigned_mechanic__full_name')
                .annotate(count=Count('id'))
                .order_by('-count')
            )
        }
        
        # --- 4. Calculate Inventory & Customer Insights ---
        most_used_parts = list(
            PartUsage.objects.filter(jobcard__invoice__in=invoices_in_period)
            .values('part__name')
            .annotate(total_quantity=Sum('quantity_used'))
            .order_by('-total_quantity')[:5] # Top 5 parts
        )

        # Combine all data into a single response
        response_data = {
            'financial_kpis': financial_kpis,
            'revenue_over_time': list(revenue_over_time),
            'operational_kpis': operational_kpis,
            'most_used_parts': most_used_parts,
        }

        return Response(response_data)

class InvoiceExportAPIView(APIView):
    """
    Provides a list of detailed invoices for a given period for PDF export.
    Accepts a 'period' query parameter ('today', 'week', 'month').
    """
    def get(self, request, *args, **kwargs):
        period = request.query_params.get('period', 'month')
        end_date = timezone.now()
        if period == 'today':
            start_date = end_date.replace(hour=0, minute=0, second=0, microsecond=0)
        elif period == 'week':
            start_date = end_date - timedelta(days=7)
        else: # 'month'
            start_date = end_date - timedelta(days=30)

        # Filter invoices within the date range and pre-fetch customer name for efficiency
        invoices = Invoice.objects.filter(created_at__range=[start_date, end_date]).select_related('jobcard__customer')
        
        serializer = InvoiceExportSerializer(invoices, many=True)
        return Response(serializer.data)

# --- THIS VIEW IS NOW FIXED (NO AUTHENTICATION) ---
class MyJobsAPIView(generics.ListAPIView):
    serializer_class = JobCardListSerializer
    # permission_classes has been removed.

    def get_queryset(self):
        """
        This method now filters jobs based on a 'mechanic_id' provided
        as a query parameter from the frontend.
        e.g., /api/my-jobs/?mechanic_id=2
        """
        mechanic_id = self.request.query_params.get('mechanic_id', None)
        if mechanic_id:
            try:
                # Find the user who is a mechanic with the given ID
                mechanic = User.objects.get(id=mechanic_id, role='mechanic')
                return JobCard.objects.filter(assigned_mechanic=mechanic).select_related(
                    'customer', 'vehicle'
                ).order_by('-created_at')
            except User.DoesNotExist:
                return JobCard.objects.none() # Return empty if ID is not a mechanic
        return JobCard.objects.none() # Return empty if no ID is provided


# --- THIS VIEW IS NOW FIXED (NO AUTHENTICATION) ---
class JobCardStatusUpdateAPIView(generics.UpdateAPIView):
    serializer_class = JobCardStatusUpdateSerializer
    queryset = JobCard.objects.all() # A mechanic can update any job card now
    # permission_classes has been removed.


class ServiceTaskUpdateAPIView(generics.UpdateAPIView):
    serializer_class = ServiceTaskUpdateSerializer
    # permission_classes has been removed as requested.
    
    # The queryset now allows updating any ServiceTask by its ID.
    queryset = ServiceTask.objects.all()

