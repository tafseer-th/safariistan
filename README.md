# Safaristan

Pakistan tour website: hotels, tour packages, rent a car, sightseeing and bookings.

- **backend/**: Django REST Framework API and admin panel
- **frontend/**: Next.js website

## Run the backend

    cd backend
    python -m venv venv
    venv\Scripts\activate
    pip install django djangorestframework django-cors-headers django-filter pillow
    python manage.py migrate
    python manage.py seed_locations
    python manage.py seed_hotels
    python manage.py seed_tours
    python manage.py seed_cars
    python manage.py seed_places
    python manage.py createsuperuser
    python manage.py runserver

## Run the frontend

    cd frontend
    npm install
    npm run dev

Open http://localhost:3000 (website) and http://127.0.0.1:8000/admin/ (admin panel).
