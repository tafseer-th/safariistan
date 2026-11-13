import django_filters
from .models import Vehicle


class VehicleFilter(django_filters.FilterSet):
    min_seats = django_filters.NumberFilter(field_name="seats", lookup_expr="gte")
    min_price = django_filters.NumberFilter(field_name="price_per_day", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price_per_day", lookup_expr="lte")

    class Meta:
        model = Vehicle
        fields = ["vehicle_type", "driver_option", "transmission", "is_featured"]