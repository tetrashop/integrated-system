#!/bin/bash
echo "🎯 اجرای مستقیم تتراشاپ"
echo "======================"

# توقف فرآیندهای قبلی
pkill -f "node app.js" 2>/dev/null || true

# بررسی Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js یافت نشد"
    exit 1
fi

# نصب وابستگی‌ها اگر نیاز باشد
if [ ! -d "node_modules" ]; then
    echo "📦 نصب وابستگی‌ها..."
    npm install --silent
fi

# ایجاد ساختار
mkdir -p public/uploads projects logs

echo ""
echo "🚀 شروع سرور تتراشاپ روی پورت 6000..."
echo "===================================="
echo ""
echo "🌐 پس از راه‌اندازی، به آدرس‌های زیر مراجعه کنید:"
echo "  📍 http://localhost:6000"
echo "  🎯 http://localhost:6000/dashboard"
echo ""
echo "⚡ برای توقف: Ctrl+C"
echo ""

# اجرای سرور
node app.js
