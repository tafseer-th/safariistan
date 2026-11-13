import os
from urllib.parse import urlparse


class InternalRequestPublicHostMiddleware:
    """Requests from the Next.js container arrive as Host: backend:8000.

    Rewrite them to the public host/scheme so absolute media URLs in API
    responses point at the public site, not the internal Docker hostname.
    """

    INTERNAL_HOSTS = {"backend", "backend:8000"}

    def __init__(self, get_response):
        self.get_response = get_response
        public = urlparse(os.getenv("PUBLIC_BASE_URL", ""))
        self.public_host = public.netloc
        self.public_scheme = public.scheme

    def __call__(self, request):
        if self.public_host and request.META.get("HTTP_HOST") in self.INTERNAL_HOSTS:
            request.META["HTTP_HOST"] = self.public_host
            request.META["wsgi.url_scheme"] = self.public_scheme
        return self.get_response(request)
