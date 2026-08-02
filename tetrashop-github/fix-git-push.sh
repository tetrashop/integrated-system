#!/bin/bash

echo "🔧 رفع مشکل push Git..."

echo "📊 وضعیت فعلی:"
git status

echo "🔄 دریافت آخرین تغییرات از remote..."
git fetch origin

echo "🔍 بررسی تفاوت‌ها..."
LOCAL_COMMITS=$(git log origin/main..main --oneline)
if [ -z "$LOCAL_COMMITS" ]; then
    echo "✅ همه کامیت‌ها قبلاً push شده‌اند"
else
    echo "📝 کامیت‌های local که push نشده‌اند:"
    echo "$LOCAL_COMMITS"
    
    echo "🚀 در حال push کردن..."
    git push origin main
    
    if [ $? -ne 0 ]; then
        echo "⚠️  Push با مشکل مواجه شد. در حال rebase..."
        git pull origin main --rebase
        
        echo "🔄 ادامه rebase..."
        git rebase --continue 2>/dev/null || echo "No conflicts to resolve"
        
        echo "🚀 push مجدد..."
        git push origin main
    fi
fi

echo "✅ عملیات تکمیل شد!"
echo "💡 آخرین کامیت:"
git log --oneline -1
