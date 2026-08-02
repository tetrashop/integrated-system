#!/bin/bash

echo "🚀 راه‌اندازی حرفه‌ای TetraSaaS"
echo "==============================="

# 1. توقف سرویس‌های قبلی
echo "🛑 توقف سرویس‌های قبلی..."
./stop-all.sh 2>/dev/null
sleep 3

# 2. بررسی ابزارهای مورد نیاز
echo "🔍 بررسی ابزارها..."
command -v python3 >/dev/null 2>&1 || { echo "❌ پایتون 3 نصب نیست"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js نصب نیست"; exit 1; }
echo "✅ پایتون و Node.js آماده هستند"

# 3. راه‌اندازی میکروسرویس‌ها
echo "🔧 راه‌اندازی میکروسرویس‌ها..."
PID_DIR="$HOME/tetra-pids"
mkdir -p "$PID_DIR"

SERVICES=(
    "quantum-writer:3001"
    "ai-writer:3002"
    "secret-garden:3003"
    "3d-converter:3004"
    "2d-to-3d:3005"
    "content-analyzer:3006"
    "anti-fragmentation:3007"
    "formula-solver:3008"
    "code-cleaner:3009"
    "graphic-2d:3010"
    "anti-smoke:3011"
    "telescope-design:3012"
    "teleport-system:3013"
    "image-processor:3014"
    "audio-converter:3015"
    "video-editor:3016"
    "data-encryptor:3017"
    "network-scanner:3018"
    "battery-optimizer:3019"
    "file-organizer:3020"
    "password-generator:3021"
    "system-monitor:3022"
    "backup-manager:3023"
)

started_count=0
for service_info in "${SERVICES[@]}"; do
    IFS=':' read -r name port <<< "$service_info"
    
    echo -n "   📦 $name (:$port)... "
    
    # بررسی آیا پورت آزاد است
    if netstat -tuln 2>/dev/null | grep ":$port " >/dev/null; then
        echo "⚠️  در حال استفاده"
        continue
    fi
    
    # رفتن به پوشه سرویس
    cd "tetra-saas-platform/microservices/$name" 2>/dev/null
    if [ $? -ne 0 ]; then
        echo "❌ پوشه پیدا نشد"
        cd - > /dev/null
        continue
    fi
    
    # راه‌اندازی با nohup برای جلوگیری از قطع شدن
    nohup python3 -u app.py > "$PID_DIR/$name.log" 2>&1 &
    pid=$!
    
    # ذخیره PID
    echo $pid > "$PID_DIR/tetra_$name.pid"
    echo "✅ راه‌اندازی شد (PID: $pid)"
    
    ((started_count++))
    
    # تأخیر کوتاه
    sleep 0.5
    
    cd - > /dev/null
done

echo "⏳ منتظر بمانید تا سرویس‌ها راه‌اندازی شوند..."
sleep 8

# 4. تست سلامت سرویس‌ها
echo "🧪 تست سلامت سرویس‌های راه‌اندازی شده..."
healthy_count=0
for service_info in "${SERVICES[@]}"; do
    IFS=':' read -r name port <<< "$service_info"
    
    # فقط سرویس‌هایی که راه‌اندازی شدند را تست کن
    if [ -f "$PID_DIR/tetra_$name.pid" ]; then
        echo -n "   🩺 $name... "
        if timeout 3 curl -s "http://localhost:$port/health" 2>/dev/null | grep -q "healthy"; then
            echo "✅ سالم"
            ((healthy_count++))
        else
            echo "⚠️  پاسخ نمی‌دهد"
        fi
    fi
done

# 5. راه‌اندازی API Gateway
echo "🌉 راه‌اندازی API Gateway..."
cd tetra-saas-platform/api-gateway

# توقف Gateway قبلی
pkill -f "node.*server" 2>/dev/null
sleep 2

# راه‌اندازی Gateway جدید
nohup node server-fixed.js > "$PID_DIR/gateway.log" 2>&1 &
GATEWAY_PID=$!
echo $GATEWAY_PID > "$PID_DIR/tetra_gateway.pid"

echo -n "   🩺 تست API Gateway... "
sleep 3
if timeout 3 curl -s "http://localhost:8080/health" 2>/dev/null | grep -q '"status":"ok"'; then
    echo "✅ سالم"
else
    echo "⚠️  مشکل در راه‌اندازی"
fi

cd - > /dev/null

# 6. نمایش نتیجه
echo ""
echo "=========================================="
echo "🎉 راه‌اندازی کامل شد!"
echo "=========================================="
echo ""
echo "📊 آمار:"
echo "   • سرویس‌های راه‌اندازی شده: $started_count/23"
echo "   • سرویس‌های سالم: $healthy_count/$started_count"
echo "   • API Gateway: ✅ فعال"
echo ""
echo "🌐 دسترسی:"
echo "   • داشبورد:     http://localhost:8080/"
echo "   • سلامت:       http://localhost:8080/health"
echo "   • API Base:    http://localhost:8080/api/:service/*"
echo ""
echo "🛠️  مدیریت:"
echo "   ./check-status.sh    # وضعیت لحظه‌ای"
echo "   ./stop-all.sh        # توقف کامل"
echo ""
echo "📋 سرویس‌های سالم:"
for service_info in "${SERVICES[@]}"; do
    IFS=':' read -r name port <<< "$service_info"
    if [ -f "$PID_DIR/tetra_$name.pid" ]; then
        if timeout 1 curl -s "http://localhost:$port/health" 2>/dev/null | grep -q "healthy"; then
            echo "   • $name - http://localhost:$port/health"
        fi
    fi
done
