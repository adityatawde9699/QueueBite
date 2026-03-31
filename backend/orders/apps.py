from django.apps import AppConfig


class OrdersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'orders'

    def ready(self):
        from django.db.models.signals import post_save
        from django.contrib.auth.models import User
        from .models import Profile

        def create_profile(sender, instance, created, **kwargs):
            """Auto-create Profile when a new User is created"""
            if created:
                try:
                    Profile.objects.get_or_create(user=instance, defaults={'is_staff_member': False})
                except Exception as e:
                    print(f"Error creating Profile for user {instance.username}: {e}")

        post_save.connect(create_profile, sender=User, dispatch_uid='create_profile_signal')
