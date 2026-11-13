from datetime import date, timedelta

from django.core.cache import cache
from rest_framework.test import APITestCase

from .models import Booking

URL = "/api/bookings/"


class BookingApiTests(APITestCase):
    def setUp(self):
        cache.clear()  # reset rate-limit counters between tests
        self.d1 = (date.today() + timedelta(days=10)).isoformat()
        self.d2 = (date.today() + timedelta(days=13)).isoformat()

    def post(self, **extra):
        payload = {"name": "Ali Khan", "phone": "0300 1234567", **extra}
        return self.client.post(URL, payload, format="json")

    def test_each_booking_type_is_saved(self):
        cases = [
            {"booking_type": "hotel", "item_name": "Serena Hunza", "travel_date": self.d1, "end_date": self.d2, "days": 3},
            {"booking_type": "tour", "item_name": "5 Days Hunza Tour", "travel_date": self.d1, "guests": 4},
            {"booking_type": "vehicle", "item_name": "Toyota Prado", "departure_city": "Islamabad", "destination": "Skardu", "days": 5},
            {"booking_type": "place", "item_name": "Attabad Lake", "destination": "Hunza", "guests": 2},
        ]
        for data in cases:
            res = self.post(**data)
            self.assertEqual(res.status_code, 201, res.data)
            b = Booking.objects.get(pk=res.data["id"])
            self.assertEqual(b.booking_type, data["booking_type"])
            self.assertEqual(b.item_name, data["item_name"])
            self.assertEqual(b.status, "pending")

    def test_end_date_must_be_after_start(self):
        res = self.post(booking_type="hotel", travel_date=self.d2, end_date=self.d1)
        self.assertEqual(res.status_code, 400)
        self.assertIn("end_date", res.data)

    def test_past_date_rejected(self):
        res = self.post(travel_date=(date.today() - timedelta(days=1)).isoformat())
        self.assertEqual(res.status_code, 400)

    def test_bad_phone_rejected(self):
        res = self.client.post(URL, {"name": "Ali", "phone": "123"}, format="json")
        self.assertEqual(res.status_code, 400)
        self.assertIn("phone", res.data)

    def test_bookings_cannot_be_listed_publicly(self):
        self.assertEqual(self.client.get(URL).status_code, 405)


from unittest.mock import patch  # noqa: E402

from django.core import mail  # noqa: E402
from django.test import override_settings  # noqa: E402

from .notifications import send_booking_alert  # noqa: E402


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    BOOKING_ALERT_EMAILS=["owner@example.com"],
)
class BookingAlertTests(APITestCase):
    def setUp(self):
        cache.clear()

    def test_alert_sent_when_booking_created(self):
        with patch("bookings.views.send_booking_alert") as alert:
            res = self.client.post(URL, {"name": "Ali Khan", "phone": "03001234567"}, format="json")
        self.assertEqual(res.status_code, 201)
        alert.assert_called_once()
        self.assertEqual(alert.call_args.args[0].id, res.data["id"])

    def test_alert_email_content(self):
        b = Booking.objects.create(
            booking_type="hotel", item_name="Alpine Hotel", name="Huzaifa",
            phone="0300 1234567", guests=3, message="Need a room with a view",
        )
        send_booking_alert(b, background=False)
        self.assertEqual(len(mail.outbox), 1)
        msg = mail.outbox[0]
        self.assertEqual(msg.to, ["owner@example.com"])
        self.assertIn(f"#{b.id}", msg.subject)
        self.assertIn("Alpine Hotel", msg.subject)
        self.assertIn("https://wa.me/923001234567", msg.body)
        self.assertIn(f"/admin/bookings/booking/{b.id}/change/", msg.body)
        self.assertIn("Need a room with a view", msg.body)

    def test_mail_error_does_not_break_booking(self):
        with patch("bookings.notifications.send_mail", side_effect=OSError("smtp down")):
            b = Booking.objects.create(name="Ali", phone="03001234567")
            send_booking_alert(b, background=False)  # must not raise


from django.contrib.auth.models import User  # noqa: E402


class AdminDashboardTests(APITestCase):
    def test_dashboard_shows_counts(self):
        User.objects.create_superuser("boss", "boss@example.com", "pass12345")
        self.client.login(username="boss", password="pass12345")
        Booking.objects.create(name="Ali", phone="03001234567", item_name="Avari Gilgit")
        Booking.objects.create(name="Sara", phone="03001234568", status="confirmed")

        res = self.client.get("/admin/")
        html = res.content.decode()
        self.assertEqual(res.status_code, 200)
        self.assertIn("Bookings overview", html)
        self.assertIn("Avari Gilgit", html)  # in latest pending list
        self.assertIn("Safaristan Admin", html)

        # every card link must open a working (filtered) list
        for path in ["?status__exact=pending", "?created_at__gte=2026-01-01&created_at__lt=2026-01-02",
                     "?travel_date__gte=2026-01-01&travel_date__lt=2026-01-08",
                     "?status__exact=pending&booking_type__exact=trip"]:
            r = self.client.get("/admin/bookings/booking/" + path)
            self.assertEqual(r.status_code, 200, path)
            self.assertNotIn("?e=1", r.url if hasattr(r, "url") else "", path)
