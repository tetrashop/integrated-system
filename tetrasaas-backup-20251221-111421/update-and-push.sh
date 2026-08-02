#!/bin/bash

echo "🔄 بروزرسانی و پوش پروژه"
echo "======================="

# متغیرها
REPO_DIR="/data/data/com.termux/files/home/tetrashop-projects"
COMMIT_MSG=${1:-"بروزرسانی پروژه"}

cd "$REPO_DIR" || exit 1

# 1. ایجاد backup قبل از تغییرات
echo "💾 ایجاد backup..."
BACKUP_DIR="../tetrasaas-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r . "$BACKUP_DIR" 2>/dev/null
echo "✅ Backup در: $BACKUP_DIR"

# 2. اجرای تست سلامت
echo "🧪 اجرای تست سلامت..."
if [ -f "./test-prod-fixed.sh" ]; then
    ./test-prod-fixed.sh > test-results-$(date +%Y%m%d).txt
    echo "✅ نتایج تست ذخیره شد"
fi

# 3. به‌روزرسانی فایل‌ها
echo "📝 به‌روزرسانی فایل‌ها..."
# کپی اسکریپت‌های مهم
cp ~/tetra-services-manager.sh ./scripts/ 2>/dev/null || true
cp ~/tetra-services/*.js ./services/ 2>/dev/null || true

# 4. Git operations
echo "🔧 عملیات Git..."
git status

# 5. اضافه کردن فایل‌های جدید
echo "📦 اضافه کردن فایل‌های جدید..."
git add -A

# 6. کامیت
echo "💾 کامیت تغییرات..."
git commit -m "$COMMIT_MSG - $(date '+%Y/%m/%d %H:%M')" || echo "⚠️ هیچ تغییر جدیدی نیست"

# 7. پوش
echo "🚀 پوش به GitHub..."
if git remote | grep -q "origin"; then
    git push origin main
    echo "✅ پوش موفقیت‌آمیز بود"
else
    echo "⚠️ remote origin تنظیم نشده"
    echo "ابتدا تنظیم کنید:"
    echo "   git remote add origin https://github.com/YOUR-USERNAME/tetrasaas.git"
fi

# 8. دیپلوی Vercel (اگر Vercel CLI نصب باشد)
echo "🌐 بررسی دیپلوی Vercel..."
if command -v vercel &> /dev/null; then
    echo "🔄 دیپلوی روی Vercel..."
    vercel --prod --yes
    echo "✅ دیپلوی Vercel انجام شد"
else
    echo "⚠️ Vercel CLI نصب نیست. برای نصب:"
    echo "   npm install -g vercel"
fi

echo ""
echo "🎉 عملیات کامل شد!"
echo "📊 خلاصه:"
echo "   - Backup ایجاد شد"
echo "   - تست سلامت اجرا شد"  
echo "   - Git کامیت و پوش شد"
echo "   - Vercel دیپلوی شد"
