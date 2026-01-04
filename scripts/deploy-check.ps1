# Deployment Pre-Flight Check Script (PowerShell)

Write-Host "🔍 Running deployment pre-flight checks..." -ForegroundColor Cyan
Write-Host ""

# Check Node version
Write-Host "📦 Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node -v
Write-Host "   Node: $nodeVersion" -ForegroundColor Gray
if ($nodeVersion -notmatch "v(2[0-9]|1[89])") {
    Write-Host "   ⚠️  Warning: Node 20+ recommended" -ForegroundColor Yellow
}

# Check dependencies
Write-Host ""
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "   ❌ node_modules not found. Run 'npm install' first." -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Dependencies installed" -ForegroundColor Green

# Run linting
Write-Host ""
Write-Host "🔍 Running linter..." -ForegroundColor Yellow
npm run lint
$lintExit = $LASTEXITCODE
if ($lintExit -ne 0) {
    Write-Host "   ⚠️  Linting issues found (may be non-blocking)" -ForegroundColor Yellow
}

# Run type checking
Write-Host ""
Write-Host "🔍 Running type check..." -ForegroundColor Yellow
npm run typecheck
$typeExit = $LASTEXITCODE
if ($typeExit -ne 0) {
    Write-Host "   ❌ Type errors found!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Type check passed" -ForegroundColor Green

# Run tests
Write-Host ""
Write-Host "🧪 Running tests..." -ForegroundColor Yellow
npm run test -- --run
$testExit = $LASTEXITCODE
if ($testExit -ne 0) {
    Write-Host "   ❌ Tests failed!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Tests passed" -ForegroundColor Green

# Build
Write-Host ""
Write-Host "🏗️  Building for production..." -ForegroundColor Yellow
npm run build
$buildExit = $LASTEXITCODE
if ($buildExit -ne 0) {
    Write-Host "   ❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Build successful" -ForegroundColor Green

# Check dist folder
Write-Host ""
Write-Host "📁 Checking build output..." -ForegroundColor Yellow
if (-not (Test-Path "dist")) {
    Write-Host "   ❌ dist folder not found!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ dist folder created" -ForegroundColor Green

# Check for environment variables
Write-Host ""
Write-Host "🔐 Checking environment variables..." -ForegroundColor Yellow
if (-not $env:VITE_SUPABASE_URL) {
    Write-Host "   ⚠️  VITE_SUPABASE_URL not set (required for deployment)" -ForegroundColor Yellow
}
if (-not $env:VITE_SUPABASE_PUBLISHABLE_KEY) {
    Write-Host "   ⚠️  VITE_SUPABASE_PUBLISHABLE_KEY not set (required for deployment)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ All checks complete!" -ForegroundColor Green
Write-Host "🚀 Ready to deploy!" -ForegroundColor Cyan

