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
    from django.db.utils import OperationalError, ProgrammingError
    
    # Always attempt to run migrations on startup (ensures Profile table exists)
    try:
        print("Running migrations...")
        call_command('migrate', verbosity=0, interactive=False)
        print("Migrations completed successfully.")
        
        # Seed initial data if no canteens exist
        from orders.models import Canteen
        if Canteen.objects.count() == 0:
            print("Seeding menu data...")
            call_command('seed_menu', verbosity=0)
            print("Menu seed completed.")
    except Exception as init_error:
        print(f"Error during initialization: {init_error}")
        # App can still run, but with limited functionality
except Exception as e:
    # Log error but don't crash - the app can still run
    print(f"Warning during initialization setup: {e}")

# Create the WSGI application
app = get_wsgi_application()