from django.db import models


class Booking(models.Model):
    TYPE_CHOICES = [
        ("trip", "Custom trip"),
        ("tour", "Tour package"),
        ("hotel", "Hotel"),
        ("vehicle", "Rent a car"),
        ("place", "Sightseeing"),
    ]
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
    ]

    booking_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="trip")
    item_name = models.CharField(max_length=200, blank=True, help_text="Tour, hotel or vehicle name")

    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=30)
    email = models.EmailField(blank=True)

    destination = models.CharField(max_length=120, blank=True)
    departure_city = models.CharField(max_length=60, blank=True)
    travel_date = models.DateField(null=True, blank=True, help_text="Travel / check-in / pickup date")
    end_date = models.DateField(null=True, blank=True, help_text="Check-out / return date")
    days = models.PositiveSmallIntegerField(null=True, blank=True)
    guests = models.PositiveSmallIntegerField(default=1)
    budget = models.PositiveIntegerField(null=True, blank=True, help_text="Budget per person (Rs)")
    message = models.TextField(blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    admin_notes = models.TextField(blank=True, help_text="Internal notes, not visible to the customer")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"#{self.id} {self.name} ({self.get_booking_type_display()})"