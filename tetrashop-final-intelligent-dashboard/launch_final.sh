#!/bin/bash
echo "🚀 راه‌اندازی نهایی داشبورد هوشمند Tetrashop"
echo "============================================"

PORT=8085
while lsof -i :$PORT > /dev/null 2>&1; do
    echo "⚠️  پورت $PORT مشغول است. استفاده از پورت $((PORT + 1))"
    PORT=$((PORT + 1))
done

cd "$(dirname "$0")"
python3 -m http.server $PORT &
SERVER_PID=$!

echo $SERVER_PID > server.pid
echo "✅ سرور روی پورت $PORT راه‌اندازی شد (PID: $SERVER_PID)"
echo ""
echo "🌐 دسترسی‌ها:"
echo "   محلی: http://localhost:$PORT"
echo "   شبکه: http://$(hostname -I 2>/dev/null | awk '{print $1}' || echo '127.0.0.1'):$PORT"
echo ""
echo "🛠️  مدیریت:"
echo "   برای توقف: pkill -f \"http.server $PORT\""
echo "   برای وضعیت: netstat -tlnp | grep $PORT"
echo ""
echo "🤖 ویژگی‌های سیستم هوشمند:"
echo "   1. یادگیری خودکار از پروژه‌ها"
echo "   2. تحلیل هوشمند برای قیمت‌گذاری"
echo "   3. تشخیص خودکار روش اجرا"
echo "   4. شبیه‌سازی درگاه پرداخت"
echo "   5. پیشنهادات هوش مصنوعی"
