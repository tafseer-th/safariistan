from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Hotel, Location
from .serializers import HotelListSerializer, HotelDetailSerializer, LocationSerializer
from .filters import HotelFilter


class HotelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = (
        Hotel.objects.filter(is_active=True)
        .select_related("location")
        .prefetch_related("rooms", "images")
    )
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = HotelFilter
    search_fields = ["name", "location__name"]
    ordering_fields = ["price_from", "name", "created_at"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return HotelDetailSerializer
        return HotelListSerializer


class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    pagination_class = None