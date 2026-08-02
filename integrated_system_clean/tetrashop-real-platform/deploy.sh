#!/bin/bash
echo "🚀 در حال راه‌اندازی پلتفرم کامل تتراشاپ..."

# نصب Vercel در صورت نیاز
if ! command -v vercel &> /dev/null; then
    echo "📦 در حال نصب Vercel..."
    npm install -g vercel
fi

echo "🔨 در حال Deploy پلتفرم..."
vercel --prod --confirm

echo "✅ پلتفرم با موفقیت deploy شد!"
echo "🌐 آدرس پلتفرم: https://tetrashop-real-platform.vercel.app"
