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
