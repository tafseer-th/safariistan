#!/bin/sh
set -e
mkdir -p "$(dirname "$SQLITE_PATH")" "$MEDIA_ROOT"
python manage.py migrate --noinput
exec gunicorn tourapp.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 60 --access-logfile -
