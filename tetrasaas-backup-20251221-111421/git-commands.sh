#!/bin/bash

echo "🔧 مدیریت Git برای TetraSaaS"
echo "============================"

case "$1" in
    "init")
        echo "🎯 راه‌اندازی Git..."
        git init
        git config user.email "tetrasaas@example.com"
        git config user.name "TetraSaaS Team"
        echo "✅ Git راه‌اندازی شد"
        ;;
        
    "add-all")
        echo "📦 اضافه کردن همه فایل‌ها..."
        git add -A
        echo "✅ همه فایل‌ها اضافه شدند"
        ;;
        
    "commit")
        if [ -z "$2" ]; then
            echo "⚠️ لطفا پیام commit را وارد کنید:"
            echo "   ./git-commands.sh commit \"پیام شما\""
            exit 1
        fi
        echo "💾 در حال commit..."
        git commit -m "$2"
        echo "✅ commit با پیام: \"$2\""
        ;;
        
    "push")
        echo "🚀 در حال push به GitHub..."
        git push -u origin main
        echo "✅ Push انجام شد"
        ;;
        
    "status")
        echo "📊 وضعیت Git:"
        git status
        ;;
        
    "backup")
        echo "💾 ایجاد backup..."
        timestamp=$(date +%Y%m%d_%H%M%S)
        backup_dir="../tetrasaas-backup-$timestamp"
        mkdir -p "$backup_dir"
        cp -r . "$backup_dir" 2>/dev/null
        echo "✅ Backup ایجاد شد در: $backup_dir"
        ;;
        
    *)
        echo "استفاده: ./git-commands.sh {init|add-all|commit|push|status|backup}"
        exit 1
        ;;
esac
