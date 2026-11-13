from django.contrib import admin
from .models import Booking


@admin.action(description="Mark selected as Confirmed")
def mark_confirmed(modeladmin, request, queryset):
    queryset.update(status="confirmed")


@admin.action(description="Mark selected as Cancelled")
def mark_cancelled(modeladmin, request, queryset):
    queryset.update(status="cancelled")


@admin.action(description="Mark selected as Pending")
def mark_pending(modeladmin, request, queryset):
    queryset.update(status="pending")


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "id", "name", "phone", "booking_type", "item_name",
        "destination", "travel_date", "guests", "status", "created_at",
    )
    list_filter = ("status", "booking_type", "travel_date", "created_at")
    search_fields = ("name", "phone", "email", "item_name", "destination")
    list_editable = ("status",)
    date_hierarchy = "created_at"
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")
    actions = [mark_confirmed, mark_cancelled, mark_pending]

    fieldsets = (
        ("Request", {"fields": ("booking_type", "item_name", "status", "admin_notes")}),
        ("Customer", {"fields": ("name", "phone", "email")}),
        ("Trip details", {"fields": ("destination", "departure_city", "travel_date", "end_date", "days", "guests", "budget", "message")}),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )

admin.site.site_header = "Safaristan Admin"
admin.site.site_title = "Safaristan Admin"
admin.site.index_title = "Dashboard"
