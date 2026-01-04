# Open Supabase SQL Editor with instructions

$projectRef = "hibvqliztvfietfcylfm"
$sqlFile = "scripts\complete-setup-all.sql"

Write-Host ""
Write-Host "=" * 70
Write-Host "Opening Supabase SQL Editor".PadLeft(50)
Write-Host "=" * 70
Write-Host ""

$url = "https://app.supabase.com/project/$projectRef/sql/new"

Write-Host "Opening SQL Editor in browser..." -ForegroundColor Cyan
Start-Process $url

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. SQL Editor should open in your browser" -ForegroundColor White
Write-Host "  2. Open this file: $sqlFile" -ForegroundColor White
Write-Host "  3. Copy ALL SQL (Ctrl+A, Ctrl+C)" -ForegroundColor White
Write-Host "  4. Paste into SQL Editor (Ctrl+V)" -ForegroundColor White
Write-Host "  5. Click 'Run' button" -ForegroundColor White
Write-Host ""
Write-Host "After running SQL, generate your first image:" -ForegroundColor Green
Write-Host "  python scripts/generate-compendium-images.py monsters 1" -ForegroundColor Cyan
Write-Host ""

