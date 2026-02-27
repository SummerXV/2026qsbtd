@echo off
setlocal

set "DIST_DIR=%~dp0..\dist"

if not exist "%DIST_DIR%" (
  echo 找不到 dist\ 。请先在项目根目录运行：npm run build:share
  exit /b 1
)

cd /d "%DIST_DIR%"

set "PORT=4173"
echo 正在启动本地服务器：http://localhost:%PORT%/
echo （保持此窗口打开，关闭即停止）

py -3 -m http.server %PORT% 1>nul 2>nul
if %errorlevel% neq 0 (
  python -m http.server %PORT%
)

endlocal

