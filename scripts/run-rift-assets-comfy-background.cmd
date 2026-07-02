@echo off
setlocal
cd /d "%~dp0.."
if not exist "art-archive\rift-ascendant-candidates\logs" mkdir "art-archive\rift-ascendant-candidates\logs"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-rift-assets-comfy-background.ps1"
exit /b %ERRORLEVEL%
