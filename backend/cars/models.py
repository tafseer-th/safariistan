from django.db import models
from django.utils.text import slugify


class Vehicle(models.Model):
    TYPE_CHOICES = [
        ("car", "Car"),
        ("suv", "SUV"),
        ("jeep", "Jeep"),
        ("van", "Van"),
        ("coaster", "Coaster"),
        ("bus", "Bus"),
    ]
    DRIVER_CHOICES = [
        ("with_driver", "With driver"),
        ("self_drive", "Self drive"),
        ("both", "With driver or self drive"),
    ]
    TRANSMISSION_CHOICES = [
        ("manual", "Manual"),
        ("automatic", "Automatic"),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    vehicle_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="car")
    seats = models.PositiveSmallIntegerField(default=4)
    transmission = models.CharField(max_length=20, choices=TRANSMISSION_CHOICES, default="manual")
    has_ac = models.BooleanField(default=True)
    driver_option = models.CharField(max_length=20, choices=DRIVER_CHOICES, default="with_driver")
    price_per_day = models.PositiveIntegerField(help_text="Rate per day (Rs)")
    discount_percent = models.PositiveSmallIntegerField(default=0, help_text="0 = no discount")
    description = models.TextField(blank=True)
    features = models.TextField(blank=True, help_text="Ek line = ek feature")
    image = models.ImageField(upload_to="cars/", blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["price_per_day"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)
            slug = base
            n = 2
            while Vehicle.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{n}"
                n += 1
            self.slug = slug
        super().save(*args, **kwargs)

    @property
    def discounted_price(self):
        if self.discount_percent:
            return round(self.price_per_day * (100 - self.discount_percent) / 100)
        return self.price_per_day

    def __str__(self):
        return self.name