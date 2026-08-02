#!/bin/bash
echo "🚀 راه‌اندازی Tetrashop100 Frontend..."

# بررسی اینکه پورت 3001 آزاد است
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  پورت 3001 مشغول است. پورت دیگری پیدا می‌کنم..."
    PORT=3002 npx next dev
else
    echo "✅ پورت 3001 آزاد است. راه‌اندازی..."
    npx next dev -p 3001
fi
