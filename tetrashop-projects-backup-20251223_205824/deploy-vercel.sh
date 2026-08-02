#!/bin/bash

echo "🚀 آماده‌سازی برای استقرار Vercel"

cd /data/data/com.termux/files/home/tetrashop-projects

# 1. پاکسازی symbolic links
echo "🧹 پاکسازی symbolic links..."
if [ -d "public/projects" ]; then
    echo "⚠️  پوشه public/projects وجود دارد. بررسی symbolic links..."
    find public/projects -type l -ls 2>/dev/null | head -5
    
    # حذف symbolic links بازگشتی
    find public/projects -type l -delete 2>/dev/null
fi

# 2. ساخت پروژه
echo "🔨 ساخت پروژه..."
npm run build 2>&1 | tail -10

# 3. بررسی ساخت
if [ ! -f "dist/index.html" ]; then
    echo "❌ ساخت ناموفق! مشکل:"
    npm run build 2>&1 | grep -A5 -B5 "error"
    exit 1
fi

# 4. ایجاد vercel.json بهینه
cat > vercel.json << 'CONFIG'
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "VITE_API_URL": "https://tetrashop-projects.vercel.app"
  }
}
CONFIG

# 5. استقرار
echo "🌐 استقرار روی Vercel..."
vercel --prod --yes

echo ""
echo "🎉 استقرار کامل شد!"
echo "📱 آدرس پروژه شما:"
echo "https://tetrashop-projects.vercel.app"
