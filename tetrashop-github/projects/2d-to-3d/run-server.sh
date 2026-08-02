#!/bin/bash

echo "🚀 راه‌اندازی سرور تبدیل ۲D به ۳D"
echo "================================="

PORT=8000

# بررسی پورت‌های موجود
echo "🔍 بررسی پورت $PORT..."
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  پورت $PORT در حال استفاده است. تلاش برای پورت 8080..."
    PORT=8080
fi

# راه‌اندازی سرور
echo "🌐 سرور در حال راه‌اندازی روی پورت $PORT..."

if command -v python3 &> /dev/null; then
    echo "🐍 استفاده از Python3"
    python3 -m http.server $PORT &
elif command -v python &> /dev/null; then
    echo "🐍 استفاده از Python"
    python -m http.server $PORT &
else
    echo "❌ پایتون یافت نشد. تلاش برای استفاده از PHP..."
    if command -v php &> /dev/null; then
        php -S localhost:$PORT &
    else
        echo "❌ هیچ سرور HTTP یافت نشد"
        exit 1
    fi
fi

SERVER_PID=$!

echo ""
echo "✅ سرور راه‌اندازی شد!"
echo "📱 آدرس: http://localhost:$PORT"
echo "🎯 برای استفاده:"
echo "   1. مرورگر را باز کنید و به آدرس بالا بروید"
echo "   2. تصویر خود را آپلود کنید"
echo "   3. مدل ۳D واقعی را دریافت کنید"
echo ""
echo "🛑 برای توقف سرور: Ctrl+C"

wait $SERVER_PID
