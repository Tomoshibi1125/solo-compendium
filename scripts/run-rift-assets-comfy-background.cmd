@echo off
setlocal
cd /d "%~dp0.."
if not exist "public\generated\rift-ascendant-candidates\logs" mkdir "public\generated\rift-ascendant-candidates\logs"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-rift-assets-comfy-background.ps1"
exit /b %ERRORLEVEL%
