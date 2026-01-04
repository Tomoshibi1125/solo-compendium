# PowerShell script to help set up environment variables
# Run this to create .env.local from .env.local.example

Write-Host "Setting up .env.local for image generation..." -ForegroundColor Cyan

if (Test-Path ".env.local") {
    Write-Host "`.env.local already exists." -ForegroundColor Yellow
    Write-Host "Checking for required keys..." -ForegroundColor Cyan
    
    $content = Get-Content ".env.local" -Raw
    $hasServiceKey = $content -match "SUPABASE_SERVICE_ROLE_KEY\s*="
    $hasSDUrl = $content -match "STABLE_DIFFUSION_API_URL\s*="
    
    if (-not $hasServiceKey) {
        Write-Host "`n[WARN] SUPABASE_SERVICE_ROLE_KEY not found in .env.local" -ForegroundColor Yellow
        Write-Host "Add this line to .env.local:" -ForegroundColor White
        Write-Host "SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here" -ForegroundColor Gray
    } else {
        Write-Host "[OK] SUPABASE_SERVICE_ROLE_KEY found" -ForegroundColor Green
    }
    
    if (-not $hasSDUrl) {
        Write-Host "`n[WARN] STABLE_DIFFUSION_API_URL not found in .env.local" -ForegroundColor Yellow
        Write-Host "Add this line when you have Stable Diffusion set up:" -ForegroundColor White
        Write-Host "STABLE_DIFFUSION_API_URL=http://localhost:7860" -ForegroundColor Gray
    } else {
        Write-Host "[OK] STABLE_DIFFUSION_API_URL found" -ForegroundColor Green
    }
} else {
    if (Test-Path ".env.local.example") {
        Write-Host "Copying .env.local.example to .env.local..." -ForegroundColor Cyan
        Copy-Item ".env.local.example" ".env.local"
        Write-Host "[OK] Created .env.local from template" -ForegroundColor Green
        Write-Host "`n[ACTION REQUIRED] Edit .env.local and add:" -ForegroundColor Yellow
        Write-Host "  1. Your SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor White
        Write-Host "  2. Your STABLE_DIFFUSION_API_URL (when ready)" -ForegroundColor White
    } else {
        Write-Host "[ERROR] .env.local.example not found" -ForegroundColor Red
        Write-Host "Creating basic .env.local template..." -ForegroundColor Cyan
        
        @"
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Service Role Key (for image generation - keep secret!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stable Diffusion Configuration
STABLE_DIFFUSION_API_URL=http://localhost:7860
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
        
        Write-Host "[OK] Created .env.local template" -ForegroundColor Green
        Write-Host "[ACTION REQUIRED] Edit .env.local and fill in your values" -ForegroundColor Yellow
    }
}

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env.local and add your Supabase Service Role Key" -ForegroundColor White
Write-Host "2. Run: python scripts/test-image-gen-setup.py" -ForegroundColor White
Write-Host "3. Once Stable Diffusion is running, add STABLE_DIFFUSION_API_URL" -ForegroundColor White

