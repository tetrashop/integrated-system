#!/bin/bash

echo "🛠️  رفع مشکلات استقرار Vercel"

# 1. رفتن به پوشه پروژه
cd /data/data/com.termux/files/home/tetrasaas-dashboard

# 2. نصب وابستگی‌ها
echo "📦 نصب وابستگی‌ها..."
npm install
npm install --save-dev typescript @types/react @types/react-dom @types/node

# 3. حذف symlink مشکل‌ساز
echo "🗑️  بررسی symlink‌های مشکل‌ساز..."
if [ -d "./public/projects/secret-garden/secret-garden" ]; then
    echo "⚠️  حذف symlink بازگشتی..."
    rm -rf ./public/projects/secret-garden/secret-garden
fi

# 4. ایجاد فایل .vercelignore
echo "📝 ایجاد فایل .vercelignore..."
cat > .vercelignore << 'IGNORE'
node_modules/
*.log
.env
.DS_Store
public/projects/secret-garden/secret-garden
IGNORE

# 5. ساخت پروژه
echo "🔨 ساخت پروژه..."
npm run build

# 6. بررسی ساخت
if [ -d "dist" ]; then
    echo "✅ ساخت موفقیت‌آمیز بود!"
    echo "📁 پوشه dist ایجاد شده است"
    ls -la dist/
else
    echo "❌ ساخت ناموفق بود"
    exit 1
fi

echo ""
echo "🚀 اکنون می‌توانید استقرار کنید:"
echo "vercel --prod"
