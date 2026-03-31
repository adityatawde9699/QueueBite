from django.urls import path
from .views import (
    RegisterView, UserView, OrderListView, OrderStatusUpdateView,
    MenuListView, OrderCreateView, UserActiveOrderView, PublicQueueView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('user/', UserView.as_view(), name='auth_user'),
    # Canteen Admin Order Management
    path('orders/', OrderListView.as_view(), name='order_list'),
    path('orders/<int:pk>/status/', OrderStatusUpdateView.as_view(), name='order_status_update'),
    
    # Public & General User endpoints
    path('menu/', MenuListView.as_view(), name='menu_list'),
    path('orders/place/', OrderCreateView.as_view(), name='order_place'),
    path('orders/my-order/', UserActiveOrderView.as_view(), name='user_active_order'),
    path('orders/queue/', PublicQueueView.as_view(), name='public_queue'),
    path('orders/live/', PublicQueueView.as_view(), name='public_live_queue'),
]
