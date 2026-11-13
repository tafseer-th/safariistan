import django_filters
from .models import Place


class PlaceFilter(django_filters.FilterSet):
    destination = django_filters.CharFilter(field_name="destination__slug")

    class Meta:
        model = Place
        fields = ["is_featured"]