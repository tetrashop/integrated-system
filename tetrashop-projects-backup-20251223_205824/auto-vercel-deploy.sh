#!/bin/bash

echo "🚀 دیپلوی خودکار به Vercel"
echo "=========================="

PROJECT_DIR="/data/data/com.termux/files/home/tetrashop-projects"
LOG_FILE="$PROJECT_DIR/vercel-deploy.log"

cd "$PROJECT_DIR" || {
    echo "❌ خطا: دایرکتوری پروژه یافت نشد"
    exit 1
}

# بررسی Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 نصب Vercel CLI..."
    npm install -g vercel
fi

# بررسی token
if [ -z "$VERCEL_TOKEN" ]; then
    echo "⚠️ VERCEL_TOKEN تنظیم نشده"
    echo "لطفا export کنید:"
    echo "export VERCEL_TOKEN='your-token-here'"
    exit 1
fi

echo "🔍 بررسی تغییرات برای دیپلوی..."

# بررسی اگر تغییری وجود دارد
if git status --porcelain | grep -q "^[MADRC]"; then
    echo "📝 تغییرات یافت شد. در حال دیپلوی..."
    
    # لاگ
    echo "[$(date '+%Y/%m/%d %H:%M:%S')] شروع دیپلوی" >> "$LOG_FILE"
    
    # دیپلوی
    DEPLOY_OUTPUT=$(vercel --prod --token="$VERCEL_TOKEN" --yes 2>&1)
    echo "$DEPLOY_OUTPUT" >> "$LOG_FILE"
    
    # استخراج URL
    if echo "$DEPLOY_OUTPUT" | grep -q "Production:"; then
        DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -o "https://[^ ]*\.vercel\.app" | head -1)
        echo "✅ دیپلوی موفقیت‌آمیز!"
        echo "🌐 آدرس: $DEPLOY_URL"
        
        # ذخیره URL
        echo "$DEPLOY_URL" > .last-deploy-url
        echo "$(date)" >> .last-deploy-url
        
        # تست اتصال
        echo "🧪 تست اتصال..."
        if curl -s "$DEPLOY_URL/health" >/dev/null; then
            echo "✅ اتصال موفق"
        else
            echo "⚠️ اتصال با تأخیر"
        fi
    else
        echo "❌ خطا در دیپلوی"
        echo "📋 لاگ: $LOG_FILE"
    fi
else
    echo "✅ هیچ تغییری برای دیپلوی وجود ندارد"
fi

echo ""
echo "🔄 دیپلوی کامل شد"
