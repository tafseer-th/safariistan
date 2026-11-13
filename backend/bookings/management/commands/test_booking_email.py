from django.conf import settings
from django.core.mail import send_mail
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Sends a test email to BOOKING_ALERT_EMAILS to check the Gmail setup."

    def handle(self, *args, **options):
        if settings.EMAIL_BACKEND.endswith("console.EmailBackend"):
            self.stdout.write(self.style.WARNING(
                "EMAIL_HOST_USER / EMAIL_HOST_PASSWORD are empty in backend/.env, "
                "so the email is only printed below (not really sent)."
            ))
        recipients = settings.BOOKING_ALERT_EMAILS or ["admin@safaristan.local"]
        try:
            send_mail(
                "Safaristan test email",
                "If you can read this, booking alert emails are working.",
                settings.DEFAULT_FROM_EMAIL,
                recipients,
            )
        except Exception as exc:
            raise CommandError(f"Email failed: {exc}")
        self.stdout.write(self.style.SUCCESS(f"Sent to: {', '.join(recipients)}"))
