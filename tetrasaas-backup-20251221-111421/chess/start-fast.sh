#!/bin/bash

echo "♟️  راه‌اندازی فوری موتور شطرجد..."
echo "================================"

# توقف سرورهای قبلی
pkill -f "node.*server.js" 2>/dev/null
sleep 2

# یافتن پورت آزاد
find_port() {
    for port in {7500..7600}; do
        if ! netstat -tulpn 2>/dev/null | grep -q :$port && ! lsof -i :$port 2>/dev/null; then
            echo $port
            return
        fi
    done
    echo 7555
}

PORT=$(find_port)

echo "📊 اطلاعات:"
echo "├── پورت: $PORT"
echo "├── مسیر: $(pwd)"
echo "└── زمان: $(date '+%H:%M:%S')"

# تنظیم پورت در فایل سرور
sed -i "s/const PORT = process.env.PORT || [0-9]*/const PORT = process.env.PORT || $PORT/" api/server.js

# اجرای تست
echo ""
echo "🧪 اجرای تست‌ها..."
node test-engine.js
echo ""
node test.js

# راه‌اندازی سرور اصلی
echo ""
echo "🚀 در حال راه‌اندازی سرور اصلی..."
node api/server.js
