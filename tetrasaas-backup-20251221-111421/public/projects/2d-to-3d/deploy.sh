#!/bin/bash
echo "🚀 استقرار خودکار تتراشاپ"
echo "========================"

# توقف سرور اگر در حال اجراست
if pgrep -f "node app.js" > /dev/null; then
    echo "⏹️  توقف سرور قبلی..."
    pkill -f "node app.js"
    sleep 2
fi

# بررسی Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js یافت نشد. لطفا نصب کنید."
    exit 1
fi

# نصب وابستگی‌ها
echo "📦 نصب وابستگی‌ها..."
npm install --silent

# ایجاد ساختار
echo "📁 ایجاد ساختار..."
mkdir -p public/uploads
mkdir -p projects/{chess,smart-writer,quantum-writer,secret-garden,speech-recognition}
mkdir -p logs database

# راه‌اندازی سرور در پس‌زمینه
echo "🚀 راه‌اندازی سرور..."
PORT=6000 nohup node app.js > tetrashop.log 2>&1 &
SERVER_PID=$!

# منتظر راه‌اندازی
echo "⏳ منتظر راه‌اندازی سرور..."
sleep 5

# بررسی وضعیت
if curl -s http://localhost:6000 > /dev/null; then
    echo "✅ سرور با موفقیت راه‌اندازی شد!"
    echo ""
    echo "📊 اطلاعات سرور:"
    echo "  • PID: $SERVER_PID"
    echo "  • پورت: 6000"
    echo "  • مسیر: $(pwd)"
    echo ""
    echo "🌐 آدرس‌های مهم:"
    echo "  📍 صفحه اصلی: http://localhost:6000"
    echo "  🎯 داشبورد: http://localhost:6000/dashboard"
    echo "  📊 آمار: http://localhost:6000/api/projects/status"
    echo "  💰 فروشگاه: http://localhost:6000/api/marketplace/products"
    echo ""
    echo "📋 لاگ‌ها:"
    echo "  tail -f tetrashop.log"
    echo ""
    echo "💰 برای شروع درآمدزایی:"
    echo "  1. به داشبورد مراجعه کنید"
    echo "  2. نمونه APIها را تست کنید"
    echo "  3. محصولات را به فروشگاه اضافه کنید"
else
    echo "❌ خطا در راه‌اندازی سرور"
    echo "🔍 بررسی لاگ: tail -n 20 tetrashop.log"
    exit 1
fi
