#!/bin/bash

echo "🔧 حل مشکل دپلوی Vercel..."

# 1. بررسی وضعیت
echo "📊 بررسی وضعیت git..."
git status

# 2. دریافت آخرین تغییرات
echo "🔄 دریافت تغییرات از remote..."
git fetch origin

# 3. همگام‌سازی
echo "🔄 همگام‌سازی با remote/main..."
git reset --hard origin/main

# 4. ایجاد فایل vercel.json اگر وجود ندارد
if [ ! -f "vercel.json" ]; then
    echo "📝 ایجاد فایل vercel.json..."
    cat > vercel.json << 'VERCEL'
{
  "version": 2,
  "buildCommand": "echo 'No build needed'",
  "outputDirectory": ".",
  "routes": [
    { "src": "/chess", "dest": "/chess/index.html" },
    { "src": "/writer", "dest": "/writer/index.html" },
    { "src": "/nlp", "dest": "/nlp/index.html" },
    { "src": "/quantum", "dest": "/quantum/index.html" },
    { "src": "/gardening", "dest": "/gardening/index.html" },
    { "src": "/voice-recognition", "dest": "/voice-recognition/index.html" },
    { "src": "/2d-to-3d", "dest": "/2d-to-3d/index.html" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
VERCEL
fi

# 5. ایجاد فایل .vercelignore
echo "📝 ایجاد فایل .vercelignore..."
cat > .vercelignore << 'IGNORE'
.git
.gitignore
node_modules
*.log
.DS_Store
IGNORE

# 6. کامیت تغییرات
echo "💾 کامیت تغییرات..."
git add .
git commit -m "fix: Add Vercel config for proper deployment" || true

# 7. Push
echo "🚀 در حال push به GitHub..."
git push origin main

echo "✅ انجام شد! حالا به Vercel Dashboard بروید و دپلوی را بررسی کنید."
echo "🌐 آدرس: https://vercel.com/dashboard"
