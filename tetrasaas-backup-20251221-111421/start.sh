#!/bin/bash
echo "🚀 راه‌اندازی TetraShop در Termux"
echo "================================="

echo "🛑 توقف سرورهای قبلی..."
pkill -f "python3 -m http.server" 2>/dev/null
pkill -f "php -S" 2>/dev/null

echo "🔍 بررسی پورت 8080..."
if netstat -tuln 2>/dev/null | grep :8080 > /dev/null; then
    echo "⚠️  پورت 8080 در حال استفاده است. آزادسازی..."
    fuser -k 8080/tcp 2>/dev/null
    sleep 2
fi

echo "🚀 در حال راه‌اندازی سرور..."

echo "=================================================="
echo "🚀 TetraShop - نسخه Termux"
echo "=================================================="

# بررسی وجود پوشه public
if [ -d "public" ]; then
    echo "📁 استفاده از پوشه public"
    cd public
else
    echo "📁 استفاده از پوشه جاری"
fi

# راه‌اندازی سرور
echo "🌐 راه‌اندازی سرور روی پورت 8080..."
python3 -m http.server 8080 &

sleep 3

echo "✅ سرور با موفقیت راه‌اندازی شد"
echo "📌 پورت: 8080"
echo "🏠 میزبان: localhost"

echo ""
echo "🌐 آدرس‌های مهم:"
echo "   📍 صفحه اصلی: http://localhost:8080"
echo "   📍 صفحه اصلی: http://127.0.0.1:8080"
echo "   📁 پروژه‌ها:  http://localhost:8080/projects/"
echo ""
echo "💰 پیش‌بینی درآمد:"
echo "   • ماهانه: ۳۶,۰۰۰,۰۰۰ تومان"
echo ""
echo "🎯 برای تست:"
echo "   1. مرورگر خود را باز کنید"
echo "   2. آدرس http://localhost:8080 را وارد کنید"
echo "   3. روی پروژه‌ها کلیک کنید"
echo ""
echo "=================================================="
echo "⏳ سرور در حال اجرا..."
echo "برای خروج: Ctrl+C"
echo "=================================================="

# نگه داشتن اسکریپت فعال
wait
