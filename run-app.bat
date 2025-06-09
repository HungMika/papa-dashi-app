@echo off
echo ====== Starting Dashi App ======
cd /d "%~dp0"

:: Add Node.js portable to PATH
set "PATH=%CD%\nodejs-portable;%PATH%"

:: Chuyển vào thư mục app
cd app

:: Kill any process using port 3000 (Next.js dev server)
echo [*] Checking for existing process on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo [!] Port 3000 is in use. Killing process PID %%a...
    taskkill /PID %%a /F >nul 2>&1
)

:: check if node_modules exists
if not exist "node_modules" (
    echo [!] First time running: installing dependencies...
    call npm install
)

:: start Next.js dev server
echo [*] Starting Next.js and Electron...
call npm run start:both
