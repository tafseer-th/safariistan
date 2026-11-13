from django.core.management.base import BaseCommand
from tours.models import Destination, Tour, ItineraryDay

DESTINATIONS = [
    "Skardu", "Hunza", "Naran Kaghan", "Azad Kashmir", "Hunza Skardu",
    "Fairy Meadows", "Swat Kalam", "Neelum Valley", "Kumrat Valley",
    "Chitral Kalash", "Ratti Gali", "Nathia Gali", "Malam Jabba",
    "Gilgit", "Murree", "Shogran",
]

# (title, destination, category, departure, days, price_per_person, discount)
# NOTE: ye sirf SAMPLE data hai, asli prices admin se badal do.
TOURS = [
    ("5 Days Naran Kaghan Family Tour", "Naran Kaghan", "family", "lahore", 5, 32000, 10),
    ("6 Days Hunza Honeymoon Package", "Hunza", "honeymoon", "islamabad", 6, 58000, 15),
    ("8 Days Skardu and Fairy Meadows Tour", "Skardu", "group", "lahore", 8, 72000, 0),
    ("3 Days Kumrat Valley Adventure", "Kumrat Valley", "group", "lahore", 3, 22000, 8),
    ("2 Days Shogran Siri Paye Trip", "Shogran", "family", "islamabad", 2, 14000, 0),
    ("4 Days Swat Kalam Tour", "Swat Kalam", "family", "islamabad", 4, 28000, 10),
    ("5 Days Neelum Valley Tour", "Neelum Valley", "family", "islamabad", 5, 35000, 0),
    ("7 Days Hunza Skardu Combo Tour", "Hunza Skardu", "group", "lahore", 7, 68000, 12),
    ("3 Days Nathia Gali Honeymoon", "Nathia Gali", "honeymoon", "islamabad", 3, 30000, 20),
    ("4 Days Murree Family Tour", "Murree", "family", "islamabad", 4, 24000, 0),
    ("10 Days Gilgit Baltistan Grand Tour", "Gilgit", "group", "karachi", 10, 115000, 15),
    ("6 Days Skardu Honeymoon Package", "Skardu", "honeymoon", "karachi", 6, 62000, 10),
    ("5 Days Fairy Meadows Adventure", "Fairy Meadows", "group", "lahore", 5, 38000, 0),
    ("4 Days Malam Jabba Tour", "Malam Jabba", "family", "islamabad", 4, 26000, 5),
]

INCLUSIONS = """Private transport (car/coaster) for the whole trip
Hotel stay on sharing basis
Daily breakfast and dinner
Experienced driver and local guide
All sightseeing as per itinerary"""

EXCLUSIONS = """Lunch and personal expenses
Entry tickets and jeep charges
Anything not mentioned in inclusions"""


def build_itinerary(tour):
    for day in range(1, tour.days + 1):
        if day == 1:
            title = f"Departure from {tour.get_departure_city_display()} and arrival"
            text = "Departure early morning, scenic drive, check-in and rest."
        elif day == tour.days:
            title = "Return journey"
            text = f"Breakfast, check-out and drive back to {tour.get_departure_city_display()}."
        else:
            title = f"Sightseeing in {tour.destination.name}"
            text = "Full day exploring the main attractions, local food and photo stops."
        ItineraryDay.objects.create(tour=tour, day_number=day, title=title, description=text)


class Command(BaseCommand):
    help = "Add sample destinations and tours"

    def handle(self, *args, **options):
        for name in DESTINATIONS:
            Destination.objects.get_or_create(name=name, defaults={"is_popular": True})

        created = 0
        for title, dest, cat, dep, days, price, disc in TOURS:
            destination = Destination.objects.get(name=dest)
            tour, was_created = Tour.objects.update_or_create(
                title=title,
                defaults={
                    "destination": destination,
                    "category": cat,
                    "departure_city": dep,
                    "days": days,
                    "nights": days - 1,
                    "price_per_person": price,
                    "discount_percent": disc,
                    "summary": f"{days} days private tour to {dest} with hotels, transport and guide.",
                    "description": f"Enjoy a comfortable {days} days trip to {dest} with private transport and handpicked hotels.",
                    "inclusions": INCLUSIONS,
                    "exclusions": EXCLUSIONS,
                    "is_featured": disc >= 15,
                },
            )
            if was_created:
                build_itinerary(tour)
                created += 1

        self.stdout.write(self.style.SUCCESS(
            f"{created} tours added, total {Tour.objects.count()}, destinations {Destination.objects.count()}"
        ))