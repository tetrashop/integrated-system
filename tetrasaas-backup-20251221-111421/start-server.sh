#!/bin/bash
echo "🔄 توقف سرورهای قبلی..."
pkill -f "python3 -m http.server" 2>/dev/null
sleep 2

echo "🚀 راه‌اندازی سرور از پوشه public..."
cd /data/data/com.termux/files/home/tetrashop-projects/public
python3 -m http.server 8080 &

echo "✅ سرور فعال شد"
echo "📌 پورت: 8080"
echo "🌐 آدرس‌های مهم:"
echo "   • CMS مدیریت: http://localhost:8080/cms/"
echo "   • داشبورد اصلی: http://localhost:8080/"
echo "   • پروژه‌ها: http://localhost:8080/projects/"
echo ""
echo "📱 دستورات کنترل:"
echo "   • توقف: pkill -f 'python3 -m http.server'"
echo "   • وضعیت: netstat -tuln | grep 8080"
echo ""
echo "🔍 تست دسترسی:"
echo "   curl -I http://localhost:8080/cms/"

# نگه داشتن ترمینال
wait
