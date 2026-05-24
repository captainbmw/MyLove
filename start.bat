@echo off
title Love Website
cd /d "%~dp0"
echo Starting your love website at http://localhost:8080
echo.
echo Keep this window open while she views the site.
echo Press Ctrl+C to stop the server.
echo.
start "" "http://localhost:8080"
python -m http.server 8080
if errorlevel 1 (
    echo Python not found. Trying py launcher...
    py -m http.server 8080
)
pause
