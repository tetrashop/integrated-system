#!/bin/bash
echo "📊 وضعیت داشبورد عملیاتی..."
cd "/data/data/com.termux/files/home/tetrashop-operational-dashboard"

if [ -f "server.pid" ]; then
    PID=$(cat server.pid)
    if kill -0 $PID 2>/dev/null; then
        echo "✅ سرور در حال اجراست (PID: $PID)"
        
        # بررسی پورت
        PORT=$(netstat -tlnp 2>/dev/null | grep "$PID/python" | awk '{print $4}' | cut -d: -f2)
        if [ ! -z "$PORT" ]; then
            echo "🌐 پورت: $PORT"
            echo "🔗 آدرس: http://localhost:$PORT"
        fi
    else
        echo "❌ سرور در حال اجرا نیست"
    fi
else
    echo "⚠️  سرور راه‌اندازی نشده است"
fi

# نمایش پروژه‌ها
echo ""
echo "📁 پروژه‌های شناسایی شده:"
ls -la "/data/data/com.termux/files/home/tetrashop-projects" 2>/dev/null | grep "^d" | awk '{print "   • " $9}'
