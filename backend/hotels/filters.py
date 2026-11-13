import django_filters
from .models import Hotel


class HotelFilter(django_filters.FilterSet):
    location = django_filters.CharFilter(field_name="location__slug")
    min_price = django_filters.NumberFilter(field_name="price_from", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price_from", lookup_expr="lte")

    class Meta:
        model = Hotel
        fields = ["hotel_type", "category", "is_featured"]