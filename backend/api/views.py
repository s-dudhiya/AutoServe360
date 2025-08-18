# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,generics
from django.db import transaction
from django.shortcuts import get_object_or_404
from .models import User, Vehicle, JobCard, Part, PartUsage
from .serializers import( LoginSerializer, UserResponseSerializer,VehicleSerializer, MechanicSerializer, JobCardCreateSerializer,
                         JobCardListSerializer,JobCardDetailSerializer, PartSerializer,  PartUsageSerializer)

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
    """
    Provides detailed view for a single Job Card, including its tasks.
    """
    queryset = JobCard.objects.all()
    serializer_class = JobCardDetailSerializer

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