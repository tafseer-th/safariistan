from django.core.management.base import BaseCommand
from sightseeing.models import Place
from tours.models import Destination

# (name, destination, best_time, short_description)
# NOTE: ye sirf SAMPLE data hai, asli details admin se check/badal lena.
PLACES = [
    ("Attabad Lake", "Hunza", "April to October", "Turquoise lake on the Karakoram Highway, famous for boat rides."),
    ("Baltit Fort", "Hunza", "April to October", "Historic fort above Karimabad with views over the Hunza valley."),
    ("Passu Cones", "Hunza", "May to October", "Dramatic cone-shaped peaks and the Hussaini suspension bridge nearby."),
    ("Eagle's Nest Duikar", "Hunza", "April to October", "Popular viewpoint for sunrise and sunset over Hunza and Rakaposhi."),
    ("Deosai National Park", "Skardu", "July to September", "High-altitude plains with wildflowers and Sheosar Lake."),
    ("Lower Kachura Lake", "Skardu", "April to October", "Calm lake near Skardu surrounded by orchards and mountains."),
    ("Katpana Cold Desert", "Skardu", "April to October", "Sand dunes set against snow-capped peaks near Skardu."),
    ("Saif-ul-Malook Lake", "Naran Kaghan", "June to September", "Alpine lake in Kaghan Valley with mountain reflections."),
    ("Lalazar", "Naran Kaghan", "June to September", "Green meadows and cool weather high above Kaghan."),
    ("Babusar Top", "Naran Kaghan", "June to September", "Mountain pass linking Kaghan Valley with Gilgit-Baltistan."),
    ("Fairy Meadows", "Fairy Meadows", "May to September", "Meadows with a close view of Nanga Parbat, reached by a trek."),
    ("Malam Jabba", "Malam Jabba", "December to March", "Hill resort in Swat known for skiing and chairlift rides."),
    ("Mahodand Lake", "Swat Kalam", "June to September", "Lake in the upper Swat valley, reached by a jeep track."),
    ("Jahaz Banda", "Kumrat Valley", "May to September", "Meadow and forest trek in the Upper Dir area near Kumrat."),
    ("Arang Kel", "Neelum Valley", "May to October", "Village on a hilltop in Neelum Valley, reached by a hike or cable car."),
    ("Ratti Gali Lake", "Ratti Gali", "July to September", "Glacial lake in Azad Kashmir, reached by a trek."),
    ("Kalash Valleys", "Chitral Kalash", "May and December festivals", "Valleys of the Kalash people, known for culture and festivals."),
    ("Siri Paye Meadows", "Shogran", "May to October", "Meadows above Shogran, reached by a jeep ride."),
    ("Pindi Point", "Murree", "March to October", "Viewpoint and chairlift area in Murree."),
]

HIGHLIGHTS = """Beautiful scenery and photo spots
Best visited with a private vehicle
Local food and tea nearby
Check weather and road conditions before travel"""


class Command(BaseCommand):
    help = "Add sample sightseeing places"

    def handle(self, *args, **options):
        created = 0
        for name, dest, best_time, short in PLACES:
            destination, _ = Destination.objects.get_or_create(name=dest)
            _, was_created = Place.objects.update_or_create(
                name=name,
                defaults={
                    "destination": destination,
                    "short_description": short,
                    "description": f"{short}\n\nA popular stop on trips to {dest}. Ask us to add it to your private tour.",
                    "highlights": HIGHLIGHTS,
                    "best_time": best_time,
                    "is_featured": name in {"Attabad Lake", "Deosai National Park", "Saif-ul-Malook Lake", "Fairy Meadows"},
                },
            )
            created += was_created
        self.stdout.write(self.style.SUCCESS(f"{created} places added, total {Place.objects.count()}"))