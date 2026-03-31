from django.core.management.base import BaseCommand
from orders.models import Canteen, MenuItem


class Command(BaseCommand):
    help = 'Seed initial canteen and menu items into the database.'

    def handle(self, *args, **options):
        # Create or get default canteen
        canteen, created = Canteen.objects.get_or_create(
            name='Main Canteen',
            defaults={'location': 'Campus Center'}
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f'Created canteen: {canteen.name}'))
        else:
            self.stdout.write(self.style.WARNING(f'Canteen already exists: {canteen.name}'))

        # define initial menu items
        initial_menu = [
            {
                'name': 'Veggie Burger',
                'description': '100% plant-based patty with lettuce, tomato, and vegan mayo',
                'price': 5.99,
                'is_available': True,
            },
            {
                'name': 'Chicken Wrap',
                'description': 'Grilled chicken, mixed greens, and house sauce',
                'price': 6.49,
                'is_available': True,
            },
            {
                'name': 'Fries',
                'description': 'Crispy golden fries with ketchup',
                'price': 2.49,
                'is_available': True,
            },
            {
                'name': 'Mixed Salad',
                'description': 'Fresh greens with cherry tomatoes and balsamic dressing',
                'price': 4.99,
                'is_available': True,
            },
        ]

        for item in initial_menu:
            menu_item, created_menu = MenuItem.objects.get_or_create(
                canteen=canteen,
                name=item['name'],
                defaults={
                    'description': item['description'],
                    'price': item['price'],
                    'is_available': item['is_available'],
                }
            )

            if created_menu:
                self.stdout.write(self.style.SUCCESS(f'Created menu item: {menu_item.name}'))
            else:
                # Update if item exists to ensure latest default values.
                menu_item.description = item['description']
                menu_item.price = item['price']
                menu_item.is_available = item['is_available']
                menu_item.canteen = canteen
                menu_item.save()
                self.stdout.write(self.style.WARNING(f'Updated existing menu item: {menu_item.name}'))

        self.stdout.write(self.style.SUCCESS('Menu seed complete.'))
