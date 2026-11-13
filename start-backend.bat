@echo off
REM Starts the Safaristan backend on port 8001 (8000 is used by NovuRadar)
cd /d "%~dp0backend"
"venv\Scripts\python.exe" manage.py runserver 127.0.0.1:8001
pause
