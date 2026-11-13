from django.db import models
from django.utils.text import slugify

from tours.models import Destination


class Place(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    destination = models.ForeignKey(Destination, on_delete=models.PROTECT, related_name="places")
    short_description = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)
    highlights = models.TextField(blank=True, help_text="Ek line = ek khaas baat")
    best_time = models.CharField(max_length=100, blank=True, help_text="Jaise: April to October")
    image = models.ImageField(upload_to="places/", blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-is_featured", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)
            slug = base
            n = 2
            while Place.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{n}"
                n += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class PlaceImage(models.Model):
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="places/gallery/")
    caption = models.CharField(max_length=150, blank=True)

    def __str__(self):
        return f"{self.place.name} image"