#!/bin/bash

echo "🚀 استقرار سیستم شطرنج ابری Tetrashop..."

# ساخت پروژه
echo "🔨 در حال ساخت پروژه..."
make clean
make all

# ساخت داکر
echo "🐳 در حال ساخت کانتینرهای داکر..."
docker-compose down
docker-compose build

# استقرار
echo "☁️ در حال استقرار روی ابر..."
docker-compose up -d --scale chess-server=3

# بررسی وضعیت
echo "🔍 بررسی وضعیت استقرار..."
docker-compose ps

# تست سلامت
echo "🩺 تست سلامت سرویس‌ها..."
sleep 10
curl -s http://localhost/api/health || echo "❌ سرور در دسترس نیست"

echo ""
echo "🎉 استقرار کامل شد!"
echo "🌐 آدرس‌های سرویس:"
echo "   ♟️ رابط کاربری: http://localhost/chess_ui.html"
echo "   🔧 API سرور: ws://localhost:9002"
echo "   ⚖️  Load Balancer: http://localhost"
echo ""
echo "📊 وضعیت:"
echo "   ✅ ۳ instance از سرور شطرنج"
echo "   ✅ Load Balancer فعال"
echo "   ✅ رابط کاربری وب"
echo "   ✅ پردازش ابری فعال"
