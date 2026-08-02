#!/bin/bash

echo "🧪 تست سلامت سرویس‌های TetraSaaS"
echo "================================"

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

echo "🔍 بررسی پورت‌ها..."
for service in "${SERVICES[@]}"; do
    port=$(echo $service | cut -d: -f1)
    name=$(echo $service | cut -d: -f2)
    
    if curl -s http://localhost:$port/health 2>/dev/null | grep -q "healthy"; then
        echo "  ✅ $name (پورت $port) - فعال"
    elif netstat -tuln 2>/dev/null | grep ":$port " >/dev/null; then
        echo "  ⚠️  $name (پورت $port) - در حال اجرا اما پاسخ نمی‌دهد"
    else
        echo "  ❌ $name (پورت $port) - غیرفعال"
    fi
done

echo ""
echo "🌐 تست API Gateway..."
if curl -s http://localhost:8080/health 2>/dev/null | grep -q "ok"; then
    echo "  ✅ API Gateway فعال است"
else
    echo "  ❌ API Gateway غیرفعال است"
fi

echo ""
echo "📊 نتیجه تست:"
active_count=0
for service in "${SERVICES[@]}"; do
    port=$(echo $service | cut -d: -f1)
    if netstat -tuln 2>/dev/null | grep ":$port " >/dev/null; then
        ((active_count++))
    fi
done

echo "   $active_count از 23 سرویس فعال هستند"
