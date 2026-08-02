#!/bin/bash

echo "🔧 راه‌اندازی Tetrashop Backend API..."

# بررسی پایتون
if ! command -v python3 &> /dev/null; then
    echo "❌ پایتون 3 یافت نشد"
    exit 1
fi

# نصب وابستگی‌ها
echo "📦 نصب وابستگی‌ها..."
pip3 install -r requirements.txt

# راه‌اندازی سرور
echo "🚀 شروع سرور..."
python3 main.py
