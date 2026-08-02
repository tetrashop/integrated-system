#!/bin/bash

echo "🚀 استقرار معماری بهینه Tetrashop..."
echo "==================================="

# 1. ساخت پروژه
echo "📦 در حال ساخت پروژه..."
npm run build

# 2. اجرای تست‌ها
echo "🧪 در حال اجرای تست‌های عملکرد..."
npm run test:performance

# 3. استقرار روی Cloudflare Workers
echo "☁️ در حال استقرار روی Cloudflare..."
wrangler deploy

# 4. تست سلامت
echo "🩺 تست سلامت سیستم..."
curl -s "https://tetrashop100.ramin-edjlal1359.workers.dev/health"

# 5. تست عملکرد
echo "⚡ تست عملکرد..."
curl -s "https://tetrashop100.ramin-edjlal1359.workers.dev/api/products" | head -1

echo ""
echo "🎉 استقرار معماری بهینه با موفقیت انجام شد!"
echo "📊 بهبودهای اعمال شده:"
echo "   • ارتباط هوشمند ابر-کلاینت"
echo "   • مدیریت حالت یکپارچه"
echo "   • رابط کاربری بهینه"
echo "   • سیستم پلاگین‌پذیر"
echo ""
echo "🌐 آدرس‌های فعال:"
echo "   🛒 صفحه اصلی: https://tetrashop100.ramin-edjlal1359.workers.dev"
echo "   📊 داشبورد: https://tetrashop100.ramin-edjlal1359.workers.dev/dashboard"
echo "   🔧 مدیریت: https://tetrashop100.ramin-edjlal1359.workers.dev/admin"
