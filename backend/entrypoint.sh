#!/bin/sh
set -e
mkdir -p "$(dirname "$SQLITE_PATH")" "$MEDIA_ROOT"
python manage.py migrate --noinput
python manage.py import_hotel_images || true  # attaches hotel_images/ photos to hotels that have none (idempotent)
# Vertical scaling: workers follow the server's CPU count (2 x cores + 1), so a
# bigger VPS is used automatically. Override with GUNICORN_WORKERS in .env.
CORES=$(nproc); [ "$CORES" -gt 4 ] && CORES=4  # cap at 9 workers to keep RAM in check
WORKERS="${GUNICORN_WORKERS:-$(( CORES * 2 + 1 ))}"
exec gunicorn tourapp.wsgi:application --bind 0.0.0.0:8000   --workers "$WORKERS" --threads "${GUNICORN_THREADS:-2}"   --timeout 60 --keep-alive 5 --max-requests 1000 --max-requests-jitter 100   --access-logfile -
