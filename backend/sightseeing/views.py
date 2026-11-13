from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Place
from .serializers import PlaceListSerializer, PlaceDetailSerializer
from .filters import PlaceFilter


class PlaceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Place.objects.filter(is_active=True).select_related("destination").prefetch_related("images")
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = PlaceFilter
    search_fields = ["name", "destination__name", "short_description"]
    ordering_fields = ["name", "created_at"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return PlaceDetailSerializer
        return PlaceListSerializer