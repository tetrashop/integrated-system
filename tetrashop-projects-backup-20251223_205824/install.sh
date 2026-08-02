#!/bin/bash

echo "📦 نصب TetraCloud Professional..."
cd /data/data/com.termux/files/home/tetrashop-projects

# نصب وابستگی‌ها
echo "🔧 در حال نصب npm packages..."
npm init -y
npm install express cors

# ایجاد فایل‌های ضروری
if [ ! -f "public/index.html" ]; then
    echo "📄 ایجاد فایل‌ها..."
    # کپی فایل‌های بالا
fi

# شروع سرور
echo "🚀 شروع سرور..."
node server.js
