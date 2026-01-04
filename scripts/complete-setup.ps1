# Complete setup script - finalizes everything that can be automated

Write-Host "=" -NoNewline
Write-Host ("="*70) -NoNewline
Write-Host ""
Write-Host "  COMPLETE SETUP - FINALIZING CONFIGURATION" -ForegroundColor Cyan
Write-Host "=" -NoNewline
Write-Host ("="*70) -NoNewline
Write-Host ""
Write-Host ""

$envFile = ".env.local"

if (-not (Test-Path $envFile)) {
    Write-Host "[ERROR] .env.local not found" -ForegroundColor Red
    exit 1
}

$content = Get-Content $envFile -Raw
$needsUpdate = $false

# Check and update Supabase URL
if ($content -match "VITE_SUPABASE_URL\s*=\s*.*your_") {
    Write-Host "[ACTION REQUIRED] Supabase URL needs to be set" -ForegroundColor Yellow
    Write-Host "   Current: Placeholder value" -ForegroundColor White
    Write-Host "   Needed: Your actual Supabase project URL" -ForegroundColor White
    Write-Host ""
    Write-Host "   Get it from: Supabase Dashboard -> Settings -> API" -ForegroundColor Cyan
    Write-Host "   Format: https://xxxxx.supabase.co" -ForegroundColor Cyan
    Write-Host ""
    $needsUpdate = $true
} elseif ($content -match "VITE_SUPABASE_URL\s*=\s*(https://[^\s\n]+)") {
    $url = $matches[1]
    Write-Host "[OK] Supabase URL configured: $url" -ForegroundColor Green
} else {
    Write-Host "[WARN] Could not determine Supabase URL status" -ForegroundColor Yellow
}

# Check token
if ($content -match "SUPABASE_SERVICE_ROLE_KEY\s*=\s*(sbp_[^\s\n]+|eyJ[^\s\n]+)") {
    $token = $matches[1]
    $tokenType = if ($token -match "^sbp_") { "Access Token" } else { "Service Role Key" }
    Write-Host "[OK] Supabase token configured ($tokenType)" -ForegroundColor Green
} else {
    Write-Host "[WARN] Supabase token not found or incomplete" -ForegroundColor Yellow
    $needsUpdate = $true
}

# Check Hugging Face
if ($content -match "HUGGINGFACE_API_TOKEN\s*=\s*(hf_[^\s\n]+)") {
    Write-Host "[OK] Hugging Face API token configured" -ForegroundColor Green
} else {
    Write-Host "[WARN] Hugging Face token not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=" -NoNewline
Write-Host ("="*70) -NoNewline
Write-Host ""
Write-Host "  SUMMARY" -ForegroundColor Cyan
Write-Host "=" -NoNewline
Write-Host ("="*70) -NoNewline
Write-Host ""
Write-Host ""

if ($needsUpdate) {
    Write-Host "[ACTION REQUIRED] Please update .env.local with:" -ForegroundColor Yellow
    Write-Host "  1. VITE_SUPABASE_URL - Your Supabase project URL" -ForegroundColor White
    Write-Host ""
    Write-Host "After updating, run:" -ForegroundColor Cyan
    Write-Host "  python scripts/test-image-gen-setup.py" -ForegroundColor White
} else {
    Write-Host "[OK] Configuration looks good!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Apply migrations: scripts/apply-migrations.sql" -ForegroundColor White
    Write-Host "  2. Test setup: python scripts/test-image-gen-setup.py" -ForegroundColor White
    Write-Host "  3. Generate images: python scripts/generate-compendium-images.py monsters 1" -ForegroundColor White
}

Write-Host ""
Write-Host "Migrations Status:" -ForegroundColor Cyan
Write-Host "  Run in Supabase Dashboard -> SQL Editor:" -ForegroundColor White
Write-Host "  File: scripts/apply-migrations.sql" -ForegroundColor White
Write-Host ""

