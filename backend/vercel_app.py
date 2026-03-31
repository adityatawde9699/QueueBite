import os
import sys
import django
from django.conf import settings
from django.core.wsgi import get_wsgi_application

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Create the WSGI application
app = get_wsgi_application()