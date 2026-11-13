from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TourViewSet, DestinationViewSet

router = DefaultRouter()
router.register("tours", TourViewSet, basename="tour")
router.register("destinations", DestinationViewSet, basename="destination")

urlpatterns = [
    path("", include(router.urls)),
]