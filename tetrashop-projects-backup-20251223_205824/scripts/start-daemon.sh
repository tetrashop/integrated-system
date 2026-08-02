#!/bin/bash
cd /data/data/com.termux/files/home/tetrashop-projects
nohup node index.js > server.log 2>&1 &
echo "✅ سرور در پس‌زمینه راه‌اندازی شد"
echo "📁 لاگ‌ها: server.log"
echo "🌐 آدرس: http://localhost:3000"
echo "🔄 برای توقف: pkill -f node"
