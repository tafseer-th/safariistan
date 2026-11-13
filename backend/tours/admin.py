from django.contrib import admin
from .models import Destination, Tour, ItineraryDay, TourImage


class ItineraryInline(admin.TabularInline):
    model = ItineraryDay
    extra = 1


class TourImageInline(admin.TabularInline):
    model = TourImage
    extra = 1


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_popular")
    list_editable = ("is_popular",)
    search_fields = ("name",)


@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    list_display = ("title", "destination", "category", "departure_city", "days", "price_per_person", "discount_percent", "is_featured", "is_active")
    list_filter = ("destination", "category", "departure_city", "is_featured", "is_active")
    search_fields = ("title", "destination__name")
    list_editable = ("is_featured", "is_active")
    inlines = [ItineraryInline, TourImageInline]