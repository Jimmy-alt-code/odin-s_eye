# Deepfake Radar Startup Script
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "🚀 Starting Deepfake Radar Application" -ForegroundColor Green
Write-Host "==============================================================" -ForegroundColor Cyan

# Function to check if port is available
function Test-Port {
    param($port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.ConnectAsync("127.0.0.1", $port).Wait(1000)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Stop any existing Node processes
Write-Host "🛑 Stopping existing Node processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait for processes to fully stop
Start-Sleep -Seconds 2

# Check if required directories exist
$backendPath = "C:\hackathon\deepfake_radar_backend"
$frontendPath = "C:\hackathon"

if (-not (Test-Path $backendPath)) {
    Write-Host "❌ Backend directory not found!" -ForegroundColor Red
    exit 1
}

# Start Backend Server
Write-Host "🔧 Starting Backend Server (Port 3001)..." -ForegroundColor Blue
$backendJob = Start-Job -ScriptBlock {
    Set-Location "C:\hackathon\deepfake_radar_backend"
    npm start
}

# Wait for backend to start
Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
$backendReady = $false
$attempts = 0
while (-not $backendReady -and $attempts -lt 20) {
    Start-Sleep -Seconds 2
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $backendReady = $true
            Write-Host "✅ Backend is ready!" -ForegroundColor Green
        }
    } catch {
        $attempts++
        Write-Host "⏳ Backend starting... attempt $attempts" -ForegroundColor Yellow
    }
}

if (-not $backendReady) {
    Write-Host "❌ Backend failed to start!" -ForegroundColor Red
    Receive-Job $backendJob
    exit 1
}

# Start Frontend Server  
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Blue
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "C:\hackathon"
    npm start
}

# Wait for frontend to start
Write-Host "⏳ Waiting for frontend to start..." -ForegroundColor Yellow
$frontendReady = $false
$attempts = 0
while (-not $frontendReady -and $attempts -lt 15) {
    Start-Sleep -Seconds 2
    
    # Check common ports (5173, 5174, 5175)
    foreach ($port in @(5173, 5174, 5175, 5176)) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$port" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                $frontendReady = $true
                Write-Host "✅ Frontend is ready on port $port!" -ForegroundColor Green
                $frontendPort = $port
                break
            }
        } catch {
            # Continue checking other ports
        }
    }
    
    if (-not $frontendReady) {
        $attempts++
        Write-Host "⏳ Frontend starting... attempt $attempts" -ForegroundColor Yellow
    }
}

if (-not $frontendReady) {
    Write-Host "❌ Frontend failed to start!" -ForegroundColor Red
    Receive-Job $frontendJob
    exit 1
}

Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "🎉 Deepfake Radar is Ready!" -ForegroundColor Green
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:3001" -ForegroundColor Blue
Write-Host "Frontend: http://localhost:$frontendPort" -ForegroundColor Blue
Write-Host ""
Write-Host "📖 Usage Instructions:" -ForegroundColor White
Write-Host "1. Open http://localhost:$frontendPort in your browser"
Write-Host "2. Upload a video, audio, or image file"
Write-Host "3. Click 'Start Analysis' to detect deepfakes"
Write-Host "4. Review the results and confidence scores"
Write-Host ""
Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow

# Keep script running and monitor jobs
try {
    while ($true) {
        # Check if jobs are still running
        if ($backendJob.State -ne "Running") {
            Write-Host "❌ Backend stopped unexpectedly!" -ForegroundColor Red
            break
        }
        if ($frontendJob.State -ne "Running") {
            Write-Host "❌ Frontend stopped unexpectedly!" -ForegroundColor Red
            break
        }
        
        Start-Sleep -Seconds 5
    }
} catch {
    Write-Host "🛑 Stopping services..." -ForegroundColor Yellow
}

# Cleanup
Stop-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
Remove-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
Write-Host "✅ Services stopped." -ForegroundColor Green
