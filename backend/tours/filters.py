import django_filters
from .models import Tour


class TourFilter(django_filters.FilterSet):
    destination = django_filters.CharFilter(field_name="destination__slug")
    departure = django_filters.CharFilter(field_name="departure_city")
    min_price = django_filters.NumberFilter(field_name="price_per_person", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price_per_person", lookup_expr="lte")
    min_days = django_filters.NumberFilter(field_name="days", lookup_expr="gte")
    max_days = django_filters.NumberFilter(field_name="days", lookup_expr="lte")

    class Meta:
        model = Tour
        fields = ["category", "is_featured"]