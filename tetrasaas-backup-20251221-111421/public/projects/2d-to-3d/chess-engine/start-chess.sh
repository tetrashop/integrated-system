#!/bin/bash

echo "♟️ راه‌اندازی Chess Engine پیشرفته..."

# بررسی پایتون
if command -v python3 &> /dev/null; then
    echo "🐍 اجرای Chess AI..."
    python3 chess_ai.py --level expert &
    
    echo "🌐 راه‌اندازی رابط وب..."
    python3 chess_app.py &
    
    echo "✅ Chess Engine فعال شد"
    echo "🔗 آدرس: http://localhost:8080"
else
    echo "❌ پایتون 3 یافت نشد"
fi
