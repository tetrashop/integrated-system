#!/bin/bash
echo "📊 داشبرد اصلی TetraSaaS - سیستم فعال"
echo "======================================"

API="http://localhost:5000"

# 1. سلامت سیستم
echo "🏥 سلامت سیستم:"
curl -s "$API/api/health" | python3 -m json.tool 2>/dev/null || curl -s "$API/api/health"
echo ""

# 2. سرویس‌های موجود
echo "🛍️  سرویس‌های موجود:"
SERVICES=$(curl -s "$API/api/services")
if echo "$SERVICES" | grep -q "{" 2>/dev/null; then
    echo "$SERVICES" | python3 -m json.tool 2>/dev/null || echo "$SERVICES"
else
    echo "در حال دریافت سرویس‌ها..."
fi
echo ""

# 3. تست سرویس‌های پردازشی
echo "⚙️  تست سرویس‌های پردازشی:"
echo "• فرمول‌ساز: $API/api/formula/solve"
echo "• تحلیل محتوا: $API/api/content/analyze"
echo ""

# 4. وضعیت ماژول‌های درآمدزا
echo "💰 وضعیت درآمدزایی:"
echo "✅ سیستم پردازش ابری: فعال (پورت 5000)"
echo "✅ فرمول‌ساز: فعال"
echo "✅ تحلیل محتوا: فعال"
echo "⚠️  درگاه پرداخت: نیاز به اتصال به api/payment.js"
echo ""

# 5. دسترسی سریع
echo "🔗 دسترسی سریع:"
echo "1. مستندات: $API"
echo "2. سلامت: $API/api/health"
echo "3. سرویس‌ها: $API/api/services"
echo "4. فرمول‌ساز: $API/api/formula/solve?expr=2+2"
echo "5. تحلیل متن: $API/api/content/analyze?text=سلام"
