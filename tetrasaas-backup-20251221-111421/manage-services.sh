#!/bin/bash

COMMAND=$1
SERVICE=$2

PID_DIR="$HOME/tetra-pids"

case $COMMAND in
    start)
        if [ -z "$SERVICE" ]; then
            echo "🚀 راه‌اندازی تمام سرویس‌ها"
            ./start-saas-fixed.sh
        else
            echo "🚀 راه‌اندازی سرویس $SERVICE"
            # یافتن پورت سرویس
            PORT=$(grep -A2 "\"$SERVICE\"" tetra-saas-platform/saas-config.json 2>/dev/null | grep "port" | grep -o '[0-9]*')
            if [ -z "$PORT" ]; then
                PORT=3000
            fi
            
            cd "tetra-saas-platform/microservices/$SERVICE"
            python app.py &
            echo $! > "$PID_DIR/tetra_$SERVICE.pid"
            echo "✅ سرویس $SERVICE روی پورت $PORT راه‌اندازی شد"
        fi
        ;;
        
    stop)
        if [ -z "$SERVICE" ]; then
            echo "🛑 توقف تمام سرویس‌ها"
            pkill -f "python app.py" 2>/dev/null
            pkill -f "node server" 2>/dev/null
            rm -rf "$PID_DIR"
            echo "✅ تمام سرویس‌ها متوقف شدند"
        else
            echo "🛑 توقف سرویس $SERVICE"
            if [ -f "$PID_DIR/tetra_$SERVICE.pid" ]; then
                pid=$(cat "$PID_DIR/tetra_$SERVICE.pid")
                kill $pid 2>/dev/null
                rm -f "$PID_DIR/tetra_$SERVICE.pid"
                echo "✅ سرویس $SERVICE متوقف شد"
            else
                pkill -f "python.*$SERVICE" 2>/dev/null
                echo "⚠️  سرویس $SERVICE پیدا نشد یا قبلاً متوقف شده"
            fi
        fi
        ;;
        
    status)
        echo "📊 وضعیت سرویس‌های TetraSaaS"
        echo "============================="
        
        if [ -z "$SERVICE" ]; then
            # وضعیت تمام سرویس‌ها
            SERVICES=($(ls tetra-saas-platform/microservices/ 2>/dev/null))
            for svc in "${SERVICES[@]}"; do
                PORT=$(grep -A2 "\"$svc\"" tetra-saas-platform/saas-config.json 2>/dev/null | grep "port" | grep -o '[0-9]*')
                if [ -z "$PORT" ]; then
                    PORT="?"
                fi
                
                if [ -f "$PID_DIR/tetra_$svc.pid" ]; then
                    pid=$(cat "$PID_DIR/tetra_$svc.pid")
                    if kill -0 "$pid" 2>/dev/null; then
                        echo "  ✅ $svc (پورت $PORT) - فعال"
                    else
                        echo "  ❌ $svc (پورت $PORT) - غیرفعال"
                    fi
                else
                    if netstat -tuln 2>/dev/null | grep ":$PORT " >/dev/null; then
                        echo "  ⚠️  $svc (پورت $PORT) - در حال اجرا"
                    else
                        echo "  ❌ $svc (پورت $PORT) - غیرفعال"
                    fi
                fi
            done
            
            # وضعیت API Gateway
            if [ -f "$PID_DIR/tetra_gateway.pid" ]; then
                pid=$(cat "$PID_DIR/tetra_gateway.pid")
                if kill -0 "$pid" 2>/dev/null; then
                    echo "  ✅ API Gateway (پورت 8080) - فعال"
                else
                    echo "  ❌ API Gateway - غیرفعال"
                fi
            else
                if netstat -tuln 2>/dev/null | grep ":8080 " >/dev/null; then
                    echo "  ⚠️  API Gateway (پورت 8080) - در حال اجرا"
                else
                    echo "  ❌ API Gateway - غیرفعال"
                fi
            fi
            
        else
            # وضعیت یک سرویس خاص
            if [ -f "$PID_DIR/tetra_$SERVICE.pid" ]; then
                pid=$(cat "$PID_DIR/tetra_$SERVICE.pid")
                if kill -0 "$pid" 2>/dev/null; then
                    echo "✅ سرویس $SERVICE فعال است (PID: $pid)"
                else
                    echo "❌ سرویس $SERVICE غیرفعال است"
                fi
            else
                echo "❌ سرویس $SERVICE غیرفعال است یا PID ندارد"
            fi
        fi
        ;;
        
    restart)
        echo "🔄 راه‌اندازی مجدد سرویس $SERVICE"
        ./manage-services.sh stop "$SERVICE"
        sleep 2
        ./manage-services.sh start "$SERVICE"
        ;;
        
    list)
        echo "📋 لیست سرویس‌های TetraSaaS"
        echo "==========================="
        ls -1 tetra-saas-platform/microservices/ | while read svc; do
            PORT=$(grep -A2 "\"$svc\"" tetra-saas-platform/saas-config.json 2>/dev/null | grep "port" | grep -o '[0-9]*')
            if [ -z "$PORT" ]; then
                PORT="?"
            fi
            echo "  • $svc (پورت: $PORT)"
        done
        echo ""
        echo "دستورات:"
        echo "  ./manage-services.sh start [سرویس]"
        echo "  ./manage-services.sh stop [سرویس]"
        echo "  ./manage-services.sh status [سرویس]"
        echo "  ./manage-services.sh restart [سرویس]"
        echo "  ./manage-services.sh list"
        ;;
        
    *)
        echo "استفاده: ./manage-services.sh {start|stop|status|restart|list} [سرویس]"
        echo ""
        echo "مثال‌ها:"
        echo "  ./manage-services.sh start           # راه‌اندازی همه سرویس‌ها"
        echo "  ./manage-services.sh stop            # توقف همه سرویس‌ها"
        echo "  ./manage-services.sh status          # وضعیت همه سرویس‌ها"
        echo "  ./manage-services.sh start formula-solver"
        echo "  ./manage-services.sh status quantum-writer"
        exit 1
        ;;
esac
