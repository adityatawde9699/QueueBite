#!/bin/bash
# Build script for Vercel deployment
# Install dependencies and collect static files

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Build completed successfully."