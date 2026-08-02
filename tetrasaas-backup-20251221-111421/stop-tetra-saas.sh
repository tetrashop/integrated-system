#!/bin/bash

echo "🛑 توقف پلتفرم TetraSaaS..."
echo "============================"

# یافتن و توقف فرآیندها
echo "جستجوی فرآیندهای در حال اجرا..."

# API Gateway
if [ -f "/tmp/tetra_gateway.pid" ]; then
    GATEWAY_PID=$(cat /tmp/tetra_gateway.pid)
    if kill $GATEWAY_PID 2>/dev/null; then
        echo "✅ API Gateway متوقف شد (PID: $GATEWAY_PID)"
        rm -f "/tmp/tetra_gateway.pid"
    fi
fi

# میکروسرویس‌ها
for service in formula-solver content-analyzer "3d-converter"; do
    pid_file="/tmp/tetra_${service}.pid"
    if [ -f "$pid_file" ]; then
        SERVICE_PID=$(cat "$pid_file")
        if kill $SERVICE_PID 2>/dev/null; then
            echo "✅ $service متوقف شد (PID: $SERVICE_PID)"
            rm -f "$pid_file"
        fi
    fi
done

# توقف کلی تمام فرآیندهای مرتبط
echo "توقف کلی فرآیندهای باقی‌مانده..."
pkill -f "node server.js" 2>/dev/null && echo "✅ فرآیندهای Node.js متوقف شدند"
pkill -f "python app.py" 2>/dev/null && echo "✅ فرآیندهای Python متوقف شدند"

# بررسی پورت‌های آزاد
echo ""
echo "🔍 بررسی پورت‌ها:"
for port in 8080 3008 3009 3010; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "   ⚠️  پورت $port هنوز در حال استفاده است"
    else
        echo "   ✅ پورت $port آزاد است"
    fi
done

echo ""
echo "🎯 پلتفرم TetraSaaS با موفقیت متوقف شد."
