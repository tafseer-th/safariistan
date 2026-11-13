from django.core.management.base import BaseCommand
from hotels.models import Location

NAMES = [
    "Nathiagali", "Hunza", "Attabad", "Gilgit", "Besham", "Islamabad", "Rawalakot",
    "Sudhan Gali", "Dao Khan", "Leepa", "Phander", "Shogran", "Sharda", "Keran",
    "Kutton Valley", "Neelum Valley", "Astore", "Minimarg", "Muzaffarabad", "Murree",
    "Bhurban", "Kumrat", "Kalam", "Malam Jabba", "Swat", "Fairy Meadows",
    "Naran Kaghan", "Khaplu", "Shigar", "Skardu", "Ayun", "Chitral", "Nagar Chitral",
    "Taobat",
]


class Command(BaseCommand):
    help = "Add default locations"

    def handle(self, *args, **options):
        created = 0
        for name in NAMES:
            _, was_created = Location.objects.get_or_create(name=name)
            created += was_created
        self.stdout.write(self.style.SUCCESS(f"{created} locations added"))