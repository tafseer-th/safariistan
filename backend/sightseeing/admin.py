from django.contrib import admin
from .models import Place, PlaceImage


class PlaceImageInline(admin.TabularInline):
    model = PlaceImage
    extra = 1


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ("name", "destination", "best_time", "is_featured", "is_active")
    list_filter = ("destination", "is_featured", "is_active")
    search_fields = ("name", "destination__name")
    list_editable = ("is_featured", "is_active")
    inlines = [PlaceImageInline]