from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer, UserSerializer, OrderSerializer
from .models import Order


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

