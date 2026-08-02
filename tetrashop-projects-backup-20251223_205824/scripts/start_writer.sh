#!/bin/bash

echo "📝 راه‌اندازی Intelligent Writer..."

# بررسی Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js یافت نشد"
    exit 1
fi

# نصب وابستگی‌ها
echo "📦 نصب وابستگی‌ها..."
npm install

# راه‌اندازی سرور
echo "🚀 شروع سرور..."
npm start
