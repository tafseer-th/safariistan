from datetime import timedelta

from django import template
from django.db.models import Count
from django.urls import reverse
from django.utils import timezone

from bookings.models import Booking

register = template.Library()


@register.inclusion_tag("admin/booking_dashboard.html")
def booking_dashboard():
    today = timezone.localdate()
    tomorrow = today + timedelta(days=1)
    month_start = today.replace(day=1)
    url = reverse("admin:bookings_booking_changelist")

    qs = Booking.objects.all()
    pending = qs.filter(status="pending")

    cards = [
        {
            "label": "New today",
            "value": qs.filter(created_at__date=today).count(),
            "link": f"{url}?created_at__gte={today}&created_at__lt={tomorrow}",
            "tone": "blue",
        },
        {
            "label": "Pending",
            "value": pending.count(),
            "link": f"{url}?status__exact=pending",
            "tone": "amber",
        },
        {
            "label": "Trips in next 7 days",
            "value": qs.exclude(status="cancelled")
            .filter(travel_date__gte=today, travel_date__lt=today + timedelta(days=7))
            .count(),
            "link": f"{url}?travel_date__gte={today}&travel_date__lt={today + timedelta(days=7)}",
            "tone": "green",
        },
        {
            "label": "Confirmed this month",
            "value": qs.filter(status="confirmed", created_at__date__gte=month_start).count(),
            "link": f"{url}?status__exact=confirmed&created_at__gte={month_start}",
            "tone": "gray",
        },
    ]

    labels = dict(Booking.TYPE_CHOICES)
    by_type = [
        {
            "label": labels.get(row["booking_type"], row["booking_type"]),
            "count": row["n"],
            "link": f"{url}?status__exact=pending&booking_type__exact={row['booking_type']}",
        }
        for row in pending.values("booking_type").annotate(n=Count("id")).order_by("-n")
    ]

    return {
        "cards": cards,
        "by_type": by_type,
        "latest": pending.order_by("-created_at")[:8],
        "all_url": url,
    }
