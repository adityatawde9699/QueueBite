from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .serializers import (
    RegisterSerializer, UserSerializer, OrderSerializer,
    MenuItemSerializer, OrderCreateSerializer
)
from .models import Order, MenuItem, OrderItem, Canteen


# Custom permission: only staff members can access
class IsStaffMember(permissions.BasePermission):
    def has_permission(self, request, view):
        try:
            return request.user.profile.is_staff_member
        except Exception:
            return False


# View for registering a new user
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# View to get the current user's data
class UserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):  # type: ignore
        return self.request.user


# --- CANTEEN ADMIN: List all orders (staff only) ---
class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffMember]

    def get_queryset(self):  # type: ignore
        queryset = Order.objects.prefetch_related('items__menu_item').select_related('customer', 'canteen').order_by('-created_at')
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset


# --- CANTEEN ADMIN: Update a single order's status (staff only) ---
class OrderStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsStaffMember]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        valid_statuses = [s[0] for s in Order.STATUS_CHOICES]

        if not new_status:
            return Response({'error': 'Status field is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if new_status not in valid_statuses:
            return Response(
                {'error': f'Invalid status. Choose from: {valid_statuses}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status
        order.save()
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)


# --- GENERAL USER: List all available menu items ---
class MenuListView(generics.ListAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):  # type: ignore
        return MenuItem.objects.filter(is_available=True)


# --- GENERAL USER: Place an order ---
class OrderCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        if serializer.is_valid():
            canteen_id = serializer.validated_data.get('canteen_id')
            items_data = serializer.validated_data.get('items')
            
            try:
                canteen = Canteen.objects.get(id=canteen_id)
            except Canteen.DoesNotExist:
                return Response({'error': 'Canteen not found.'}, status=status.HTTP_404_NOT_FOUND)

            # Create the order
            order = Order.objects.create(
                customer=request.user,
                canteen=canteen,
                status='Pending'
            )

            # Create the items
            for item in items_data:
                try:
                    menu_item = MenuItem.objects.get(id=item['menu_item_id'], canteen=canteen)
                    if not menu_item.is_available:
                        return Response({'error': f'Item {menu_item.name} is not available.'}, status=status.HTTP_400_BAD_REQUEST)
                    OrderItem.objects.create(
                        order=order,
                        menu_item=menu_item,
                        quantity=item['quantity']
                    )
                except MenuItem.DoesNotExist:
                    order.delete() # Rollback order if item fails
                    return Response({'error': f"Menu Item {item['menu_item_id']} not found."}, status=status.HTTP_404_NOT_FOUND)

            response_serializer = OrderSerializer(order)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- GENERAL USER: Fetch user's active/recent order ---
class UserActiveOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Find the most recent order for the user that is not served or cancelled,
        # or just the most recent order within today
        order = Order.objects.filter(customer=request.user).order_by('-created_at').first()
        if not order:
            return Response({'message': 'No active order.'}, status=status.HTTP_204_NO_CONTENT)
        
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)


# --- PUBLIC: View the live queue token statuses ---
class PublicQueueView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # Fetch only orders that are in active states
        active_statuses = ['Pending', 'In Progress', 'Ready']
        orders = Order.objects.filter(status__in=active_statuses).order_by('created_at')
        
        # We can just use the regular OrderSerializer since tokens are public, 
        # but to optimize we could return a simpler dict. OrderSerializer is fine.
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

