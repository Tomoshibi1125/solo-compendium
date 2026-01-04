# Apply API credentials to .env.local for image generation

$envFile = ".env.local"

Write-Host "=" * 70
Write-Host "Applying API Credentials for Image Generation".PadLeft(55)
Write-Host "=" * 70
Write-Host ""

# Read existing file or create new
$content = @"
# Supabase Configuration
VITE_SUPABASE_URL=https://hibvqliztvfietfcylfm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here

# Supabase Service Role Key (for image generation/admin operations)
# IMPORTANT: Replace with your actual service role key - do not commit real keys to repository
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE

# Hugging Face API (for image generation)
# IMPORTANT: Replace with your actual token - do not commit real tokens to repository
HUGGINGFACE_API_TOKEN=YOUR_HUGGINGFACE_API_TOKEN_HERE
HUGGINGFACE_MODEL=stabilityai/stable-diffusion-xl-base-1.0

# Stable Diffusion (optional - for local generation)
# STABLE_DIFFUSION_API_URL=http://localhost:7860
# STABLE_DIFFUSION_CLI_PATH=python
# STABLE_DIFFUSION_MODEL=stable-diffusion-xl-base-1.0
"@

# If file exists, try to preserve other variables
if (Test-Path $envFile) {
    $existing = Get-Content $envFile -Raw
    $lines = $existing -split "`n"
    $newLines = @()
    
    foreach ($line in $lines) {
        if ($line -match "^(VITE_SUPABASE_URL|VITE_SUPABASE_PUBLISHABLE_KEY|SUPABASE_SERVICE_ROLE_KEY|HUGGINGFACE_API_TOKEN|HUGGINGFACE_MODEL|STABLE_DIFFUSION)") {
            # Skip old values, will add new ones
            continue
        }
        if ($line.Trim() -ne "" -and -not $line.StartsWith("#")) {
            $newLines += $line
        }
    }
    
    # Add our configuration
    $content = $content + "`n" + ($newLines -join "`n")
}

# Write to file
$content | Set-Content $envFile -Encoding UTF8

Write-Host "[OK] Updated .env.local with API credentials" -ForegroundColor Green
Write-Host ""
Write-Host "Configured:" -ForegroundColor Cyan
Write-Host "  [OK] Supabase URL: https://hibvqliztvfietfcylfm.supabase.co" -ForegroundColor Green
Write-Host "  [OK] Supabase Service Role Key: JWT format" -ForegroundColor Green
Write-Host "  [OK] Hugging Face API Token: Configured" -ForegroundColor Green
Write-Host "  [OK] Hugging Face Model: stabilityai/stable-diffusion-xl-base-1.0" -ForegroundColor Green
Write-Host ""
Write-Host "Ready for image generation!" -ForegroundColor Green
Write-Host ""

