from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import User, Customer, Vehicle, JobCard, ServiceTask, Part, Invoice

admin.site.register(User)
admin.site.register(Customer)
admin.site.register(Vehicle)
admin.site.register(JobCard)
admin.site.register(ServiceTask)
admin.site.register(Part)
admin.site.register(Invoice)