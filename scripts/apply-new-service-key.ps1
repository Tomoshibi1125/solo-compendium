# PowerShell script to update Supabase Service Role Key in .env.local

param(
    [Parameter(Mandatory=$true)]
    [string]$ServiceRoleKey
)

$envFile = ".env.local"

Write-Host ""
Write-Host "=" * 70
Write-Host "Updating Supabase Service Role Key".PadLeft(50)
Write-Host "=" * 70
Write-Host ""

if (-not (Test-Path $envFile)) {
    Write-Host "ERROR: .env.local file not found!" -ForegroundColor Red
    Write-Host "Creating new .env.local file..."
    New-Item -Path $envFile -ItemType File | Out-Null
}

# Read current file
$content = Get-Content $envFile -Raw

# Remove old SUPABASE_SERVICE_ROLE_KEY if exists
$content = $content -replace '(?m)^SUPABASE_SERVICE_ROLE_KEY=.*$', ""

# Add new key
$newLine = "SUPABASE_SERVICE_ROLE_KEY=$ServiceRoleKey"

# Add to end if file doesn't end with newline
if ($content -notmatch '\n\s*$') {
    $content += "`n"
}

$content += "$newLine`n"

# Write back
Set-Content -Path $envFile -Value $content -NoNewline

Write-Host "Successfully updated SUPABASE_SERVICE_ROLE_KEY in .env.local" -ForegroundColor Green
Write-Host ""
Write-Host "Key format: $($ServiceRoleKey.Substring(0, [Math]::Min(20, $ServiceRoleKey.Length)))..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Verifying..." -ForegroundColor Yellow

# Verify
python -c "import os; from dotenv import load_dotenv; load_dotenv('.env.local'); key = os.getenv('SUPABASE_SERVICE_ROLE_KEY'); print(f'Verified: Key loaded (length: {len(key)})')"

Write-Host ""
Write-Host "Done! You can now test the connection:" -ForegroundColor Green
Write-Host "  python scripts/test-image-gen-setup.py" -ForegroundColor Cyan
Write-Host ""

