# Deepfake Radar Startup Script
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Starting Deepfake Radar Application" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

# Stop any existing Node processes
Write-Host "Stopping existing Node processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait for processes to fully stop
Start-Sleep -Seconds 3

# Start Backend Server
Write-Host "Starting Backend Server on Port 3001..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\hackathon\deepfake_radar_backend'; Write-Host 'Backend Server Starting...' -ForegroundColor Green; npm start"

# Wait for backend to start
Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
$backendReady = $false
$attempts = 0
while (-not $backendReady -and $attempts -lt 15) {
    Start-Sleep -Seconds 2
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $backendReady = $true
            Write-Host "Backend is ready!" -ForegroundColor Green
            break
        }
    } catch {
        $attempts++
        Write-Host "Backend starting... attempt $attempts" -ForegroundColor Yellow
    }
}

if ($backendReady) {
    # Start Frontend Server  
    Write-Host "Starting Frontend Server..." -ForegroundColor Blue
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\hackathon'; Write-Host 'Frontend Server Starting...' -ForegroundColor Green; npm start"
    
    # Wait for frontend to start
    Start-Sleep -Seconds 8
    
    Write-Host "===============================================" -ForegroundColor Cyan
    Write-Host "Deepfake Radar is Ready!" -ForegroundColor Green
    Write-Host "===============================================" -ForegroundColor Cyan
    Write-Host "Backend:  http://localhost:3001" -ForegroundColor Blue
    Write-Host "Frontend: Check the frontend terminal for the correct port (likely 5174 or 5175)" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Usage Instructions:" -ForegroundColor White
    Write-Host "1. Open the frontend URL in your browser"
    Write-Host "2. Upload a video, audio, or image file"
    Write-Host "3. Click 'Start Analysis' to detect deepfakes"
    Write-Host "4. Review the results and confidence scores"
} else {
    Write-Host "Backend failed to start. Check the backend terminal for errors." -ForegroundColor Red
}
