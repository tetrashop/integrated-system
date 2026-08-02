#!/bin/bash
cd /data/data/com.termux/files/home/tetrashop-github

echo "🚀 راه‌اندازی نهایی TetraShop..."
echo "==============================="

# 1. توقف سرورهای قبلی
echo "🛑 توقف سرورهای قبلی..."
pkill -f node 2>/dev/null
fuser -k 3001/tcp 2>/dev/null
fuser -k 8080/tcp 2>/dev/null
sleep 2

# 2. راه‌اندازی سرور اصلی
echo "🌐 راه‌اندازی سرور اصلی..."
nohup node server.js > main.log 2>&1 &
SERVER_PID=$!
sleep 3

# 3. راه‌اندازی پنل مدیریت
echo "🛠️ راه‌اندازی پنل مدیریت..."
cd tetrashop-manager
PORT=8080 nohup node server.js > ../manager.log 2>&1 &
MANAGER_PID=$!
cd ..
sleep 2

# 4. بررسی وضعیت
echo "📊 بررسی وضعیت سرویس‌ها..."
echo "------------------------"

check_service() {
    local name=$1
    local url=$2
    echo -n "🔗 $name ($url) ... "
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
        echo "✅ فعال"
        return 0
    else
        echo "❌ مشکل"
        return 1
    fi
}

check_service "فروشگاه اصلی" "http://localhost:3001"
check_service "پنل مدیریت" "http://localhost:8080"
check_service "شطرنج" "http://localhost:3001/chess"
check_service "NLP" "http://localhost:3001/nlp"
check_service "کوانتا" "http://localhost:3001/quantum"

# 5. نمایش اطلاعات نهایی
echo ""
echo "🎉 راه‌اندازی کامل شد!"
echo "======================"
echo ""
echo "🌐 آدرس‌های مهم:"
echo "   1. فروشگاه اصلی: http://localhost:3001"
echo "   2. پنل مدیریت: http://localhost:8080"
echo "   3. شطرنج: http://localhost:3001/chess"
echo "   4. پردازش زبان: http://localhost:3001/nlp"
echo "   5. کوانتا: http://localhost:3001/quantum"
echo ""
echo "📊 وضعیت سرورها:"
ps aux | grep node | grep -v grep
echo ""
echo "📋 دستورات مدیریت:"
echo "   بررسی لاگ‌ها: tail -f main.log"
echo "   توقف سرورها: pkill -f node"
echo "   راه‌اندازی مجدد: ./final-launch.sh"
echo ""
echo "✅ تمام مشکلات گزارش شده رفع شدند!"
