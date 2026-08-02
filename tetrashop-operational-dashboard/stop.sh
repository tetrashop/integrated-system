#!/bin/bash
echo "🛑 توقف داشبورد عملیاتی..."
cd "/data/data/com.termux/files/home/tetrashop-operational-dashboard"

if [ -f "server.pid" ]; then
    PID=$(cat server.pid)
    if kill -0 $PID 2>/dev/null; then
        kill $PID
        echo "✅ سرور متوقف شد (PID: $PID)"
        rm server.pid
    else
        echo "⚠️  پروسه فعال نیست"
    fi
else
    echo "⚠️  فایل PID یافت نشد"
    pkill -f "project_manager.py" 2>/dev/null && echo "✅ پروسه‌های مرتبط متوقف شدند"
fi
