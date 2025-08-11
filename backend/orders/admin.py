from django.contrib import admin
from .models import Profile, Canteen, MenuItem, Order, OrderItem

# To better display orders in the admin panel
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1
    readonly_fields = ('price_at_time_of_order',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('token', 'customer', 'canteen', 'status', 'created_at')
    list_filter = ('status', 'canteen', 'created_at')
    search_fields = ('token', 'customer__username')
    inlines = [OrderItemInline]

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_staff_member')

@admin.register(Canteen)
class CanteenAdmin(admin.ModelAdmin):
    list_display = ('name', 'location')

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'canteen', 'price', 'is_available')
    list_filter = ('canteen', 'is_available')
    search_fields = ('name',)

# We don't need to register OrderItem separately as it's an inline in OrderAdmin
