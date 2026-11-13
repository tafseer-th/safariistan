from rest_framework import serializers

from tours.serializers import DestinationSerializer
from .models import Place, PlaceImage


class PlaceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceImage
        fields = ["id", "image", "caption"]


class PlaceListSerializer(serializers.ModelSerializer):
    destination = DestinationSerializer(read_only=True)

    class Meta:
        model = Place
        fields = [
            "id", "name", "slug", "destination", "short_description",
            "best_time", "image", "is_featured",
        ]


class PlaceDetailSerializer(PlaceListSerializer):
    images = PlaceImageSerializer(many=True, read_only=True)
    highlights = serializers.SerializerMethodField()

    class Meta(PlaceListSerializer.Meta):
        fields = PlaceListSerializer.Meta.fields + ["description", "highlights", "images"]

    def get_highlights(self, obj):
        return [line.strip() for line in obj.highlights.splitlines() if line.strip()]