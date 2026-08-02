#!/bin/bash

echo "🛠️ مدیریت یکپارچه tetrashop-projects"
echo "==================================="

case $1 in
    "deploy")
        echo "🚀 استقرار پروژه tetrashop100..."
        if [ -f "./scripts/deploy.sh" ]; then
            ./scripts/deploy.sh
        else
            echo "❌ اسکریپت deploy یافت نشد"
        fi
        ;;
        
    "test")
        echo "🧪 تست سیستم..."
        curl -s "https://tetrashop100.ramin-edjlal1359.workers.dev/health" | head -1
        ;;
        
    "sync")
        echo "🔄 همگام‌سازی با مخزن اصلی..."
        git pull origin main 2>/dev/null || echo "خطا در همگام‌سازی"
        ;;
        
    "status")
        echo "📊 وضعیت فعلی:"
        echo "📍 مسیر: $(pwd)"
        echo "📁 فایل‌ها: $(find . -type f | wc -l)"
        echo "🔗 Git: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'N/A')"
        ;;
        
    "projects")
        echo "📋 پروژه‌های tetrashop:"
        echo "🛒 tetrashop100 - پلتفرم تجارت الکترونیک"
        echo "📊 tetrashop200 - سیستم تحلیل پیشرفته" 
        echo "🤖 tetrashop250 - هوش مصنوعی و پیشنهادات"
        ;;
        
    *)
        echo "🎯 دستورات موجود:"
        echo "  deploy   - استقرار پروژه"
        echo "  test     - تست سلامت سیستم"
        echo "  sync     - همگام‌سازی با مخزن اصلی"
        echo "  status   - نمایش وضعیت"
        echo "  projects - نمایش پروژه‌ها"
        ;;
esac
