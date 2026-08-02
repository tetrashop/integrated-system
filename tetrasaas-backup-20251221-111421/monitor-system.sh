#!/bin/bash

echo "📊 مانیتورینگ سیستم شطرنج ابری..."

while true; do
    clear
    echo "=== 🚀 Cloud Chess System Monitor ==="
    echo "زمان: $(date)"
    echo ""
    
    # وضعیت کانتینرها
    echo "🐳 وضعیت کانتینرها:"
    docker-compose ps
    
    echo ""
    echo "📈 آمار عملکرد:"
    
    # بررسی حافظه و CPU
    echo "💾 استفاده از منابع:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" chess-engine-cpp
    
    echo ""
    echo "🔗 اتصال‌های فعال:"
    # شبیه‌سازی تعداد اتصال‌های فعال
    connections=$(netstat -an | grep :9002 | grep ESTABLISHED | wc -l)
    echo "   اتصال‌های WebSocket: $connections"
    
    echo ""
    echo "⏳ بروزرسانی در 5 ثانیه... (Ctrl+C برای خروج)"
    sleep 5
done
