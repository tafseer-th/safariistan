#!/bin/sh
set -e
mkdir -p "$(dirname "$SQLITE_PATH")" "$MEDIA_ROOT"
python manage.py migrate --noinput
python manage.py import_hotel_images || true  # attaches hotel_images/ photos to hotels that have none (idempotent)
exec gunicorn tourapp.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 60 --access-logfile -
