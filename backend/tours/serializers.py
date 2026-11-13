from rest_framework import serializers
from .models import Destination, Tour, ItineraryDay, TourImage


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ["id", "name", "slug", "image", "is_popular"]


class DestinationWithCountsSerializer(DestinationSerializer):
    """Used by /api/destinations/ only (counts come from annotate in the view)."""
    tour_count = serializers.IntegerField(read_only=True)
    place_count = serializers.IntegerField(read_only=True)

    class Meta(DestinationSerializer.Meta):
        fields = DestinationSerializer.Meta.fields + ["tour_count", "place_count"]


class ItineraryDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItineraryDay
        fields = ["id", "day_number", "title", "description"]


class TourImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourImage
        fields = ["id", "image", "caption"]


class TourListSerializer(serializers.ModelSerializer):
    destination = DestinationSerializer(read_only=True)
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    departure_city_display = serializers.CharField(source="get_departure_city_display", read_only=True)
    duration_label = serializers.CharField(read_only=True)
    discounted_price = serializers.IntegerField(read_only=True)

    class Meta:
        model = Tour
        fields = [
            "id", "title", "slug", "destination", "category", "category_display",
            "departure_city", "departure_city_display", "days", "nights",
            "duration_label", "price_per_person", "discount_percent",
            "discounted_price", "summary", "image", "is_featured",
        ]


class TourDetailSerializer(TourListSerializer):
    itinerary = ItineraryDaySerializer(many=True, read_only=True)
    images = TourImageSerializer(many=True, read_only=True)
    inclusions = serializers.SerializerMethodField()
    exclusions = serializers.SerializerMethodField()

    class Meta(TourListSerializer.Meta):
        fields = TourListSerializer.Meta.fields + [
            "description", "inclusions", "exclusions", "itinerary", "images",
        ]

    @staticmethod
    def _lines(text):
        return [line.strip() for line in text.splitlines() if line.strip()]

    def get_inclusions(self, obj):
        return self._lines(obj.inclusions)

    def get_exclusions(self, obj):
        return self._lines(obj.exclusions)