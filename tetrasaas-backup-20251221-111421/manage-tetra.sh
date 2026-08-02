#!/bin/bash
# اسکریپت مدیریت یکپارچه TetraShop

TETRA_HOME="/data/data/com.termux/files/home/tetrashop-projects"
cd "$TETRA_HOME"

echo "🛠️ مدیریت یکپارچه TetraShop"
echo "============================"

case "$1" in
    "start")
        echo "🚀 راه‌اندازی سرور TetraShop..."
        if [ -f "start.sh" ]; then
            ./start.sh
        else
            echo "🌐 اجرای سرور بر روی پورت 8080..."
            python3 -m http.server 8080 &
            echo "✅ سرور اجرا شد: http://localhost:8080"
            echo "📱 از مرورگر وارد شوید: http://localhost:8080/public/"
        fi
        ;;
    
    "fix")
        echo "🔧 ترمیم ساختار پروژه..."
        # کپی پروژه‌ها
        for project in quantum-writer ai-writer secret-garden "3d-converter" "2d-to-3d" content-manager; do
            if [ -d "projects/$project" ]; then
                echo "   ترمیم $project..."
                cp -r "projects/$project" "public/projects/"
            fi
        done
        echo "✅ ترمیم کامل شد"
        ;;
    
    "check")
        echo "🔍 بررسی سلامت پروژه..."
        echo "📁 ساختار پوشه‌ها:"
        echo "  ریشه: $(pwd)"
        echo "  public: $(ls -la public/ 2>/dev/null | head -5 | wc -l) فایل"
        echo "  public/projects: $(ls -la public/projects/ 2>/dev/null | grep -c '^d') پروژه"
        echo "  projects: $(ls -la projects/ 2>/dev/null | grep -c '^d') سورس"
        
        # تست دسترسی
        echo "🌐 تست دسترسی به پروژه‌ها:"
        for project in quantum-writer ai-writer secret-garden; do
            if [ -f "public/projects/$project/index.html" ]; then
                echo "  ✅ $project: فایل وجود دارد"
            else
                echo "  ❌ $project: فایل وجود ندارد"
            fi
        done
        ;;
    
    "clean")
        echo "🧹 پاکسازی فایل‌های موقت..."
        rm -rf public/projects/*
        echo "✅ پاکسازی انجام شد"
        ;;
    
    "backup")
        echo "💾 پشتیبان‌گیری از پروژه..."
        BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
        mkdir -p "$BACKUP_DIR"
        cp -r public/projects "$BACKUP_DIR/"
        cp public/index.html "$BACKUP_DIR/"
        echo "✅ پشتیبان در $BACKUP_DIR ذخیره شد"
        ;;
    
    *)
        echo "📋 دستورات موجود:"
        echo "  ./manage-tetra.sh start    - راه‌اندازی سرور"
        echo "  ./manage-tetra.sh fix      - ترمیم ساختار پروژه"
        echo "  ./manage-tetra.sh check    - بررسی سلامت پروژه"
        echo "  ./manage-tetra.sh clean    - پاکسازی فایل‌های موقت"
        echo "  ./manage-tetra.sh backup   - پشتیبان‌گیری"
        echo ""
        echo "📊 وضعیت فعلی:"
        echo "  پروژه‌های فعال: ۶"
        echo "  مسیر اصلی: $TETRA_HOME"
        echo "  آدرس دسترسی: http://localhost:8080/public/"
        ;;
esac
