#!/bin/bash

echo "🚀 راه‌اندازی پلتفرم یکپارچه..."
cd "$(dirname "$0")/.."

# تابع برای راه‌اندازی هر سرویس
start_service() {
    local name=$1
    local port=$2
    local dir=$3
    local cmd=$4

    echo "▶️  راه‌اندازی $name روی پورت $port..."
    cd "services/$dir" || return
    if [ -f "package.json" ]; then
        if [ ! -d "node_modules" ]; then
            npm install --silent
        fi
        PORT=$port npm start &
    elif [ -f "app.py" ]; then
        PORT=$port python app.py &
    else
        echo "⚠️  فایل اجرایی برای $name یافت نشد."
    fi
    cd - > /dev/null
}

# راه‌اندازی Gateway
echo "🔹 راه‌اندازی Gateway..."
cd gateway
if [ ! -d "node_modules" ]; then
    npm install express http-proxy-middleware cors --silent
fi
PORT=8080 node server.js &
cd ..

# راه‌اندازی سرویس‌ها (با پورت‌های مشخص)
start_service "3d" 3001 "3d-conversion" "npm start"
start_service "nlp" 3002 "nlp-engine" "npm start"
start_service "shop" 3003 "shop" "npm start"
start_service "admin" 3004 "admin-dashboard" "npm start"
start_service "chess" 3005 "chess-engine" "npm start"
start_service "olympic" 3006 "olympic-games" "npm start"
start_service "ai-manager" 3007 "ai-project-manager" "npm start"
start_service "probability" 3008 "probability-tools" "npm start"

echo "✅ پلتفرم یکپارچه راه‌اندازی شد."
echo "🌐 Gateway: http://localhost:8080"
