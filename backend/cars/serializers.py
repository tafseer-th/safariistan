from rest_framework import serializers
from .models import Vehicle


class VehicleListSerializer(serializers.ModelSerializer):
    vehicle_type_display = serializers.CharField(source="get_vehicle_type_display", read_only=True)
    driver_option_display = serializers.CharField(source="get_driver_option_display", read_only=True)
    transmission_display = serializers.CharField(source="get_transmission_display", read_only=True)
    discounted_price = serializers.IntegerField(read_only=True)

    class Meta:
        model = Vehicle
        fields = [
            "id", "name", "slug", "vehicle_type", "vehicle_type_display",
            "seats", "transmission", "transmission_display", "has_ac",
            "driver_option", "driver_option_display", "price_per_day",
            "discount_percent", "discounted_price", "image", "is_featured",
        ]


class VehicleDetailSerializer(VehicleListSerializer):
    features = serializers.SerializerMethodField()

    class Meta(VehicleListSerializer.Meta):
        fields = VehicleListSerializer.Meta.fields + ["description", "features"]

    def get_features(self, obj):
        return [line.strip() for line in obj.features.splitlines() if line.strip()]