import logging
import threading

from django.conf import settings
from django.core.mail import send_mail
from django.urls import reverse

logger = logging.getLogger(__name__)


def build_booking_email(booking):
    """Returns (subject, body) for the admin alert about a new booking."""
    kind = booking.get_booking_type_display()
    item = f" - {booking.item_name}" if booking.item_name else ""
    subject = f"New booking #{booking.id}: {kind}{item}"

    admin_url = settings.ADMIN_BASE_URL.rstrip("/") + reverse(
        "admin:bookings_booking_change", args=[booking.id]
    )
    phone_digits = "".join(ch for ch in booking.phone if ch.isdigit())
    if phone_digits.startswith("0"):
        phone_digits = "92" + phone_digits[1:]

    rows = [
        ("Type", kind),
        ("Item", booking.item_name),
        ("Name", booking.name),
        ("Phone", booking.phone),
        ("WhatsApp", f"https://wa.me/{phone_digits}" if phone_digits else ""),
        ("Email", booking.email),
        ("Destination", booking.destination),
        ("From / pickup", booking.departure_city),
        ("Date", booking.travel_date),
        ("Check-out / return", booking.end_date),
        ("Days", booking.days),
        ("Guests", booking.guests),
        ("Budget / person", f"Rs {booking.budget:,}" if booking.budget else ""),
    ]
    lines = [f"{label}: {value}" for label, value in rows if value not in ("", None)]
    if booking.message:
        lines += ["", "Message:", booking.message]
    lines += ["", f"Open in admin: {admin_url}"]

    return subject, "\n".join(lines)


def _send(subject, body, recipients):
    try:
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, recipients)
    except Exception:  # never let a mail problem break a booking
        logger.exception("Could not send booking alert email")


def send_booking_alert(booking, background=True):
    """Emails the team about a new booking. Runs in a background thread so the
    customer does not wait for Gmail."""
    recipients = settings.BOOKING_ALERT_EMAILS
    if not recipients and settings.EMAIL_BACKEND.endswith("console.EmailBackend"):
        recipients = ["admin@safaristan.local"]  # dev: just print to the terminal
    if not recipients:
        return

    subject, body = build_booking_email(booking)
    if background:
        threading.Thread(target=_send, args=(subject, body, recipients), daemon=True).start()
    else:
        _send(subject, body, recipients)
