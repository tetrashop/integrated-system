#!/bin/bash

echo "🚀 راه‌اندازی سیستم درآمدزایی شطرجد TetraShop"
echo "=============================================="

# رنگ‌های ترمینال
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# توقف سرورهای قبلی
echo -e "${YELLOW}🛑 توقف سرورهای قبلی...${NC}"
pkill -f "node.*server.js" 2>/dev/null
sleep 2

# یافتن پورت آزاد
find_free_port() {
    for port in {7600..7700}; do
        if ! netstat -tulpn 2>/dev/null | grep -q :$port && ! lsof -i :$port 2>/dev/null; then
            echo $port
            return
        fi
    done
    echo 7600
}

PORT=$(find_free_port)

# ایجاد دایرکتوری داده
echo -e "${BLUE}📁 ایجاد ساختار داده...${NC}"
mkdir -p /data/data/com.termux/files/home/tetrashop-projects/data

# راه‌اندازی سرور
echo -e "${GREEN}🚀 در حال راه‌اندازی سرور روی پورت ${PORT}...${NC}"
cd /data/data/com.termux/files/home/tetrashop-projects/chess-integrated
PORT=$PORT node server.js
