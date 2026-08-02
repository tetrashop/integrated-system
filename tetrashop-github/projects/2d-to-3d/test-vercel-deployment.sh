#!/bin/bash

echo "🧪 تست استقرار جدید Tetrashop Suite"

DEPLOYMENT_URL="https://tetrashop-suite.vercel.app"

echo "🔍 تست سلامت..."
response=$(curl -s -w "%{http_code}" "$DEPLOYMENT_URL/api/health")
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

if [ "$status_code" = "200" ]; then
    echo "✅ سلامت: $body"
else
    echo "❌ خطا: کد وضعیت $status_code"
    echo "📄 پاسخ: $body"
fi

echo ""
echo "🛒 تست محصولات..."
response=$(curl -s -w "%{http_code}" "$DEPLOYMENT_URL/api/products")
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

if [ "$status_code" = "200" ]; then
    product_count=$(echo "$body" | grep -o '"count":[0-9]*' | cut -d: -f2)
    echo "✅ محصولات: $product_count محصول یافت شد"
else
    echo "❌ خطا: کد وضعیت $status_code"
fi

echo ""
echo "🏠 تست صفحه اصلی..."
response=$(curl -s -w "%{http_code}" "$DEPLOYMENT_URL/")
status_code=$(echo "$response" | tail -n1)

if [ "$status_code" = "200" ]; then
    echo "✅ صفحه اصلی: بارگذاری موفق"
else
    echo "❌ خطا: کد وضعیت $status_code"
fi

echo ""
echo "🌐 آدرس نهایی: $DEPLOYMENT_URL"
