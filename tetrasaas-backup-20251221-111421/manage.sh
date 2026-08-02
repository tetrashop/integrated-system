#!/bin/bash
cd /data/data/com.termux/files/home/tetrashop-projects

case "$1" in
    "start")
        echo "🚀 راه‌اندازی TetraShop..."
        
        # توقف سرورهای قبلی
        pkill -f "python3 -m http.server" 2>/dev/null
        pkill -f "php -S" 2>/dev/null
        
        # بررسی و آزادسازی پورت 8080
        if lsof -i :8080 > /dev/null 2>&1; then
            echo "آزادسازی پورت 8080..."
            fuser -k 8080/tcp 2>/dev/null
            sleep 2
        fi
        
        # راه‌اندازی سرور از پوشه public
        if [ -d "public" ]; then
            echo "📁 اجرای سرور از پوشه public..."
            cd public
            python3 -m http.server 8080 &
        else
            echo "📁 اجرای سرور از پوشه جاری..."
            python3 -m http.server 8080 &
        fi
        
        SERVER_PID=$!
        echo "✅ سرور راه‌اندازی شد (PID: $SERVER_PID)"
        echo ""
        echo "🌐 آدرس‌های دسترسی:"
        echo "   • داشبورد: http://localhost:8080"
        echo "   • پروژه‌ها: http://localhost:8080/projects/"
        echo ""
        echo "📱 دستورات کنترل:"
        echo "   • توقف: kill $SERVER_PID"
        echo "   • مشاهده لاگ: tail -f nohup.out"
        
        # انتظار برای خروج
        wait $SERVER_PID
        ;;
        
    "stop")
        echo "🛑 توقف سرورها..."
        pkill -f "python3 -m http.server"
        pkill -f "php -S"
        echo "✅ سرورها متوقف شدند"
        ;;
        
    "status")
        echo "📊 وضعیت سرورها:"
        echo "پورت 3000:"
        lsof -i :3000 2>/dev/null || echo "   فعال نیست"
        echo ""
        echo "پورت 8080:"
        lsof -i :8080 2>/dev/null || echo "   فعال نیست"
        ;;
        
    "test")
        echo "🧪 تست دسترسی به پروژه‌ها..."
        cd public
        echo "آزمایش پروژه‌ها از: $(pwd)"
        
        for project in quantum-writer ai-writer secret-garden 3d-converter 2d-to-3d content-manager; do
            if [ -d "projects/$project" ]; then
                echo "✅ $project: وجود دارد"
            else
                echo "❌ $project: وجود ندارد"
            fi
        done
        ;;
        
    *)
        echo "🛠️ مدیریت TetraShop"
        echo "==================="
        echo "دستورات:"
        echo "  ./manage.sh start   - راه‌اندازی سرور"
        echo "  ./manage.sh stop    - توقف سرورها"
        echo "  ./manage.sh status  - وضعیت سرورها"
        echo "  ./manage.sh test    - تست پروژه‌ها"
        echo ""
        echo "آدرس پیشنهادی: http://localhost:8080"
        ;;
esac
