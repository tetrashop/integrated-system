#!/bin/bash

echo "🚀 راه‌اندازی پروژه Tetrashop100..."
echo "==================================="

# اطلاعات حساب Cloudflare
CF_ACCOUNT_ID="fa191007362f898481011cfdd0fbcea7"
CF_API_TOKEN="CnFcfFu6N8unYF5J5I1YCHPjZwl_Rh0P_GIp5XC0"
WORKER_NAME="tetrashop100"

echo "📦 نام پروژه: Tetrashop100"
echo "🔧 در حال استقرار..."

# استقرار Worker
response=$(curl -s -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/workers/scripts/$WORKER_NAME" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/javascript" \
  --data-binary "@src/main.js")

# بررسی نتیجه
if echo "$response" | grep -q '"success":true'; then
    echo "✅ استقرار Tetrashop100 موفقیت‌آمیز بود!"
    echo ""
    echo "🌐 آدرس‌های اصلی:"
    echo "   🏠 صفحه اصلی: https://$WORKER_NAME.ramin-edjlal1359.workers.dev"
    echo "   🩺 سلامت سیستم: https://$WORKER_NAME.ramin-edjlal1359.workers.dev/health"
    echo "   📊 داشبورد: https://$WORKER_NAME.ramin-edjlal1359.workers.dev/dashboard"
    echo "   ⚙️ پنل مدیریت: https://$WORKER_NAME.ramin-edjlal1359.workers.dev/admin"
    echo ""
    echo "🔗 APIها:"
    echo "   📦 محصولات: GET https://$WORKER_NAME.ramin-edjlal1359.workers.dev/api/products"
    echo "   🛒 ثبت سفارش: POST https://$WORKER_NAME.ramin-edjlal1359.workers.dev/api/order"
    echo ""
    echo "🎉 پروژه Tetrashop100 با موفقیت راه‌اندازی شد!"
else
    echo "❌ خطا در استقرار:"
    echo "$response"
    exit 1
fi
