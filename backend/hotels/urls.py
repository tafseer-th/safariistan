from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HotelViewSet, LocationViewSet

router = DefaultRouter()
router.register("hotels", HotelViewSet, basename="hotel")
router.register("locations", LocationViewSet, basename="location")

urlpatterns = [
    path("", include(router.urls)),
]