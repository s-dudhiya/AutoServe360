# serializers.py
from rest_framework import serializers
from django.db import transaction
from .models import User, Customer, Vehicle, JobCard, ServiceTask, Part, PartUsage, Invoice

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    pin = serializers.IntegerField()

class UserResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email', 'phone', 'role']

# Serializer for displaying Customer details
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


# Serializer for displaying Vehicle details, including nested Customer info
class VehicleSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)

    class Meta:
        model = Vehicle
        fields = ['id', 'make', 'model', 'registration_no', 'vehicle_type', 'customer']

# --- NEW SERIALIZER FOR LISTING JOB CARDS ---
# This serializer is used to display the list of all job cards.
class JobCardListSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    vehicle = VehicleSerializer(read_only=True)
    assigned_mechanic = serializers.StringRelatedField()

    class Meta:
        model = JobCard
        fields = [
            'id', 'customer', 'vehicle', 'status', 
            'assigned_mechanic', 'created_at' # Ensure your model has this field
        ]
    
    # If your model field is `estimated_completion`, uncomment the lines below
    # estimatedCompletion = serializers.DateTimeField(source='estimated_completion')
    # class Meta:
    #     model = JobCard
    #     fields = [
    #         'id', 'customer', 'vehicle', 'status', 
    #         'assigned_mechanic', 'created_at', 'estimatedCompletion'
    #     ]


# Serializer for listing mechanics with their pending job counts
class MechanicSerializer(serializers.ModelSerializer):
    pending_jobs_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'full_name', 'pending_jobs_count']

    def get_pending_jobs_count(self, obj):
        return obj.assigned_jobs.exclude(status='done').count()

# Serializer for creating new service tasks
class ServiceTaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceTask
        fields = ['description']

# --- FIX 1: Prevent premature unique validation ---
class VehicleCreateNestedSerializer(serializers.ModelSerializer):
    # This overrides the default unique validator from the model field,
    # allowing our custom 'create' logic to handle it.
    registration_no = serializers.CharField(validators=[])

    class Meta:
        model = Vehicle
        fields = ['make', 'model', 'registration_no', 'vehicle_type']
# Serializer for creating a new Job Card
class JobCardCreateSerializer(serializers.ModelSerializer):
    tasks = ServiceTaskCreateSerializer(many=True)
    customer = CustomerSerializer()
    vehicle = VehicleCreateNestedSerializer()
    customer_id = serializers.IntegerField(required=False, write_only=True)
    vehicle_id = serializers.IntegerField(required=False, write_only=True)
    assigned_mechanic_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = JobCard
        fields = [
            'customer', 'vehicle', 'customer_id', 'vehicle_id', 
            'assigned_mechanic_id', 'tasks'
        ]

    # --- FIX 2: Removed the conflicting 'validate' method ---
    # The 'create' method below already contains all the necessary logic.

    def create(self, validated_data):
        try:
            with transaction.atomic():
                tasks_data = validated_data.pop('tasks')
                # Use initial_data to get IDs, as they are write_only
                customer_id = self.initial_data.get('customer_id')
                vehicle_id = self.initial_data.get('vehicle_id')
                assigned_mechanic_id = validated_data.pop('assigned_mechanic_id')
                
                customer_data = validated_data.pop('customer', None)
                vehicle_data = validated_data.pop('vehicle', None)
                
                if customer_id:
                    customer = Customer.objects.get(id=customer_id)
                else:
                    customer = Customer.objects.create(**customer_data)

                if vehicle_id:
                    vehicle = Vehicle.objects.get(id=vehicle_id)
                else:
                    reg_no = vehicle_data.get('registration_no')
                    # This logic correctly finds an existing vehicle or creates a new one.
                    vehicle, created = Vehicle.objects.get_or_create(
                        registration_no__iexact=reg_no,
                        defaults={'customer': customer, **vehicle_data}
                    )
                
                assigned_mechanic = User.objects.get(id=assigned_mechanic_id, role='mechanic')
                job_card = JobCard.objects.create(
                    customer=customer,
                    vehicle=vehicle,
                    assigned_mechanic=assigned_mechanic
                )
                for task_data in tasks_data:
                    ServiceTask.objects.create(jobcard=job_card, **task_data)
                return job_card
        except Exception as e:
            raise serializers.ValidationError({"detail": str(e)})
        
class ServiceTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceTask
        fields = ['id', 'description', 'completed', 'notes']





class PartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Part
        fields = ['id', 'name', 'stock_quantity', 'unit_price']
        read_only_fields = ['id']

    def validate_stock_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock quantity cannot be negative.")
        return value

    def validate_unit_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Unit price cannot be negative.")
        return value

# --- THIS IS THE CORRECTED SERIALIZER ---
# It now uses direct nesting, which is the standard and correct way to handle this.
class PartUsageSerializer(serializers.ModelSerializer):
    part = PartSerializer(read_only=True) # Directly nest the PartSerializer
    part_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = PartUsage
        fields = ['id', 'part', 'part_id', 'quantity_used', 'price_at_time_of_use']

class JobCardDetailSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    vehicle = VehicleSerializer(read_only=True)
    assigned_mechanic = serializers.StringRelatedField()
    tasks = ServiceTaskSerializer(many=True, read_only=True)
    parts_used = PartUsageSerializer(many=True, read_only=True)
    
    # --- FIX: Changed to a SerializerMethodField for reliability ---
    invoice = serializers.SerializerMethodField()

    class Meta:
        model = JobCard
        fields = [
            'id', 'customer', 'vehicle', 'status', 
            'assigned_mechanic', 'created_at', 'tasks', 'parts_used', 'invoice'
        ]

    def get_invoice(self, obj):
        """
        This method explicitly checks if the related invoice exists.
        'hasattr' is a safe way to check without causing an exception.
        If the invoice exists, it is serialized and returned. Otherwise, it returns None.
        This guarantees the frontend condition `job.invoice` will work correctly.
        """
        if hasattr(obj, 'invoice'):
            return InvoiceDetailSerializer(obj.invoice).data
        return None

# --- NEW: Serializer for displaying Invoice details ---
class InvoiceDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'

# --- NEW: Serializer for creating an Invoice ---
# This serializer only takes the fields an admin can input.
# The rest are calculated automatically on the backend.
class InvoiceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ['labor_charge', 'discount', 'tax']
        # Tax will be calculated, but we allow it to be passed for potential overrides
        required_fields = ['labor_charge', 'discount']

class IssuePartActionSerializer(serializers.Serializer):
    part_id = serializers.IntegerField(required=True)
    quantity_used = serializers.IntegerField(required=True, min_value=1)

    def validate_part_id(self, value):
        # Check if the part actually exists in the database
        if not Part.objects.filter(pk=value).exists():
            raise serializers.ValidationError("A part with this ID does not exist.")
        return value