from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .models import Booking
from .notifications import send_booking_alert
from .serializers import BookingCreateSerializer


class BookingViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """Public create-only endpoint. Bookings can be read only from the admin panel."""

    queryset = Booking.objects.all()
    serializer_class = BookingCreateSerializer
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        send_booking_alert(booking)
        return Response(
            {"id": booking.id, "detail": "Request received."},
            status=201,
        )