@echo off
setlocal
cd /d "%~dp0.."

set "LOGDIR=public\generated\rift-ascendant-candidates\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%"

set "OUT=%LOGDIR%\rift-assets-generate-apply.out.log"
set "ERR=%LOGDIR%\rift-assets-generate-apply.err.log"
set "STATUS=%LOGDIR%\rift-assets-generate-apply-status.txt"
set "COMFY_URL=http://127.0.0.1:8188"
set "CHECKPOINT=sd_xl_base_1.0"

echo running: generate remaining typed candidates > "%STATUS%"
echo [%DATE% %TIME%] Starting review-only generation workflow >> "%OUT%"
echo [%DATE% %TIME%] ComfyUI: %COMFY_URL% >> "%OUT%"
echo [%DATE% %TIME%] Checkpoint: %CHECKPOINT% >> "%OUT%"

node scripts\generate-rift-assets.mjs --backend comfy --sd-url %COMFY_URL% --checkpoint %CHECKPOINT% --skip-existing --continue-on-error >> "%OUT%" 2>> "%ERR%"
if errorlevel 1 goto failed

echo review-needed: generated candidates require visual approval before apply > "%STATUS%"
echo [%DATE% %TIME%] Generation finished. Candidates intentionally remain pending until visual review confirms they fit their compendium/app entries. >> "%OUT%"

echo complete > "%STATUS%"
echo [%DATE% %TIME%] Generation workflow complete; apply not run automatically. >> "%OUT%"
exit /b 0

:failed
echo failed with exit code %ERRORLEVEL% > "%STATUS%"
echo [%DATE% %TIME%] Review-only generation workflow failed with exit code %ERRORLEVEL% >> "%ERR%"
exit /b %ERRORLEVEL%
