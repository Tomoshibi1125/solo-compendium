# Check if database migrations have been applied
# This script checks if the image columns exist in the database

param(
    [string]$SupabaseUrl = $env:VITE_SUPABASE_URL,
    [string]$ServiceKey = $env:SUPABASE_SERVICE_ROLE_KEY
)

if (-not $SupabaseUrl -or -not $ServiceKey) {
    Write-Host "[ERROR] Supabase credentials not found" -ForegroundColor Red
    Write-Host "Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local" -ForegroundColor Yellow
    exit 1
}

Write-Host "Checking database migrations..." -ForegroundColor Cyan

try {
    $headers = @{
        "apikey" = $ServiceKey
        "Authorization" = "Bearer $ServiceKey"
        "Content-Type" = "application/json"
    }
    
    # Check if image_url column exists by trying to query it
    $tables = @("compendium_monsters", "compendium_equipment", "compendium_relics", "compendium_jobs")
    $allGood = $true
    
    foreach ($table in $tables) {
        $url = "$SupabaseUrl/rest/v1/$table"
        $params = @{
            select = "id,image_url"
            limit = "1"
        }
        
        try {
            $response = Invoke-RestMethod -Uri $url -Method Get -Headers $headers -Body $params -ErrorAction Stop
            Write-Host "[OK] $table has image_url column" -ForegroundColor Green
        } catch {
            if ($_.Exception.Response.StatusCode.value__ -eq 400 -or $_.Exception.Message -match "column.*does not exist") {
                Write-Host "[FAIL] $table missing image_url column" -ForegroundColor Red
                Write-Host "   Run migration: supabase/migrations/20250109000000_add_compendium_images.sql" -ForegroundColor Yellow
                $allGood = $false
            } else {
                Write-Host "[WARN] Could not check $table : $($_.Exception.Message)" -ForegroundColor Yellow
            }
        }
    }
    
    if ($allGood) {
        Write-Host "`n[OK] All migrations appear to be applied!" -ForegroundColor Green
        exit 0
    } else {
        Write-Host "`n[ACTION REQUIRED] Please apply the migrations" -ForegroundColor Yellow
        exit 1
    }
    
} catch {
    Write-Host "[ERROR] Failed to check migrations: $_" -ForegroundColor Red
    exit 1
}

