@echo off
setlocal

set "COMFY_ROOT=C:\Users\jjcal\OneDrive\Desktop\ComfyUI"
set "COMFY_PY=%COMFY_ROOT%\venv\Scripts\python.exe"
set "REPO_ROOT=%~dp0.."
set "LOG_DIR=%REPO_ROOT%\art-archive\rift-ascendant-candidates\logs"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

if not exist "%COMFY_ROOT%\main.py" (
	echo ComfyUI main.py was not found at "%COMFY_ROOT%".
	exit /b 1
)

if not exist "%COMFY_PY%" (
	echo ComfyUI venv Python was not found at "%COMFY_PY%".
	echo Install ComfyUI dependencies or update this script to the correct Python path.
	exit /b 1
)

cd /d "%COMFY_ROOT%" || exit /b 1

echo Starting ComfyUI on http://127.0.0.1:8188
echo Logs:
echo   %LOG_DIR%\comfyui-live.out.log
echo   %LOG_DIR%\comfyui-live.err.log
echo Leave this window open while generating Rift Ascendant assets.

"%COMFY_PY%" main.py --listen 127.0.0.1 --port 8188 1>>"%LOG_DIR%\comfyui-live.out.log" 2>>"%LOG_DIR%\comfyui-live.err.log"
exit /b %ERRORLEVEL%
