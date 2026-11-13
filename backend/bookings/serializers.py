from datetime import date

from rest_framework import serializers
from .models import Booking


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "booking_type", "item_name", "name", "phone", "email",
            "destination", "departure_city", "travel_date", "end_date", "days",
            "guests", "budget", "message",
        ]

    def validate_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Please enter your name.")
        return value

    def validate_phone(self, value):
        digits = "".join(ch for ch in value if ch.isdigit())
        if len(digits) < 10:
            raise serializers.ValidationError("Please enter a valid phone number.")
        return value.strip()

    def validate_travel_date(self, value):
        if value and value < date.today():
            raise serializers.ValidationError("Travel date cannot be in the past.")
        return value

    def validate(self, attrs):
        start, end = attrs.get("travel_date"), attrs.get("end_date")
        if end and end < date.today():
            raise serializers.ValidationError({"end_date": "End date cannot be in the past."})
        if start and end and end <= start:
            raise serializers.ValidationError({"end_date": "Check-out / return date must be after the start date."})
        return attrs

    def validate_guests(self, value):
        if value < 1 or value > 100:
            raise serializers.ValidationError("Guests must be between 1 and 100.")
        return value