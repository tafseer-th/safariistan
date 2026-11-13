from django.core.management.base import BaseCommand
from cars.models import Vehicle

# (name, type, seats, transmission, driver_option, price_per_day, discount)
# NOTE: ye sirf SAMPLE data hai, asli rates admin se badal do.
VEHICLES = [
    ("Toyota Corolla", "car", 4, "automatic", "with_driver", 15000, 0),
    ("Honda Civic", "car", 4, "automatic", "with_driver", 17000, 5),
    ("Suzuki Alto", "car", 4, "manual", "self_drive", 7000, 0),
    ("Honda BR-V", "suv", 7, "automatic", "with_driver", 20000, 0),
    ("Toyota Fortuner", "suv", 7, "automatic", "with_driver", 30000, 10),
    ("Toyota Prado", "suv", 7, "automatic", "with_driver", 38000, 0),
    ("Toyota Land Cruiser V8", "suv", 7, "automatic", "with_driver", 55000, 0),
    ("Toyota Hilux Revo", "jeep", 5, "manual", "with_driver", 28000, 0),
    ("Suzuki APV", "van", 8, "manual", "with_driver", 18000, 0),
    ("Toyota Hiace", "van", 12, "manual", "with_driver", 24000, 8),
    ("Toyota Coaster", "coaster", 22, "manual", "with_driver", 45000, 10),
    ("Luxury Coach Bus", "bus", 35, "manual", "with_driver", 65000, 0),
]

FEATURES = """Air conditioning
Clean and well maintained
Experienced and polite driver
Suitable for northern areas roads
Fuel and driver charges as per package"""


class Command(BaseCommand):
    help = "Add sample vehicles"

    def handle(self, *args, **options):
        created = 0
        for name, vtype, seats, trans, driver, price, disc in VEHICLES:
            _, was_created = Vehicle.objects.update_or_create(
                name=name,
                defaults={
                    "vehicle_type": vtype,
                    "seats": seats,
                    "transmission": trans,
                    "driver_option": driver,
                    "price_per_day": price,
                    "discount_percent": disc,
                    "description": f"{name} available for rent for tours, airport transfers and northern areas trips.",
                    "features": FEATURES,
                    "is_featured": disc >= 10,
                },
            )
            created += was_created
        self.stdout.write(self.style.SUCCESS(f"{created} vehicles added, total {Vehicle.objects.count()}"))