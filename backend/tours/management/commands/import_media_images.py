import difflib
from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from cars.models import Vehicle
from sightseeing.models import Place
from tours.models import Destination, Tour

EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

# folder naam -> model
GROUPS = {
    "tour_images": Tour,
    "vehicle_images": Vehicle,
    "destination_images": Destination,
    "place_images": Place,
}


def clean_stem(path):
    """'Hunza-Serena.jpg.jpg' ya 'hunza serena.JPG' ko 'hunza-serena' bana do."""
    stem = path.name.lower()
    while Path(stem).suffix in EXTENSIONS:
        stem = Path(stem).stem
    return slugify(stem)


class Command(BaseCommand):
    help = "tour_images, vehicle_images, destination_images, place_images ki photos database se jodta hai"

    def add_arguments(self, parser):
        parser.add_argument("--list", action="store_true", help="Har folder mein sahi file naam ki list banao")
        parser.add_argument("--force", action="store_true", help="Pehle se lagi image bhi badal do")

    def handle(self, *args, **options):
        base = Path(settings.BASE_DIR)

        for folder_name, model in GROUPS.items():
            folder = base / folder_name
            folder.mkdir(exist_ok=True)

            if options["list"]:
                out = folder / "_names.txt"
                with open(out, "w", encoding="utf-8") as f:
                    for obj in model.objects.all().order_by("slug"):
                        f.write(f"{obj.slug}.jpg    <-    {obj}\n")
                self.stdout.write(self.style.SUCCESS(f"List ban gayi: {out}"))
                continue

            objects = {o.slug: o for o in model.objects.all()}
            files = [p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in EXTENSIONS]

            done, skipped, unmatched = 0, 0, []
            for p in sorted(files):
                slug = clean_stem(p)
                obj = objects.get(slug)
                if not obj:
                    unmatched.append((p.name, slug))
                    continue
                if obj.image and not options["force"]:
                    skipped += 1
                    continue
                with open(p, "rb") as f:
                    obj.image.save(f"{obj.slug}{p.suffix.lower()}", File(f), save=True)
                done += 1

            self.stdout.write(self.style.SUCCESS(
                f"[{folder_name}] {done} images lag gayin, {skipped} pehle se lagi thin, "
                f"{len(unmatched)} files match nahi hui"
            ))
            for name, slug in unmatched:
                close = difflib.get_close_matches(slug, objects.keys(), n=1, cutoff=0.6)
                hint = f"  ->  shayad: {close[0]}.jpg" if close else "  ->  koi match nahi"
                self.stdout.write(f"  X {name}{hint}")