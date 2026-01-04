# Script to update .env.local with Hugging Face credentials

$hfToken = "your_huggingface_api_token_here"
$hfModel = "stabilityai/stable-diffusion-xl-base-1.0"

Write-Host "Updating .env.local with Hugging Face credentials..." -ForegroundColor Cyan

if (Test-Path .env.local) {
    $content = Get-Content .env.local -Raw
    
    # Remove existing HF entries if any
    $lines = Get-Content .env.local | Where-Object {
        $_ -notmatch "HUGGINGFACE_API_TOKEN" -and
        $_ -notmatch "HUGGINGFACE_MODEL"
    }
    
    # Add HF credentials
    $lines += ""
    $lines += "# Hugging Face Inference API"
    $lines += "HUGGINGFACE_API_TOKEN=$hfToken"
    $lines += "HUGGINGFACE_MODEL=$hfModel"
    
    $lines | Set-Content .env.local
    Write-Host "[OK] Updated .env.local with Hugging Face credentials" -ForegroundColor Green
} else {
    # Create .env.local with HF credentials
    @"
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Service Role Key (for image generation - keep secret!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Hugging Face Inference API
HUGGINGFACE_API_TOKEN=$hfToken
HUGGINGFACE_MODEL=$hfModel

# Stable Diffusion Configuration (alternative)
# STABLE_DIFFUSION_API_URL=http://localhost:7860
"@ | Out-File -FilePath .env.local -Encoding UTF8
    
    Write-Host "[OK] Created .env.local with Hugging Face credentials" -ForegroundColor Green
    Write-Host "[ACTION REQUIRED] Still need to add Supabase credentials!" -ForegroundColor Yellow
}

Write-Host "`nHugging Face API is now configured!" -ForegroundColor Green
Write-Host "You can now generate images using:" -ForegroundColor Cyan
Write-Host "  python scripts/generate-compendium-images.py monsters 1" -ForegroundColor White

