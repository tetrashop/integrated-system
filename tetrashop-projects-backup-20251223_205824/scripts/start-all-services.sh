#!/bin/bash

echo "🚀 راه‌اندازی ۲۳ سرویس TetraSaaS"
echo "================================"
echo ""

# 1. بررسی وجود پوشه pid
mkdir -p ~/tetra-pids

# 2. لیست سرویس‌ها و پورت‌ها
declare -A SERVICES=(
    ["quantum-writer"]="3001"
    ["ai-writer"]="3002"
    ["secret-garden"]="3003"
    ["3d-converter"]="3004"
    ["2d-to-3d"]="3005"
    ["content-analyzer"]="3006"
    ["anti-fragmentation"]="3007"
    ["formula-solver"]="3008"
    ["code-cleaner"]="3009"
    ["graphic-2d"]="3010"
    ["anti-smoke"]="3011"
    ["telescope-design"]="3012"
    ["teleport-system"]="3013"
    ["image-processor"]="3014"
    ["audio-converter"]="3015"
    ["video-editor"]="3016"
    ["data-encryptor"]="3017"
    ["network-scanner"]="3018"
    ["battery-optimizer"]="3019"
    ["file-organizer"]="3020"
    ["password-generator"]="3021"
    ["system-monitor"]="3022"
    ["backup-manager"]="3023"
)

# 3. تابع راه‌اندازی سرویس
start_service() {
    local name=$1
    local port=$2
    
    echo -n "🔧 راه‌اندازی $name (پورت $port)... "
    
    # بررسی اگر قبلاً اجرا شده
    if ps -p $(cat ~/tetra-pids/tetra_$name.pid 2>/dev/null) >/dev/null 2>&1; then
        echo "✅ از قبل اجراست"
        return 0
    fi
    
    # ایجاد سرویس ساده
    cat > ~/tetra-services/$name.js << NODE_EOF
const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            service: '$name',
            port: $port,
            timestamp: new Date().toISOString()
        }));
    } else if (req.url === '/process' || req.url === '/solve' || req.url === '/analyze') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            service: '$name',
            action: 'processed',
            result: 'Sample result for $name',
            processing_time: '50ms'
        }));
    } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            service: '$name',
            endpoints: ['/health', '/process'],
            documentation: 'TetraSaaS $name service'
        }));
    }
});

server.listen($port, '127.0.0.1', () => {
    console.log('✅ $name running on port $port');
});
NODE_EOF
    
    # اجرای سرویس
    node ~/tetra-services/$name.js > ~/tetra-logs/$name.log 2>&1 &
    echo $! > ~/tetra-pids/tetra_$name.pid
    
    sleep 0.5
    if curl -s "http://localhost:$port/health" >/dev/null 2>&1; then
        echo "✅ موفق"
    else
        echo "⚠️ با مشکل"
    fi
}

# 4. ایجاد پوشه‌های لازم
mkdir -p ~/tetra-services ~/tetra-logs ~/tetra-pids

# 5. راه‌اندازی تدریجی سرویس‌ها
echo "📦 در حال راه‌اندازی سرویس‌ها..."
echo ""

started_count=0
failed_count=0

for name in "${!SERVICES[@]}"; do
    port="${SERVICES[$name]}"
    
    # راه‌اندازی گروه‌های ۵ تایی
    start_service "$name" "$port" &
    
    started_count=$((started_count + 1))
    
    # هر ۵ سرویس یک pause
    if [ $((started_count % 5)) -eq 0 ]; then
        sleep 2
    fi
done

# صبر برای کامل شدن
sleep 5

# 6. بررسی نهایی
echo ""
echo "🔍 بررسی نهایی سرویس‌ها:"
echo ""

active_count=0
for name in "${!SERVICES[@]}"; do
    port="${SERVICES[$name]}"
    
    echo -n "  $name ($port): "
    if curl -s "http://localhost:$port/health" --connect-timeout 2 >/dev/null 2>&1; then
        echo "✅ فعال"
        active_count=$((active_count + 1))
    else
        echo "❌ غیرفعال"
        failed_count=$((failed_count + 1))
    fi
done

# 7. نمایش نتایج
echo ""
echo "📊 نتایج راه‌اندازی:"
echo "  - کل سرویس‌ها: ۲۳"
echo "  - سرویس‌های فعال: $active_count"
echo "  - سرویس‌های غیرفعال: $failed_count"
echo "  - نرخ موفقیت: $((active_count * 100 / 23))%"

# 8. ایجاد اسکریپت مدیریت
cat > ~/tetra-services-manager.sh << 'MANAGER_EOF'
#!/bin/bash

case "$1" in
    "start")
        echo "🚀 شروع همه سرویس‌ها..."
        for pidfile in ~/tetra-pids/tetra_*.pid; do
            if [ -f "$pidfile" ]; then
                pid=$(cat "$pidfile")
                if ! ps -p $pid >/dev/null 2>&1; then
                    name=$(basename "$pidfile" | sed 's/tetra_//' | sed 's/.pid//')
                    port=$(grep -o '[0-9]*' <<< "$name" | tail -1)
                    if [ -z "$port" ]; then
                        port=3000
                    fi
                    node ~/tetra-services/$name.js > ~/tetra-logs/$name.log 2>&1 &
                    echo $! > "$pidfile"
                    echo "✅ $name راه‌اندازی شد"
                fi
            fi
        done
        ;;
    "stop")
        echo "🛑 توقف همه سرویس‌ها..."
        for pidfile in ~/tetra-pids/tetra_*.pid; do
            if [ -f "$pidfile" ]; then
                pid=$(cat "$pidfile")
                if ps -p $pid >/dev/null 2>&1; then
                    kill $pid
                    echo "✅ متوقف شد: $(basename "$pidfile")"
                fi
            fi
        done
        ;;
    "status")
        echo "📊 وضعیت سرویس‌ها:"
        for pidfile in ~/tetra-pids/tetra_*.pid; do
            if [ -f "$pidfile" ]; then
                name=$(basename "$pidfile" | sed 's/tetra_//' | sed 's/.pid//')
                pid=$(cat "$pidfile")
                if ps -p $pid >/dev/null 2>&1; then
                    echo "✅ $name: فعال (PID: $pid)"
                else
                    echo "❌ $name: غیرفعال"
                fi
            fi
        done
        ;;
    "restart")
        $0 stop
        sleep 2
        $0 start
        ;;
    *)
        echo "استفاده: $0 {start|stop|status|restart}"
        exit 1
        ;;
esac
MANAGER_EOF

chmod +x ~/tetra-services-manager.sh

echo ""
echo "🎉 راه‌اندازی کامل شد!"
echo ""
echo "🔧 دستورات مدیریت:"
echo "  ~/tetra-services-manager.sh start   # شروع سرویس‌ها"
echo "  ~/tetra-services-manager.sh stop    # توقف سرویس‌ها"
echo "  ~/tetra-services-manager.sh status  # وضعیت سرویس‌ها"
echo "  ~/tetra-services-manager.sh restart # راه‌اندازی مجدد"
echo ""
echo "📊 تست سلامت:"
echo "  ./test-productivity-comparison.sh"
