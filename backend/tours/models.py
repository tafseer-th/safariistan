from django.db import models
from django.utils.text import slugify


class Destination(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    image = models.ImageField(upload_to="destinations/", blank=True, null=True)
    is_popular = models.BooleanField(default=False)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Tour(models.Model):
    CATEGORY_CHOICES = [
        ("standard", "Standard"),
        ("honeymoon", "Honeymoon"),
        ("family", "Family"),
        ("group", "Group"),
    ]
    DEPARTURE_CHOICES = [
        ("lahore", "Lahore"),
        ("islamabad", "Islamabad"),
        ("karachi", "Karachi"),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    destination = models.ForeignKey(Destination, on_delete=models.PROTECT, related_name="tours")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="standard")
    departure_city = models.CharField(max_length=20, choices=DEPARTURE_CHOICES, default="islamabad")
    days = models.PositiveSmallIntegerField(default=3)
    nights = models.PositiveSmallIntegerField(default=2)
    price_per_person = models.PositiveIntegerField(help_text="Price per person (Rs)")
    discount_percent = models.PositiveSmallIntegerField(default=0, help_text="0 = no discount")
    summary = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)
    inclusions = models.TextField(blank=True, help_text="Ek line = ek cheez")
    exclusions = models.TextField(blank=True, help_text="Ek line = ek cheez")
    image = models.ImageField(upload_to="tours/", blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-is_featured", "title"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug = base
            n = 2
            while Tour.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{n}"
                n += 1
            self.slug = slug
        super().save(*args, **kwargs)

    @property
    def discounted_price(self):
        if self.discount_percent:
            return round(self.price_per_person * (100 - self.discount_percent) / 100)
        return self.price_per_person

    @property
    def duration_label(self):
        return f"{self.days} Days / {self.nights} Nights"

    def __str__(self):
        return self.title


class ItineraryDay(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="itinerary")
    day_number = models.PositiveSmallIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["day_number"]

    def __str__(self):
        return f"{self.tour.title} - Day {self.day_number}"


class TourImage(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="tours/gallery/")
    caption = models.CharField(max_length=150, blank=True)

    def __str__(self):
        return f"{self.tour.title} image"