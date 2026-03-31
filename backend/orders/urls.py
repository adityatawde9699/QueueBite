from django.urls import path
from .views import RegisterView, UserView, OrderListView, OrderStatusUpdateView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('user/', UserView.as_view(), name='auth_user'),
    # Canteen Admin Order Management
    path('orders/', OrderListView.as_view(), name='order_list'),
    path('orders/<int:pk>/status/', OrderStatusUpdateView.as_view(), name='order_status_update'),
]
