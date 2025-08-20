from django.db import models
from django.utils import timezone

# ---------------- User Model ----------------
class User(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('mechanic', 'Mechanic'),
    ]

    username = models.CharField(max_length=100, unique=True)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.BigIntegerField()
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    pin = models.IntegerField()
    def __str__(self):
        return f"{self.full_name} ({self.role})"


# ---------------- Customers & Vehicles ----------------
class Customer(models.Model):
    name = models.CharField(max_length=100)
    phone = models.BigIntegerField()
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.phone})"


class Vehicle(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="vehicles")
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    registration_no = models.CharField(max_length=20, unique=True)
    vehicle_type = models.CharField(max_length=50, choices=[('moped', 'Moped'), ('bike', 'Bike')])

    def __str__(self):
        return f"{self.registration_no} - {self.make} {self.model}"


# ---------------- Job Cards ----------------
class JobCard(models.Model):
    STATUS_CHOICES = [
        ('queue', 'In Queue'),
        ('service', 'Under Service'),
        ('parts', 'Awaiting Spare Parts'),
        ('qc', 'Quality Check'),
        ('done', 'Completed'),
    ]
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='queue')
    assigned_mechanic = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': 'mechanic'},
        related_name='assigned_jobs'
    )

    def __str__(self):
        return f"JobCard {self.id} - {self.vehicle.registration_no}"


# ---------------- Services Checklist ----------------
class ServiceTask(models.Model):
    jobcard = models.ForeignKey(JobCard, on_delete=models.CASCADE, related_name="tasks")
    description = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.description}"


# ---------------- Parts & Inventory ----------------
class Part(models.Model):
    # part_id=models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    stock_quantity = models.IntegerField(default=0)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name


# ---------------- Billing ----------------
class Invoice(models.Model):
    jobcard = models.OneToOneField(JobCard, on_delete=models.CASCADE, related_name="invoice")
    labor_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    parts_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Invoice for {self.jobcard}"

# --- NEW MODEL TO TRACK PARTS USED ON A JOB ---
class PartUsage(models.Model):
    """This model records each time a part is used for a job."""
    jobcard = models.ForeignKey(JobCard, on_delete=models.CASCADE, related_name="parts_used")
    part = models.ForeignKey(Part, on_delete=models.PROTECT) # Protect part from being deleted if used
    quantity_used = models.PositiveIntegerField(default=1)
    # This is crucial: We store the price at the time of use for accurate billing.
    price_at_time_of_use = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity_used} x {self.part.name} for JobCard {self.jobcard.id}"