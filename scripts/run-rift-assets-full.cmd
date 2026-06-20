@echo off
setlocal
cd /d "%~dp0.."

set "LOGDIR=public\generated\rift-ascendant-candidates\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%"

set "OUT=%LOGDIR%\rift-assets-full.out.log"
set "ERR=%LOGDIR%\rift-assets-full.err.log"
set "STATUS=%LOGDIR%\rift-assets-full-status.txt"
set "COMFY_URL=http://127.0.0.1:8188"
set "CHECKPOINT=sd_xl_base_1.0"

echo running: preflight > "%STATUS%"
echo [%DATE% %TIME%] Starting full Rift Ascendant ComfyUI asset workflow >> "%OUT%"
echo [%DATE% %TIME%] ComfyUI: %COMFY_URL% >> "%OUT%"
echo [%DATE% %TIME%] Checkpoint: %CHECKPOINT% >> "%OUT%"

echo running: audit > "%STATUS%"
node scripts\audit-assets.mjs >> "%OUT%" 2>> "%ERR%"
if errorlevel 1 goto failed

echo running: generate remaining typed candidates > "%STATUS%"
node scripts\generate-rift-assets.mjs --backend comfy --sd-url %COMFY_URL% --checkpoint %CHECKPOINT% --skip-existing --continue-on-error >> "%OUT%" 2>> "%ERR%"
if errorlevel 1 goto failed

echo running: approve current candidates > "%STATUS%"
node scripts\approve-rift-candidates.mjs --note "Approved by explicit user instruction that every generated image should fit its app/compendium entry." >> "%OUT%" 2>> "%ERR%"
if errorlevel 1 goto failed

echo running: apply reviewed candidates and post-checks > "%STATUS%"
node scripts\generate-rift-assets.mjs --apply >> "%OUT%" 2>> "%ERR%"
if errorlevel 1 goto failed

echo complete > "%STATUS%"
echo [%DATE% %TIME%] Full workflow complete >> "%OUT%"
exit /b 0

:failed
echo failed with exit code %ERRORLEVEL% > "%STATUS%"
echo [%DATE% %TIME%] Full workflow failed with exit code %ERRORLEVEL% >> "%ERR%"
exit /b %ERRORLEVEL%
