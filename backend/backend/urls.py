from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.http import HttpResponse

def home(request):
    return HttpResponse("QueueBite API is running successfully.")

urlpatterns = [
    path('', home, name='home'),
    path('api/', home, name='api-root'),
    path('admin/', admin.site.urls),
    # API URLs
    path('api/auth/', include('orders.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
