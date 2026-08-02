#!/bin/bash

echo "♟️  راه‌اندازی موتور شطرجد TetraShop..."
echo "========================================"

# بررسی وجود Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js نصب نیست. لطفاً ابتدا Node.js نصب کنید."
    exit 1
fi

# نصب وابستگی‌ها
echo "📦 در حال نصب وابستگی‌ها..."
npm install --silent

# یافتن پورت آزاد
find_port() {
    for port in {7500..7600}; do
        if ! netstat -tulpn 2>/dev/null | grep -q :$port && ! lsof -i :$port 2>/dev/null; then
            echo $port
            return
        fi
    done
    echo 7555
}

PORT=$(find_port)
export PORT=$PORT

echo ""
echo "✅ موتور شطرجد آماده است!"
echo ""
echo "📊 اطلاعات:"
echo "├── 🏷️  نام: TetraShop Chess Engine"
echo "├── 🚀 نسخه: 1.0.0"
echo "├── 📍 پورت: $PORT"
echo "├── 🤖 الگوریتم: Minimax با Alpha-Beta Pruning"
echo "└── 📚 کتاب افتتاحیه: 3 موقعیت"
echo ""
echo "🌐 آدرس‌ها:"
echo "├── 🏠 رابط کاربری: http://localhost:$PORT"
echo "├── 📊 API وضعیت: http://localhost:$PORT/api/status"
echo "├── 🤖 حرکت موتور: http://localhost:$PORT/api/engine/move"
echo "└── 🔍 تحلیل موقعیت: http://localhost:$PORT/api/analyze"
echo ""
echo "🚀 در حال راه‌اندازی سرور..."
echo ""

# اجرای سرور
node api/server.js
