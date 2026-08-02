#!/bin/bash

echo "🔧 راه‌اندازی Backend API پیشرفته..."

# بررسی پایتون
if command -v python3 &> /dev/null; then
    echo "🐍 اجرای FastAPI Server..."
    pip3 install -r requirements.txt 2>/dev/null || pip install -r requirements.txt
    
    # اجرای سرور اصلی
    python3 main.py &
    
    echo "🎤 فعال‌سازی پردازش صوت..."
    python3 scripts/speech_processor.py &
    
    echo "✅ Backend API فعال شد"
    echo "🔗 آدرس: http://localhost:8000"
    echo "📚 مستندات: http://localhost:8000/docs"
else
    echo "❌ پایتون 3 یافت نشد"
fi
