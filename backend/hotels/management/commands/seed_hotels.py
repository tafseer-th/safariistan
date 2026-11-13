from django.core.management.base import BaseCommand
from hotels.models import Hotel, Location

# (name, location, price_from, discount_percent)
HOTELS = [
    ("Al Syed Shabistan Guest House Taobat", "Taobat", 9500, 0),
    ("Ali Baba Resort Leepa", "Leepa", 6000, 0),
    ("Alpine Hotel Nathiagali", "Nathiagali", 52200, 5),
    ("Amaan Resorts Kumrat", "Kumrat", 9800, 8),
    ("Ambiance Resorts Hunza", "Hunza", 24000, 0),
    ("Areena Hotel Skardu", "Skardu", 9500, 0),
    ("Army Guest House Astore", "Astore", 17000, 0),
    ("Astore Luxury Curtain", "Astore", 9500, 0),
    ("Avari Gilgit", "Gilgit", 19850, 0),
    ("Ayun Inn", "Ayun", 15000, 12),
    ("Benazir Palace Sudhan Gali", "Sudhan Gali", 8000, 0),
    ("Besham Hilton Hotel", "Besham", 11500, 0),
    ("Best Western Hunza", "Hunza", 17850, 8),
    ("Cecil Hotel Murree", "Murree", 22300, 10),
    ("Cedarwood Hotel Shogran", "Shogran", 29500, 0),
    ("Chitral Inn", "Chitral", 8000, 15),
    ("Corporate Lodges Malam Jabba", "Malam Jabba", 12000, 10),
    ("Darbar Hotel Karimabad", "Hunza", 25000, 20),
    ("Demanchi Hotel Balakot", "Naran Kaghan", 6000, 0),
    ("Destination Hotel Gilgit", "Gilgit", 18000, 15),
    ("Destination Hotel Khaplu", "Khaplu", 22000, 20),
    ("Double Tree by Hilton Nathiagali", "Nathiagali", 73700, 0),
    ("Eagles Nest Hotel Kalam", "Kalam", 6000, 0),
    ("Eagles Nest Hotel Malam Jabba", "Malam Jabba", 6000, 0),
    ("Elites Hotel Nathiagali", "Nathiagali", 22260, 3),
    ("Fairy Meadows Cottages", "Fairy Meadows", 13500, 0),
    ("Famree Resort Attabad", "Attabad", 12600, 20),
    ("Faran Hotel Islamabad", "Islamabad", 4500, 0),
    ("Fiora Hotel Murree", "Murree", 12650, 0),
    ("Fogland Hotel Nathiagali", "Nathiagali", 14560, 18),
    ("Fridays Shogran", "Shogran", 10000, 0),
    ("Gali's End By Roomy", "Nathiagali", 32000, 0),
    ("Geyari Resort Khaplu", "Khaplu", 11500, 0),
    ("Grace Boutique Hotel Hunza", "Hunza", 10500, 8),
    ("Grand Taj Hotel Murree", "Murree", 10000, 0),
    ("GreenPak Kalam", "Kalam", 23000, 18),
    ("Hard Rock Hunza", "Hunza", 30000, 35),
    ("Hashupi Resort Shigar", "Shigar", 25200, 15),
    ("Heaven Peak Resort Saran", "Naran Kaghan", 6000, 0),
    ("Hill Top Hotel Shogran", "Shogran", 13500, 0),
    ("HillTop Lodge and Restaurant", "Northern Areas", 11500, 0),
    ("Hindukush Heights", "Northern Areas", 8500, 0),
    ("Hotel Liore Keran", "Keran", 22000, 0),
    ("Hunza Serena", "Hunza", 70000, 25),
    ("IYI Luxury Inn Hotel Mingora", "Swat", 10000, 18),
    ("Ibex Cottage Fairy Meadows", "Fairy Meadows", 7000, 0),
    ("Ibex Cottage Sharda", "Sharda", 3500, 0),
    ("Islamabad Serena Hotel", "Islamabad", 90000, 30),
    ("K2 GreenPak Hunza", "Hunza", 24000, 18),
    ("Kallisto Hotel", "Northern Areas", 12500, 8),
    ("Keran Retreat", "Keran", 15000, 20),
    ("KhanaBadosh Glamping Pod Kumrat", "Kumrat", 12300, 8),
    ("Khoj Resort Shigar", "Shigar", 37170, 12),
    ("Kunhar Hotel River Side Naran", "Naran Kaghan", 10500, 20),
    ("Kutton Jagran Resort", "Kutton Valley", 4500, 0),
    ("Latitude Resort Kumrat", "Kumrat", 22000, 6),
    ("Lodges by Baron", "Northern Areas", 37500, 0),
    ("MP Hotel Karimabad", "Hunza", 9500, 0),
    ("MagPie 2 Hunza", "Hunza", 10500, 8),
    ("Maisonette Hotel Naran", "Naran Kaghan", 18000, 10),
    ("Mandarin Inn Gilgit", "Gilgit", 9500, 0),
    ("Mannat Hotel Islamabad", "Islamabad", 4500, 0),
    ("Maria Hotel Kalam", "Kalam", 17000, 15),
    ("Marjan Hotel Rawalakot", "Rawalakot", 7000, 0),
    ("Mingulu Broq Campsite", "Northern Areas", 8500, 0),
    ("Mir Continental Keran", "Keran", 6000, 0),
    ("Mir Continental Muzaffarabad", "Muzaffarabad", 6000, 0),
    ("Moksha Resort", "Northern Areas", 17000, 10),
    ("Mom Touch Hotel", "Northern Areas", 9500, 0),
    ("Mountain Inn Dao Khan", "Dao Khan", 6000, 0),
    ("Mountain Lagoon Skardu", "Skardu", 12500, 0),
    ("Mulberry Inn Astore", "Astore", 9500, 0),
    ("Nagar Fort", "Hunza", 13500, 10),
    ("Neelum Elites", "Neelum Valley", 8500, 12),
    ("Neelum View Hotel", "Muzaffarabad", 12500, 0),
    ("ORO Shogran", "Shogran", 16850, 7),
    ("Offto Resort Hunza", "Hunza", 19000, 5),
    ("PC Bhurban", "Bhurban", 40200, 5),
    ("PC Legacy Hunza", "Hunza", 13000, 0),
    ("Park Hotel Gilgit", "Gilgit", 7500, 0),
    ("Pearl Continental Attabad", "Attabad", 35500, 0),
    ("Pearl Continental Hotel Skardu", "Skardu", 28000, 10),
    ("Pearl Continental Malam Jabba", "Malam Jabba", 37600, 5),
    ("Pearl Continental Muzaffarabad", "Muzaffarabad", 30100, 5),
    ("Pine Court Luxury Resort", "Northern Areas", 40600, 7),
]


def guess_type(name):
    n = name.lower()
    if any(k in n for k in ["resort", "camp", "glamping", "cottage"]):
        return "resort"
    if "hotel" in n:
        return "hotel"
    if any(k in n for k in ["guest house", "inn", "lodge", "retreat"]):
        return "guest_house"
    return "hotel"


def guess_category(price):
    if price >= 30000:
        return "luxury"
    if price >= 12000:
        return "deluxe"
    return "standard"


class Command(BaseCommand):
    help = "Add sample hotels"

    def handle(self, *args, **options):
        added = 0
        for name, loc_name, price, discount in HOTELS:
            location, _ = Location.objects.get_or_create(name=loc_name)
            _, created = Hotel.objects.update_or_create(
                name=name,
                defaults={
                    "location": location,
                    "hotel_type": guess_type(name),
                    "category": guess_category(price),
                    "price_from": price,
                    "discount_percent": discount,
                    "is_featured": discount >= 20,
                },
            )
            added += created
        self.stdout.write(self.style.SUCCESS(f"{added} hotels added, total {Hotel.objects.count()}"))