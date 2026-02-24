@echo off
echo Starting Plant Disease Detection App...
start "Backend Server" start_backend.bat
start "Frontend App" start_frontend.bat
echo Both services started in new windows.
pause
