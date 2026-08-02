#!/bin/bash

echo "⚡ تست سریع سرویس‌های TetraSaaS"
echo "================================"

# لیست سرویس‌های فعال
echo "📊 بررسی سرویس‌های فعال:"

SERVICES=(
    "3001:quantum-writer"
    "3002:ai-writer"
    "3003:secret-garden"
    "3004:3d-converter"
    "3005:2d-to-3d"
    "3006:content-analyzer"
    "3007:anti-fragmentation"
    "3008:formula-solver"
    "3009:code-cleaner"
    "3010:graphic-2d"
    "3011:anti-smoke"
    "3012:telescope-design"
    "3013:teleport-system"
    "3014:image-processor"
    "3015:audio-converter"
    "3016:video-editor"
    "3017:data-encryptor"
    "3018:network-scanner"
    "3019:battery-optimizer"
    "3020:file-organizer"
    "3021:password-generator"
    "3022:system-monitor"
    "3023:backup-manager"
)

active_count=0
total_count=0

for service in "${SERVICES[@]}"; do
    port=$(echo $service | cut -d: -f1)
    name=$(echo $service | cut -d: -f2)
    
    echo -n "  $name ($port): "
    
    # تست سلامت
    if curl -s "http://localhost:$port/health" --connect-timeout 2 | grep -q "healthy\|ok"; then
        echo "✅ فعال"
        ((active_count++))
    else
        echo "❌ غیرفعال"
    fi
    
    ((total_count++))
    sleep 0.05
done

echo ""
echo "📈 آمار کلی:"
echo "  - کل سرویس‌ها: $total_count"
echo "  - سرویس‌های فعال: $active_count"
echo "  - نرخ سلامت: $((active_count * 100 / total_count))%"

# تست عملکرد نمونه
echo ""
echo "🔧 تست عملکرد نمونه:"

# تست حل کننده فرمول
echo -n "  فرمول‌ساز: "
if curl -s -X POST "http://localhost:3008/solve" \
    -H "Content-Type: application/json" \
    -d '{"expression": "2+2"}' \
    --connect-timeout 3 | grep -q "result\|solution"; then
    echo "✅ کار می‌کند"
else
    echo "⚠️ نیاز به بهبود"
fi

# تست تحلیلگر محتوا
echo -n "  تحلیلگر: "
if curl -s -X POST "http://localhost:3006/analyze" \
    -H "Content-Type: application/json" \
    -d '{"text": "تست"}' \
    --connect-timeout 3 | grep -q "sentiment\|keywords"; then
    echo "✅ کار می‌کند"
else
    echo "⚠️ نیاز به بهبود"
fi

echo ""
echo "🎯 پیشنهادات فوری:"
echo "  1. سرویس‌های غیرفعال را راه‌اندازی کنید"
echo "  2. منطق واقعی به سرویس‌ها اضافه شود"
echo "  3. تست جامع اجرا شود: ./test-all-services-comprehensive.sh"
echo "  4. بهبودها اعمال شود: ./apply-optimizations.sh"
