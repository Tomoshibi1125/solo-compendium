@echo off
title Rift Ascendant - Sync Static Data to Supabase
echo ============================================
echo  RIFT ASCENDANT: Static to Supabase Sync
echo ============================================
echo.
echo This will push all local static compendium data
echo (jobs, paths, backgrounds, items, spells, etc.)
echo to your Supabase database.
echo.
echo Press any key to start, or Ctrl+C to cancel...
pause > nul

cd /d "%~dp0"

echo.
echo [1/2] Checking Node...
call node --version
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js 20+.
    pause
    exit /b 1
)

echo.
echo [2/2] Running sync...
echo.
call npx tsx scripts/sync-static-to-db.ts

echo.
if errorlevel 1 (
    echo SYNC FAILED -- check output above. Log: sync-log.txt
) else (
    echo SYNC COMPLETE -- Log saved to: sync-log.txt
)
echo.
pause
