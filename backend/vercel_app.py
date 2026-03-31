import os
import sys
import django
from django.conf import settings
from django.core.wsgi import get_wsgi_application
from pathlib import Path

# Add the backend directory to the Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Create the WSGI application
app = get_wsgi_application()