# Monitor Image Generation Progress
# Checks status every 60 seconds and displays progress

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "IMAGE GENERATION MONITOR" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$iteration = 0

while ($true) {
    $iteration++
    Write-Host "[$iteration] Checking status at $(Get-Date -Format 'HH:mm:ss')..." -ForegroundColor Yellow
    Write-Host ""
    
    python scripts/check-generation-status.py
    
    Write-Host ""
    Write-Host "Waiting 60 seconds before next check..." -ForegroundColor Gray
    Write-Host ""
    
    Start-Sleep -Seconds 60
}

