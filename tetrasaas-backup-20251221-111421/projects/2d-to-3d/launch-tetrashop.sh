#!/bin/bash

clear
echo "╔══════════════════════════════════════════╗"
echo "║      🚀 تتراشاپ - راه‌اندازی کامل       ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "📅 تاریخ: $(date)"
echo "🖥️  سیستم: $(uname -srm)"
echo "👤 کاربر: $(whoami)"
echo "📁 مسیر: $(pwd)"
echo ""

# 1. بررسی سیستم
echo "🔍 بررسی سیستم..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js نصب نیست!"
    echo "   دانلود: https://nodejs.org"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Git نصب نیست!"
    echo "   دانلود: https://git-scm.com"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo "✅ Git: $(git --version)"

# 2. نصب وابستگی‌ها
echo ""
echo "📦 نصب وابستگی‌ها..."
npm install --production

# 3. بررسی پورت
PORT=${PORT:-3000}
echo ""
echo "🔌 بررسی پورت $PORT..."
if lsof -i :$PORT > /dev/null 2>&1; then
    echo "⚠️  پورت $PORT در حال استفاده است!"
    read -p "آیا می‌خواهید پورت را تغییر دهید؟ (y/n): " change_port
    if [[ $change_port =~ ^[Yy]$ ]]; then
        read -p "پورت جدید را وارد کنید: " new_port
        PORT=$new_port
        export PORT
    fi
fi

# 4. ایجاد فایل‌های ضروری
echo ""
echo "📁 ایجاد فایل‌های ضروری..."
[ ! -f .env ] && cp .env.example .env
mkdir -p data/{logs,uploads,backups}

# 5. راه‌اندازی سرور
echo ""
echo "🚀 راه‌اندازی تتراشاپ..."
echo "🌐 پورت: $PORT"
echo "📊 پروژه‌ها: ۵ فعال"
echo "💰 درآمدزایی: آماده"
echo ""

# نمایش منو
echo "╔══════════════════════════════════════════╗"
echo "║               📋 منو اصلی                 ║"
echo "╠══════════════════════════════════════════╣"
echo "║ 1. 🚀 راه‌اندازی سرور                    ║"
echo "║ 2. 🌐 پوش به گیت‌هاب                     ║"
echo "║ 3. 🐳 ساخت Docker Image                  ║"
echo "║ 4. 📊 مشاهده آمار                       ║"
echo "║ 5. 🔧 تنظیمات                            ║"
echo "║ 6. 🆘 راهنما                            ║"
echo "║ 0. ❌ خروج                               ║"
echo "╚══════════════════════════════════════════╝"
echo ""

read -p "گزینه مورد نظر را انتخاب کنید: " choice

case $choice in
    1)
        echo "🚀 راه‌اندازی سرور روی پورت $PORT..."
        node server.js
        ;;
    2)
        echo "🌐 آماده‌سازی برای گیت‌هاب..."
        ./setup-github.sh
        ;;
    3)
        echo "🐳 ساخت Docker Image..."
        docker build -t tetrashop .
        echo "✅ Docker Image ساخته شد: tetrashop"
        echo "   اجرا: docker run -p 3000:3000 tetrashop"
        ;;
    4)
        echo "📊 آمار پروژه:"
        echo "   پروژه‌ها: ۵"
        echo "   فایل‌ها: $(find . -type f | wc -l)"
        echo "   سایز: $(du -sh . | cut -f1)"
        echo "   خطوط کد: $(find . -name "*.js" -o -name "*.html" -o -name "*.css" | xargs wc -l | tail -1 | awk '{print $1}')"
        ;;
    5)
        echo "🔧 تنظیمات:"
        echo "   1. تغییر پورت"
        echo "   2. تنظیم متغیرهای محیطی"
        echo "   3. تنظیمات دیتابیس"
        read -p "گزینه: " config_choice
        ;;
    6)
        echo "🆘 راهنما:"
        echo "   اسناد: https://tetrashop.ir/docs"
        echo "   گیت‌هاب: https://github.com/yourusername/tetrashop-projects"
        echo "   پشتیبانی: support@tetrashop.com"
        ;;
    0)
        echo "👋 با موفقیت خارج شدید!"
        exit 0
        ;;
    *)
        echo "❌ گزینه نامعتبر!"
        ;;
esac

echo ""
echo "🎉 تتراشاپ آماده است!"
echo "   آدرس: http://localhost:$PORT"
echo "   وضعیت: http://localhost:$PORT/api/status"
