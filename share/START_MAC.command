#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$SCRIPT_DIR/../dist"

if [ ! -d "$DIST_DIR" ]; then
  echo "找不到 dist/。请先在项目根目录运行：npm run build:share"
  exit 1
fi

cd "$DIST_DIR"
PORT="${PORT:-4173}"

echo "正在启动本地服务器：http://localhost:$PORT/"
echo "（保持此窗口打开，关闭即停止）"
python3 -m http.server "$PORT"

