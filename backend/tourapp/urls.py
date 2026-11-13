from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("hotels.urls")),
    path("api/", include("tours.urls")),
    path("api/", include("cars.urls")),
    path("api/", include("sightseeing.urls")),
    path("api/", include("bookings.urls")),
]

# Media is served by Django (nginx proxies /media/) so admin uploads work without extra setup.
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)