from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.urls import re_path
from django.views.static import serve

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("hotels.urls")),
    path("api/", include("tours.urls")),
    path("api/", include("cars.urls")),
    path("api/", include("sightseeing.urls")),
    path("api/", include("bookings.urls")),
]

# Media is served by Django (nginx proxies /media/); static() is a no-op when DEBUG=False.
urlpatterns += [re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT})]
