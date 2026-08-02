#!/bin/bash

echo "📊 وضعیت لحظه‌ای TetraSaaS"
echo "=========================="

# 1. بررسی API Gateway
echo "🌐 API Gateway:"
if curl -s http://localhost:8080/health 2>/dev/null | grep -q '"status":"ok"'; then
    echo "   ✅ فعال - http://localhost:8080/health"
    
    # نمایش اطلاعات سلامت
    curl -s http://localhost:8080/health | python3 -m json.tool 2>/dev/null || \
    curl -s http://localhost:8080/health
else
    echo "   ❌ غیرفعال"
    
    # بررسی آیا فرآیند در حال اجراست
    if ps aux | grep -q "[n]ode.*server-fixed"; then
        echo "   ⚠️  فرآیند در حال اجراست اما پاسخ نمی‌دهد"
    fi
fi

echo ""

# 2. بررسی سرویس‌ها
echo "🔧 میکروسرویس‌ها:"
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

healthy=0
total=0

for service in "${SERVICES[@]}"; do
    port=$(echo $service | cut -d: -f1)
    name=$(echo $service | cut -d: -f2)
    
    if timeout 2 curl -s "http://localhost:$port/health" 2>/dev/null | grep -q "healthy"; then
        echo "   ✅ $name (پورت $port)"
        ((healthy++))
    elif netstat -tuln 2>/dev/null | grep ":$port " >/dev/null; then
        echo "   ⚠️  $name (پرت $port) - در حال اجرا"
    else
        echo "   ❌ $name (پرت $port) - غیرفعال"
    fi
    ((total++))
done

echo ""
echo "📈 خلاصه:"
echo "   • سرویس‌های سالم: $healthy/$total"
echo "   • API Gateway: $(curl -s http://localhost:8080/health >/dev/null && echo '✅' || echo '❌')"
echo ""
echo "🧪 تست سریع API:"
echo '   curl -X POST http://localhost:8080/api/formula-solver/process \'
echo '     -H "Content-Type: application/json" \'
echo '     -d '"'"'{"test": "hello"}'"'"
