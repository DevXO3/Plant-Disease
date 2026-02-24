@echo off
cd backend
venv\Scripts\uvicorn app:app --reload
pause
