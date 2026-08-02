#!/bin/bash

echo "🚀 رفع نهایی مشکل Vercel deploy..."

# 1. پاک کردن تنظیمات قدیمی
echo "🧹 پاک کردن تنظیمات قدیمی..."
rm -rf .vercel
rm -f vercel.json project.json

# 2. ایجاد vercel.json ساده
echo "📝 ایجاد تنظیمات جدید..."
cat > vercel.json << 'CONFIG'
{
  "version": 2,
  "rewrites": [
    { "source": "/chess", "destination": "/chess/index.html" },
    { "source": "/writer", "destination": "/writer/index.html" },
    { "source": "/nlp", "destination": "/nlp/index.html" },
    { "source": "/quantum", "destination": "/quantum/index.html" },
    { "source": "/gardening", "destination": "/gardening/index.html" },
    { "source": "/voice-recognition", "destination": "/voice-recognition/index.html" },
    { "source": "/2d-to-3d", "destination": "/2d-to-3d/index.html" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
CONFIG

# 3. ایجاد .vercelignore برای جلوگیری از تشخیص اشتباه
cat > .vercelignore << 'IGNORE'
*.py
requirements.txt
venv/
__pycache__/
Dockerfile
docker-compose.yml
*.cjs
*.log
node_modules/
.git/
IGNORE

# 4. Deploy
echo "🚀 در حال deploy..."
vercel --prod --force

echo "✅ انجام شد!"
