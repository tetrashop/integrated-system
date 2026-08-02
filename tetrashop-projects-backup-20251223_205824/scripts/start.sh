#!/bin/bash
echo "🚀 راه‌اندازی Tetrashop Gateway"
echo "==============================="
echo ""
echo "📦 نصب وابستگی‌ها..."
npm install
echo ""
echo "🚪 شروع Gateway API..."
node core/gateway/server.js
