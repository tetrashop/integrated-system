#!/bin/bash

# پیدا کردن index.html اصلی
MAIN_INDEX="index.html"

if [ -f "$MAIN_INDEX" ]; then
    echo "🎨 اضافه کردن استایل inline به $MAIN_INDEX..."
    
    # پشتیبان‌گیری
    cp "$MAIN_INDEX" "${MAIN_INDEX}.backup"
    
    # اضافه کردن استایل inline بعد از تگ head
    sed -i '/<head>/a \
    <style>\
        /* استایل اضطراری برای رفع نوارهای سفید */\
        html, body { margin: 0 !important; padding: 0 !important; width: 100% !important; height: 100% !important; }\
        body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important; }\
        * { box-sizing: border-box !important; }\
        .container, #app, #root, .app { min-height: 100vh !important; background: transparent !important; }\
    </style>' "$MAIN_INDEX"
    
    echo "✅ استایل inline اضافه شد"
else
    echo "❌ فایل index.html پیدا نشد"
fi
