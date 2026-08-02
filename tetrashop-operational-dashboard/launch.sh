#!/bin/bash
echo "🚀 راه‌اندازی داشبورد عملیاتی Tetrashop"
echo "========================================"

cd "/data/data/com.termux/files/home/tetrashop-operational-dashboard"

# بررسی پورت‌ها
PORT=8083
while lsof -i :$PORT > /dev/null 2>&1; do
    echo "⚠️  پورت $PORT در حال استفاده است. درخواست آزادسازی..."
    pkill -f "python3.*$PORT" 2>/dev/null
    sleep 2
    PORT=$((PORT + 1))
done

# راه‌اندازی سرور
echo "🌐 راه‌اندازی سرور روی پورت: $PORT"
python3 project_manager.py &
SERVER_PID=$!

# ذخیره PID
echo $SERVER_PID > server.pid

echo "✅ سرور راه‌اندازی شد (PID: $SERVER_PID)"
echo ""
echo "📱 برای دسترسی:"
echo "   آدرس محلی: http://localhost:$PORT"
echo "   آدرس شبکه: http://$(hostname -I 2>/dev/null | awk '{print $1}'):$PORT"
echo ""
echo "🛠️  دستورات مدیریت:"
echo "   برای توقف: ./stop.sh"
echo "   برای وضعیت: ./status.sh"
echo ""
echo "🎯 پروژه‌های شناسایی شده:"
python3 -c "
import json
try:
    with open('projects_analysis.json', 'r') as f:
        projects = json.load(f)
    for p in projects:
        print(f'   • {p[\"name\"]} ({p[\"type\"]}) - {len(p[\"files\"])} فایل')
except:
    print('   (در حال تحلیل...)')
"
