#!/bin/bash

echo "🎨 راه‌اندازی داشبورد Tetrashop"
echo "================================"

cd /data/data/com.termux/files/home/tetrashop-projects/core/dashboard

# بررسی Gateway
echo "🔍 بررسی Gateway API..."
if ! curl -s http://localhost:3000/health > /dev/null; then
    echo "⚠️  Gateway API در حال اجرا نیست"
    echo "   لطفا Gateway را در ترمینال دیگری اجرا کنید:"
    echo "   cd ~/tetrashop-projects && node core/gateway/server.js"
    echo ""
    echo "آیا ادامه دهیم؟ (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# نصب وابستگی‌ها
echo "📦 نصب وابستگی‌ها..."
npm install

# راه‌اندازی
echo "🚀 شروع داشبورد..."
echo "🌐 آدرس: http://localhost:3001"
echo "🔗 Gateway: http://localhost:3000"
echo ""
echo "📝 برای توقف: Ctrl+C"

node server.js
