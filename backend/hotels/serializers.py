from rest_framework import serializers
from .models import Location, Hotel, HotelImage, Room


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ["id", "name", "slug"]


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ["id", "name", "price_per_night", "capacity", "description", "image", "is_available"]


class HotelImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelImage
        fields = ["id", "image", "caption"]


class HotelListSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    hotel_type_display = serializers.CharField(source="get_hotel_type_display", read_only=True)
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    discounted_price = serializers.IntegerField(read_only=True)

    class Meta:
        model = Hotel
        fields = [
            "id", "name", "slug", "location", "hotel_type", "hotel_type_display",
            "category", "category_display", "price_from", "discount_percent",
            "discounted_price", "image", "is_featured",
        ]


class HotelDetailSerializer(HotelListSerializer):
    rooms = RoomSerializer(many=True, read_only=True)
    images = HotelImageSerializer(many=True, read_only=True)

    class Meta(HotelListSerializer.Meta):
        fields = HotelListSerializer.Meta.fields + ["description", "address", "rooms", "images"]