# Complete setup script - runs all checks and guides you through setup

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Image Generation Setup - Finalization" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Python
Write-Host "[1/5] Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "  $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "  [FAIL] Python not found" -ForegroundColor Red
    exit 1
}

# Step 2: Check packages
Write-Host "[2/5] Checking Python packages..." -ForegroundColor Yellow
try {
    python -c "import requests, PIL, dotenv; print('  [OK] All packages installed')" 2>&1
} catch {
    Write-Host "  [FAIL] Missing packages. Run: pip install -r requirements.txt" -ForegroundColor Red
    exit 1
}

# Step 3: Setup .env.local
Write-Host "[3/5] Checking .env.local..." -ForegroundColor Yellow
& "$PSScriptRoot/setup-env.ps1"

# Step 4: Check Supabase config
Write-Host "[4/5] Validating setup..." -ForegroundColor Yellow
python "$PSScriptRoot/test-image-gen-setup.py"

# Step 5: Check migrations
Write-Host "[5/5] Checking database migrations..." -ForegroundColor Yellow
& "$PSScriptRoot/check-migrations.ps1"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. If .env.local is incomplete, edit it and add:" -ForegroundColor White
Write-Host "   - SUPABASE_SERVICE_ROLE_KEY (from Supabase Dashboard → Settings → API)" -ForegroundColor Gray
Write-Host "   - STABLE_DIFFUSION_API_URL (when you have Stable Diffusion running)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. If migrations are missing, run in Supabase SQL Editor:" -ForegroundColor White
Write-Host "   - Open: scripts/apply-migrations.sql" -ForegroundColor Gray
Write-Host "   - Copy/paste into Supabase Dashboard → SQL Editor" -ForegroundColor Gray
Write-Host ""
Write-Host "3. When ready to generate images:" -ForegroundColor White
Write-Host "   python scripts/generate-compendium-images.py monsters 1" -ForegroundColor Gray
Write-Host ""

