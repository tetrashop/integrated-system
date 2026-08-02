#!/bin/bash

echo "🚀 راه‌اندازی سیستم مدیریت خطای Tetra SaaS v2.0"
echo "=============================================="

# تنظیمات
PROJECT_DIR="/data/data/com.termux/files/home/tetrashop-projects/tetra-error-system"
cd "$PROJECT_DIR"

# ۱. بررسی Node.js و npm
echo "📦 بررسی پیش‌نیازها..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js نصب نیست. ابتدا Node.js نصب کنید."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm نصب نیست. ابتدا npm نصب کنید."
    exit 1
fi

echo "✅ Node.js $(node -v) و npm $(npm -v) نصب هستند."

# ۲. نصب وابستگی‌ها
echo "📦 نصب وابستگی‌ها..."
npm install

# ۳. تنظیم فایل محیطی
echo "⚙️  پیکربندی محیط..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "⚠️  فایل .env ایجاد شد. لطفاً مقادیر را تنظیم کنید."
    else
        echo "# تنظیمات محیطی Tetra Error System" > .env
        echo "NODE_ENV=development" >> .env
        echo "PORT=3000" >> .env
        echo "# SENTRY_DSN=your-sentry-dsn-here" >> .env
        echo "# SLACK_WEBHOOK_URL=your-slack-webhook" >> .env
        echo "✅ فایل .env ایجاد شد."
    fi
else
    echo "✅ فایل .env از قبل موجود است."
fi

# ۴. کامپایل TypeScript
echo "🔨 کامپایل TypeScript..."
if npm run build; then
    echo "✅ کامپایل موفقیت‌آمیز بود."
else
    echo "❌ خطا در کامپایل. بررسی کنید:"
    npx tsc --noEmit
    exit 1
fi

# ۵. ایجاد پوشه‌های لازم
echo "📁 ایجاد ساختار پوشه‌ها..."
mkdir -p logs metrics reports backups

# ۶. تست سیستم
echo "🧪 اجرای تست‌های اولیه..."
if [ -f "dist/index.js" ]; then
    node dist/index.js 2>&1 | head -20
    echo "..." 
    echo "✅ تست اولیه اجرا شد."
else
    echo "⚠️  فایل اجرایی یافت نشد."
fi

# ۷. نمایش اطلاعات
echo ""
echo "🎉 راه‌اندازی کامل شد!"
echo ""
echo "📊 دسترسی به سرویس‌ها:"
echo "   - سرویس اصلی:       http://localhost:3000"
echo "   - متریک‌ها:         http://localhost:3000/metrics"
echo "   - سلامت سرویس:      http://localhost:3000/health"
echo "   - گزارش خطاها:      http://localhost:3000/api/errors/report"
echo "   - تحلیل MTTR:       http://localhost:3000/api/analytics/mttr"
echo ""
echo "🔧 دستورات مفید:"
echo "   npm run dev          # اجرا در حالت توسعه"
echo "   npm start            # اجرا در حالت تولید"
echo "   npm run build        # کامپایل مجدد"
echo "   npm test             # اجرای تست‌ها"
echo ""
echo "📈 نکات مهم:"
echo "   1. فایل .env را با مقادیر واقعی پر کنید"
echo "   2. برای Sentry، DSN خود را در .env قرار دهید"
echo "   3. سیستم به طور خودکار خطاها را تحلیل و اولویت‌بندی می‌کند"
echo "   4. داده‌های تاریخی در حافظه ذخیره می‌شوند (برای تولید به دیتابیس نیاز است)"
echo ""
echo "🔄 برای شروع سرویس:"
echo "   cd $PROJECT_DIR"
echo "   npm start"
echo ""
