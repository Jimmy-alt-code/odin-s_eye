@echo off
title Deepfake Radar - Complete Application Launcher

echo.
echo ================================================================
echo                    DEEPFAKE RADAR LAUNCHER
echo ================================================================
echo.

echo [1/4] Checking dependencies...

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
)

if not exist "deepfake_radar_backend\node_modules" (
    echo Installing backend dependencies...
    cd deepfake_radar_backend
    call npm install
    cd ..
    if errorlevel 1 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
)

echo [2/4] Starting backend server...
start "Deepfake Radar Backend" cmd /k "cd deepfake_radar_backend && npm start"

echo [3/4] Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo [4/4] Starting frontend application...
start "Deepfake Radar Frontend" cmd /k "npm start"

echo.
echo ================================================================
echo                    LAUNCH COMPLETE!
echo ================================================================
echo.
echo Backend Server:  http://localhost:3001
echo Frontend App:    http://localhost:5173
echo.
echo The application will open in your default browser shortly...
echo.
echo To stop the application:
echo 1. Close both terminal windows that opened
echo 2. Or press Ctrl+C in each terminal
echo.
echo ================================================================
echo                 DEEPFAKE DETECTION READY!
echo ================================================================
echo.

REM Wait a bit more then open browser
timeout /t 3 /nobreak > nul
start http://localhost:5173

echo Press any key to close this launcher window...
pause > nul
