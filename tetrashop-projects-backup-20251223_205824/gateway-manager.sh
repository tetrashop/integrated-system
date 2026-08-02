#!/bin/bash

case "$1" in
    start)
        echo "🚀 راه‌اندازی TetraSaaS Gateway..."
        node server-gateway.js &
        echo $! > gateway.pid
        echo "✅ Gateway اجرا شد (PID: $(cat gateway.pid))"
        echo "📡 آدرس: http://localhost:3000"
        ;;
    stop)
        if [ -f gateway.pid ]; then
            echo "🛑 توقف Gateway..."
            kill $(cat gateway.pid) 2>/dev/null
            rm -f gateway.pid
            echo "✅ Gateway متوقف شد"
        else
            echo "⚠️  Gateway در حال اجرا نیست"
        fi
        ;;
    status)
        if [ -f gateway.pid ] && kill -0 $(cat gateway.pid) 2>/dev/null; then
            echo "✅ Gateway در حال اجراست (PID: $(cat gateway.pid))"
            curl -s http://localhost:3000/gateway/health | head -5
        else
            echo "❌ Gateway متوقف است"
        fi
        ;;
    restart)
        $0 stop
        sleep 2
        $0 start
        ;;
    test)
        echo "🧪 تست Gateway..."
        echo "1. بررسی سلامت:"
        curl -s http://localhost:3000/gateway/health | head -5
        echo -e "\n2. تست کاربر رایگان:"
        curl -s -H "x-api-key: apikey_user_free_123" "http://localhost:3000/gateway/my-plan" | head -10
        ;;
    *)
        echo "🔧 استفاده: $0 {start|stop|restart|status|test}"
        echo "   start   - راه‌اندازی Gateway"
        echo "   stop    - توقف Gateway"
        echo "   restart - راه‌اندازی مجدد"
        echo "   status  - وضعیت فعلی"
        echo "   test    - تست عملیات"
        ;;
esac
