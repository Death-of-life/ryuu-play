#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPTS_DIR="$ROOT_DIR/scripts"
STATUS_SCRIPT="$SCRIPTS_DIR/dev-status.sh"
START_SCRIPT="$SCRIPTS_DIR/dev-start.sh"
STOP_SCRIPT="$SCRIPTS_DIR/dev-stop.sh"
RESTART_SCRIPT="$SCRIPTS_DIR/dev-restart.sh"

for script in "$STATUS_SCRIPT" "$START_SCRIPT" "$STOP_SCRIPT" "$RESTART_SCRIPT"; do
  if [[ ! -x "$script" ]]; then
    echo "Missing or not executable: $script"
    exit 1
  fi
done

pause() {
  printf '\n按回车继续...'
  read -r _
}

show_menu() {
  clear
  echo "=============================="
  echo " RyuuPlay Dev Menu"
  echo "=============================="
  echo
  "$STATUS_SCRIPT" || true
  echo
  echo "1. 查看状态"
  echo "2. 启动服务"
  echo "3. 停止服务"
  echo "4. 重启服务"
  echo "0. 退出脚本"
  echo
}

while true; do
  show_menu
  read -r -p "请输入选项: " choice

  case "$choice" in
    1)
      echo
      "$STATUS_SCRIPT"
      pause
      ;;
    2)
      echo
      "$START_SCRIPT"
      pause
      ;;
    3)
      echo
      "$STOP_SCRIPT"
      pause
      ;;
    4)
      echo
      "$RESTART_SCRIPT"
      pause
      ;;
    0)
      echo "已退出。"
      exit 0
      ;;
    *)
      echo
      echo "无效选项：$choice"
      pause
      ;;
  esac
done
