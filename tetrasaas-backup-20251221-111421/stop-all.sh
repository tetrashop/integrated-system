#!/bin/bash

echo "🛑 توقف کامل پلتفرم TetraSaaS"
echo "============================="

# توقف API Gateway
echo "⏳ توقف API Gateway..."
pkill -f "node server-simple.js" 2>/dev/null
pkill -f "node server.js" 2>/dev/null

# توقف تمام سرویس‌های پایتون
echo "⏳ توقف میکروسرویس‌ها..."
pkill -f "python app.py" 2>/dev/null

# حذف فایل‌های PID
PID_DIR="$HOME/tetra-pids"
if [ -d "$PID_DIR" ]; then
    echo "🗑️  حذف فایل‌های PID..."
    rm -rf "$PID_DIR"
fi

# کمی صبر کن
sleep 2

# بررسی پورت‌های اصلی
echo "🔍 بررسی پورت‌ها:"
for port in 8080 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010 3011 3012 3013 3014 3015 3016 3017 3018 3019 3020 3021 3022 3023; do
    if netstat -tuln 2>/dev/null | grep ":$port " >/dev/null; then
        echo "  ⚠️  پورت $port هنوز در حال استفاده است"
    else
        echo "  ✅ پورت $port آزاد است"
    fi
done

echo ""
echo "✅ پلتفرم TetraSaaS با موفقیت متوقف شد."
