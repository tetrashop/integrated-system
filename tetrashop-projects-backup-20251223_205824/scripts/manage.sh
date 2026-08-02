#!/bin/bash

# اسکریپت مدیریت TetraSaaS
PROJECT_DIR="/data/data/com.termux/files/home/tetrashop-projects"
VERCEL_URL=$(cat "$PROJECT_DIR/deploy-url.txt" 2>/dev/null | head -1)

case "$1" in
    "status")
        echo "📊 وضعیت TetraSaaS"
        echo "================="
        
        # وضعیت Git
        echo "🔧 Git Status:"
        git -C "$PROJECT_DIR" status --short
        
        # وضعیت فایل‌ها
        echo ""
        echo "📁 فایل‌های پروژه:"
        ls -la "$PROJECT_DIR" | grep -E "\.(js|json|sh|md)$" | head -10
        
        # اگر آدرس Vercel وجود دارد
        if [ -n "$VERCEL_URL" ]; then
            echo ""
            echo "🌐 آدرس دپلوی: $VERCEL_URL"
            echo -n "   تست اتصال: "
            if curl -s "$VERCEL_URL/health" > /dev/null; then
                echo "✅ فعال"
            else
                echo "❌ غیرفعال"
            fi
        fi
        ;;
        
    "update")
        echo "🔄 بروزرسانی پروژه"
        echo "=================="
        
        # اجرای تست
        cd "$PROJECT_DIR" && ./scripts/test-prod-fixed.sh 2>/dev/null || echo "⚠️ تست اجرا نشد"
        
        # اضافه کردن به Git
        git -C "$PROJECT_DIR" add -A
        git -C "$PROJECT_DIR" commit -m "🔄 بروزرسانی خودکار - $(date '+%Y/%m/%d %H:%M')"
        
        # Push
        git -C "$PROJECT_DIR" push origin main
        echo "✅ بروزرسانی انجام شد"
        ;;
        
    "deploy")
        echo "🚀 اجرای دیپلوی"
        echo "=============="
        cd "$PROJECT_DIR" && ./scripts/deploy-full.sh
        ;;
        
    "backup")
        echo "💾 ایجاد پشتیبان"
        echo "================"
        TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
        BACKUP_DIR="$HOME/tetrasaas-backup-$TIMESTAMP"
        
        mkdir -p "$BACKUP_DIR"
        cp -r "$PROJECT_DIR"/* "$BACKUP_DIR/" 2>/dev/null
        echo "✅ پشتیبان ایجاد شد: $BACKUP_DIR"
        ;;
        
    "logs")
        echo "📋 لاگ‌های اخیر"
        echo "=============="
        find "$PROJECT_DIR" -name "*.log" -type f -exec tail -5 {} \; 2>/dev/null || echo "لاگی یافت نشد"
        ;;
        
    "help")
        echo "🛠️ راهنمای مدیریت TetraSaaS"
        echo "========================"
        echo "دستورات:"
        echo "  ./manage.sh status    - نمایش وضعیت پروژه"
        echo "  ./manage.sh update    - بروزرسانی و پوش خودکار"
        echo "  ./manage.sh deploy    - اجرای دیپلوی کامل"
        echo "  ./manage.sh backup    - ایجاد پشتیبان"
        echo "  ./manage.sh logs      - نمایش لاگ‌ها"
        echo "  ./manage.sh help      - نمایش این راهنما"
        ;;
        
    *)
        echo "⚠️ دستور نامعتبر"
        echo "برای راهنما: ./manage.sh help"
        ;;
esac
