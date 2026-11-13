from django.db import models
from django.utils.text import slugify


class Location(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Hotel(models.Model):
    TYPE_CHOICES = [
        ("guest_house", "Guest House"),
        ("hotel", "Hotel"),
        ("resort", "Resort"),
    ]
    CATEGORY_CHOICES = [
        ("standard", "Standard"),
        ("deluxe", "Deluxe"),
        ("luxury", "Luxury"),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    location = models.ForeignKey(Location, on_delete=models.PROTECT, related_name="hotels")
    hotel_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="hotel")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="standard")
    price_from = models.PositiveIntegerField(help_text="Starting price per night (Rs)")
    discount_percent = models.PositiveSmallIntegerField(default=0, help_text="0 = no discount")
    description = models.TextField(blank=True)
    address = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to="hotels/", blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)
            slug = base
            n = 2
            while Hotel.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{n}"
                n += 1
            self.slug = slug
        super().save(*args, **kwargs)

    @property
    def discounted_price(self):
        if self.discount_percent:
            return round(self.price_from * (100 - self.discount_percent) / 100)
        return self.price_from

    def __str__(self):
        return self.name


class HotelImage(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="hotels/gallery/")
    caption = models.CharField(max_length=150, blank=True)

    def __str__(self):
        return f"{self.hotel.name} image"


class Room(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name="rooms")
    name = models.CharField(max_length=150)
    price_per_night = models.PositiveIntegerField()
    capacity = models.PositiveSmallIntegerField(default=2, help_text="Max guests")
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="hotels/rooms/", blank=True, null=True)
    is_available = models.BooleanField(default=True)

    class Meta:
        ordering = ["price_per_night"]

    def __str__(self):
        return f"{self.hotel.name} - {self.name}"