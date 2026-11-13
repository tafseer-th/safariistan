from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Vehicle
from .serializers import VehicleListSerializer, VehicleDetailSerializer
from .filters import VehicleFilter


class VehicleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Vehicle.objects.filter(is_active=True)
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = VehicleFilter
    search_fields = ["name"]
    ordering_fields = ["price_per_day", "seats", "name"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return VehicleDetailSerializer
        return VehicleListSerializer