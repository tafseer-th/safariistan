import difflib
from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from hotels.models import Hotel

EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def clean_stem(path):
    """'Hunza-Serena.jpg.jpg' ya 'hunza serena.JPG' ko 'hunza-serena' bana do."""
    stem = path.name.lower()
    while Path(stem).suffix in EXTENSIONS:
        stem = Path(stem).stem
    return slugify(stem)


class Command(BaseCommand):
    help = "hotel_images folder ki photos hotels ke saath jodta hai"

    def add_arguments(self, parser):
        parser.add_argument("--list", action="store_true", help="Hotel slugs ki list banao")
        parser.add_argument("--force", action="store_true", help="Pehle se lagi image bhi badal do")

    def handle(self, *args, **options):
        folder = Path(settings.BASE_DIR) / "hotel_images"
        folder.mkdir(exist_ok=True)

        if options["list"]:
            out = folder / "_hotel_names.txt"
            with open(out, "w", encoding="utf-8") as f:
                for h in Hotel.objects.order_by("name"):
                    f.write(f"{h.slug}.jpg    <-    {h.name}\n")
            self.stdout.write(self.style.SUCCESS(f"List ban gayi: {out}"))
            return

        hotels = {h.slug: h for h in Hotel.objects.all()}
        files = [p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in EXTENSIONS]

        done, skipped, unmatched = 0, 0, []
        for p in sorted(files):
            slug = clean_stem(p)
            hotel = hotels.get(slug)
            if not hotel:
                unmatched.append((p.name, slug))
                continue
            if hotel.image and not options["force"]:
                skipped += 1
                continue
            with open(p, "rb") as f:
                hotel.image.save(f"{hotel.slug}{p.suffix.lower()}", File(f), save=True)
            done += 1

        self.stdout.write(self.style.SUCCESS(
            f"{done} images lag gayin, {skipped} pehle se lagi thin, "
            f"{len(unmatched)} files match nahi hui"
        ))

        for name, slug in unmatched:
            close = difflib.get_close_matches(slug, hotels.keys(), n=1, cutoff=0.6)
            hint = f"  ->  shayad: {close[0]}.jpg" if close else "  ->  koi hotel match nahi"
            self.stdout.write(f"  X {name}{hint}")