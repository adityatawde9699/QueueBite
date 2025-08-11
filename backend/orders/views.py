from django.contrib.auth.models import User
from rest_framework import generics, permissions
from .serializers import RegisterSerializer, UserSerializer

# View for registering a new user
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny] # Anyone can register

# View to get the current user's data
class UserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated] # Only logged-in users can access

    # FIX: Added type hint to satisfy linter about override compatibility.
    def get_object(self): # type: ignore
        # We don't need a pk in the URL, we just return the current user
        return self.request.user
