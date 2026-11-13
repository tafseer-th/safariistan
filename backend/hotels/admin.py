from django.contrib import admin
from .models import Location, Hotel, HotelImage, Room


class RoomInline(admin.TabularInline):
    model = Room
    extra = 1


class HotelImageInline(admin.TabularInline):
    model = HotelImage
    extra = 1


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name",)


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ("name", "location", "hotel_type", "category", "price_from", "discount_percent", "is_featured", "is_active")
    list_filter = ("location", "hotel_type", "category", "is_featured", "is_active")
    search_fields = ("name", "location__name")
    list_editable = ("is_featured", "is_active")
    inlines = [RoomInline, HotelImageInline]