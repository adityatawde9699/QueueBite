from django.db import models
from django.conf import settings
import uuid

# Extending the built-in User model to add roles
class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_staff_member = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

class Canteen(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name

class MenuItem(models.Model):
    canteen = models.ForeignKey(Canteen, related_name='menu_items', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Ready', 'Ready for Pickup'),
        ('Served', 'Served'),
        ('Cancelled', 'Cancelled'),
    ]

    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    canteen = models.ForeignKey(Canteen, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    token = models.CharField(max_length=10, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.token:
            # Generate a unique token, e.g., T# followed by 3 random digits
            self.token = f'T#{str(uuid.uuid4().int)[:3].zfill(3)}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.token} by {self.customer.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price_at_time_of_order = models.DecimalField(max_digits=6, decimal_places=2)

    def save(self, *args, **kwargs):
        # Store the price of the item when the order is created
        # FIX: Changed `self.id` to `self.pk` to be more explicit for linters.
        if self.pk is None:
            self.price_at_time_of_order = self.menu_item.price
        super().save(*args, **kwargs)
    
    def get_total_item_price(self):
        return self.quantity * self.price_at_time_of_order

    def __str__(self):
        return f"{self.quantity} of {self.menu_item.name}"
