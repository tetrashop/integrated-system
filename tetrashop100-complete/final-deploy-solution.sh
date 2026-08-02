#!/bin/bash
echo "🎯 راه‌حل نهایی استقرار Tetrashop100"

echo "📋 گزینه‌ها:"
echo "1. ایجاد ریپازیتوری جدید برای پروژه کامل (توصیه می‌شود)"
echo "2. جایگزینی ریپازیتوری فعلی با force push"
echo "3. ادغام با ریپازیتوری فعلی"

read -p "انتخاب شما (1-3): " choice

case $choice in
    1)
        echo "🚀 ایجاد ریپازیتوری جدید..."
        # ایجاد ریپازیتوری جدید با نام متفاوت
        NEW_REPO="tetrashop100-complete-v2"
        
        cd ~/tetrashop-consolidated
        mkdir -p $NEW_REPO
        cd $NEW_REPO
        
        # کپی محتوای کامل
        cp -r ../deploy-ready/* .
        cp -r ../organized-projects/* .
        
        git init
        git add .
        git commit -m "🚀 Tetrashop100 Complete System"
        
        echo "✅ پروژه جدید آماده در: ~/tetrashop-consolidated/$NEW_REPO"
        echo "🌐 حالا ریپازیتوری جدید در GitHub ایجاد کنید و پوش کنید"
        ;;
    2)
        echo "💥 جایگزینی ریپازیتوری فعلی..."
        cd ~/tetrashop-consolidated/deploy-ready
        git push -f origin main
        ;;
    3)
        echo "🔄 ادغام با ریپازیتوری فعلی..."
        cd ~/tetrashop-consolidated/deploy-ready
        git pull origin main --allow-unrelated-histories
        git add .
        git commit -m "Merge Tetrashop100 complete system"
        git push origin main
        ;;
    *)
        echo "❌ انتخاب نامعتبر"
        ;;
esac
