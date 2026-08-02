#!/bin/bash

echo "🔄 شروع رفع مشکلات پروژه..."

cd /data/data/com.termux/files/home/tetrashop-projects

# 1. پاکسازی
echo "🧹 پاکسازی فایل‌های قدیمی..."
rm -rf node_modules package-lock.json dist .vercel .next

# 2. نصب وابستگی‌های اصلی
echo "📦 نصب React و Vite..."
npm install react react-dom --save
npm install vite @vitejs/plugin-react --save-dev
npm install axios lucide-react --save

# 3. نصب TypeScript
echo "📝 نصب TypeScript..."
npm install typescript @types/react @types/react-dom --save-dev

# 4. بررسی نصب
echo "🔍 بررسی نصب..."
if npx vite --version >/dev/null 2>&1; then
    echo "✅ Vite نصب شده است"
else
    echo "❌ Vite نصب نشده"
    exit 1
fi

# 5. ساخت پروژه
echo "🔨 ساخت پروژه..."
npm run build

# 6. بررسی ساخت
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "🎉 پروژه با موفقیت ساخته شد!"
    echo ""
    echo "📁 فایل‌های ساخته شده:"
    ls -la dist/
else
    echo "❌ خطا در ساخت پروژه"
    echo "لطفاً خطاهای بالا را بررسی کنید"
    exit 1
fi

echo ""
echo "🚀 اکنون می‌توانید روی Vercel مستقر کنید:"
echo "vercel --prod"
