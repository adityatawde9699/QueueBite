"""
Handle database initialization and migrations for Vercel deployment.
This script runs before the WSGI app starts to ensure the database is ready.
"""
import os
import sys
import django
from pathlib import Path

# Add the backend directory to the Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.management import call_command
from django.db import connection
from django.db.utils import OperationalError

def run_migrations():
    """Run migrations to set up the database."""
    try:
        print("Running Django migrations...")
        call_command('migrate', verbosity=1)
        print("✓ Migrations completed successfully")
    except Exception as e:
        print(f"✗ Migration error: {e}")
        raise

def seed_initial_data():
    """Seed initial menu data if database is empty."""
    try:
        from orders.models import Canteen, MenuItem
        
        # Check if data already exists
        if Canteen.objects.exists():
            print("✓ Canteen data already exists, skipping seed")
            return
        
        print("Seeding initial menu data...")
        call_command('seed_menu', verbosity=1)
        print("✓ Menu seed completed successfully")
    except Exception as e:
        print(f"⚠ Warning: Could not seed menu data: {e}")

def initialize_database():
    """Initialize database for deployment."""
    try:
        # Test database connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        print("✓ Database connection successful")
    except OperationalError:
        print("Database not initialized, running migrations...")
        run_migrations()
    
    # Seed initial data
    seed_initial_data()

if __name__ == '__main__':
    initialize_database()
