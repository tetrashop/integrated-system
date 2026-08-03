#!/bin/bash

echo "🛑 متوقف‌سازی همه‌ی سرویس‌ها..."
pkill -f "node server.js"
pkill -f "npm start"
pkill -f "python app.py"
echo "✅ همه‌ی سرویس‌ها متوقف شدند."
