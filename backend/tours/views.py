from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Count, Q
from django_filters.rest_framework import DjangoFilterBackend

from .models import Tour, Destination
from .serializers import TourListSerializer, TourDetailSerializer, DestinationWithCountsSerializer
from .filters import TourFilter


class TourViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = (
        Tour.objects.filter(is_active=True)
        .select_related("destination")
        .prefetch_related("itinerary", "images")
    )
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = TourFilter
    search_fields = ["title", "destination__name", "summary"]
    ordering_fields = ["price_per_person", "days", "title", "created_at"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return TourDetailSerializer
        return TourListSerializer


class DestinationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Destination.objects.annotate(
        tour_count=Count("tours", filter=Q(tours__is_active=True), distinct=True),
        place_count=Count("places", filter=Q(places__is_active=True), distinct=True),
    )
    serializer_class = DestinationWithCountsSerializer
    pagination_class = None
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["is_popular"]