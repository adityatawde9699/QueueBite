from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, Canteen, MenuItem, Order, OrderItem

# No changes to ProfileSerializer
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['is_staff_member']

# --- UPDATED UserSerializer ---
class UserSerializer(serializers.ModelSerializer):
    # We'll use a method to safely get the staff status.
    is_staff_member = serializers.SerializerMethodField()

    class Meta:
        model = User
        # The output will now include 'is_staff_member' directly.
        fields = ['id', 'username', 'email', 'is_staff_member']

    def get_is_staff_member(self, obj):
        """
        Safely checks if a user has a profile and is a staff member.
        Returns False if no profile exists, preventing a server crash.
        'obj' is the User instance being serialized.
        """
        try:
            return obj.profile.is_staff_member
        except Profile.DoesNotExist:
            return False

# --- No changes to the rest of the file ---

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    is_staff_member = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'is_staff_member')

    def create(self, validated_data):
        is_staff_member = validated_data.pop('is_staff_member', False)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        Profile.objects.create(user=user, is_staff_member=is_staff_member)
        return user

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source='menu_item.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'menu_item_name', 'quantity', 'price_at_time_of_order']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.username', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'customer_name', 'canteen', 'status', 'token', 'created_at', 'items']
