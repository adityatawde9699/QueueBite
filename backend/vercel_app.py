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

# Initialize database and migrations on deployment
try:
    from django.core.management import call_command
    from django.db import connection
    from django.db.utils import OperationalError
    
    # Test database connection
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
    except OperationalError:
        # Database not initialized, run migrations
        print("Initializing database...")
        call_command('migrate', verbosity=0)
        # Seed initial data
        call_command('seed_menu', verbosity=0)
except Exception as e:
    # Log error but don't crash - the app can still run
    print(f"Warning during initialization: {e}")

# Create the WSGI application
app = get_wsgi_application()