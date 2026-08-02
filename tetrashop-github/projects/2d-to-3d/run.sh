<<<<<<< HEAD
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
||||||| (empty tree)
=======
#!/bin/bash

echo "🚀 اجرای سیستم تبدیل تصویر به مدل ۳D"
echo "====================================="

cd "$(dirname "$0")"

# بررسی وجود فایل‌ها
if [ ! -f "index.html" ]; then
    echo "❌ فایل index.html یافت نشد"
    exit 1
fi

if [ ! -f "real-algorithm.js" ]; then
    echo "⚠️ فایل real-algorithm.js یافت نشد. ایجاد می‌کنم..."
    cat > real-algorithm.js << 'JS'
console.log('سیستم تبدیل ۲D به ۳D');
JS
fi

# انتخاب پورت
PORT=${1:-8000}

# راه‌اندازی سرور
echo "🌐 در حال راه‌اندازی سرور روی پورت $PORT..."
echo "📂 پوشه: $(pwd)"
echo ""

# تلاش برای راه‌اندازی
if command -v python3 &> /dev/null; then
    echo "🐍 استفاده از Python3"
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    echo "🐍 استفاده از Python2"
    python -m SimpleHTTPServer $PORT
elif command -v php &> /dev/null; then
    echo "🐘 استفاده از PHP"
    php -S localhost:$PORT
else
    echo "❌ هیچ سرور HTTP یافت نشد"
    echo ""
    echo "راه‌حل‌های جایگزین:"
    echo "1. فایل index.html را مستقیماً در مرورگر باز کنید"
    echo "2. یک سرور HTTP نصب کنید"
    exit 1
fi
>>>>>>> 677dcad (🎯 سیستم کامل تبدیل تصویر به مدل ۳D - نسخه ۲.۰)
