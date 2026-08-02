#!/bin/bash

echo "🚀 راه‌اندازی پلتفرم TetraSaaS (نسخه اصلاح شده)"
echo "=============================================="

# توقف سرویس‌های قبلی
echo "🛑 توقف سرویس‌های قبلی..."
pkill -f "python app.py" 2>/dev/null
pkill -f "node server" 2>/dev/null
sleep 2

# ایجاد پوشه برای فایل‌های PID
PID_DIR="$HOME/tetra-pids"
mkdir -p "$PID_DIR"
echo "📁 پوشه PID: $PID_DIR"

# راه‌اندازی میکروسرویس‌ها
echo "🔧 راه‌اندازی میکروسرویس‌ها..."
start_service() {
    local name=$1
    local port=$2
    local dir="tetra-saas-platform/microservices/$name"
    
    if [ -d "$dir" ]; then
        echo "   راه‌اندازی $name روی پورت $port..."
        cd "$dir"
        
        # بررسی وضعیت پورت
        if netstat -tuln 2>/dev/null | grep ":$port " >/dev/null; then
            echo "   ⚠️  پورت $port در حال استفاده است"
        else
            python app.py &
            local pid=$!
            echo $pid > "$PID_DIR/tetra_$name.pid"
            echo "   ✅ $name راه‌اندازی شد (PID: $pid)"
        fi
        
        cd - > /dev/null
    else
        echo "   ❌ پوشه $name یافت نشد"
    fi
}

# راه‌اندازی 5 سرویس نمونه (برای تست)
start_service "formula-solver" 3008
start_service "quantum-writer" 3001
start_service "3d-converter" 3004
start_service "content-analyzer" 3006
start_service "code-cleaner" 3009

sleep 2

# راه‌اندازی API Gateway
echo "🌉 راه‌اندازی API Gateway..."
cd tetra-saas-platform/api-gateway

# بررسی پورت 8080
if netstat -tuln 2>/dev/null | grep ":8080 " >/dev/null; then
    echo "   ⚠️  پورت 8080 در حال استفاده است"
else
    node server-simple.js &
    GATEWAY_PID=$!
    echo $GATEWAY_PID > "$PID_DIR/tetra_gateway.pid"
    echo "   ✅ API Gateway راه‌اندازی شد (PID: $GATEWAY_PID)"
fi

cd - > /dev/null

# نمایش اطلاعات
echo ""
echo "=========================================="
echo "🎉 پلتفرم TetraSaaS راه‌اندازی شد!"
echo "=========================================="
echo ""
echo "📡 آدرس‌های مهم:"
echo "   • API Gateway:  http://localhost:8080"
echo "   • فرمول‌ساز:    http://localhost:3008"
echo "   • نویسنده کوانتومی: http://localhost:3001"
echo ""
echo "🧪 تست سلامت سرویس‌ها:"
echo "   curl http://localhost:8080/health"
echo "   curl http://localhost:3008/health"
echo ""
echo "⚡ تست API:"
echo '   curl -X POST http://localhost:8080/api/formula-solver/process \\'
echo '     -H "Content-Type: application/json" \\'
echo '     -d '"'"'{"expression": "x^2 + 3x + 2"}'"'"
echo ""
echo "🛑 برای توقف:"
echo "   pkill -f 'python app.py'"
echo "   pkill -f 'node server'"
echo "   rm -rf $PID_DIR"
echo ""
echo "📊 وضعیت سرویس‌ها:"
for pidfile in "$PID_DIR"/*.pid; do
    if [ -f "$pidfile" ]; then
        pid=$(cat "$pidfile")
        if kill -0 "$pid" 2>/dev/null; then
            name=$(basename "$pidfile" | sed 's/tetra_//' | sed 's/.pid//')
            echo "   ✅ $name در حال اجرا (PID: $pid)"
        fi
    fi
done
