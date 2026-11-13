from django.contrib import admin
from .models import Vehicle


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ("name", "vehicle_type", "seats", "driver_option", "price_per_day", "discount_percent", "is_featured", "is_active")
    list_filter = ("vehicle_type", "driver_option", "transmission", "is_featured", "is_active")
    search_fields = ("name",)
    list_editable = ("is_featured", "is_active")