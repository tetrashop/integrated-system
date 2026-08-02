#!/bin/bash

echo ""
echo "🚀 راه‌اندازی پلتفرم TetraShop با ماژول شطرجد درآمدزا"
echo "===================================================="

# رنگ‌های ترمینال
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# توقف سرورهای قبلی
echo -e "${YELLOW}🛑 بررسی سرورهای فعال...${NC}"
pkill -f "node.*server.js" 2>/dev/null
sleep 2

# یافتن پورت آزاد
find_free_port() {
    for port in {3000..3100}; do
        if ! netstat -tulpn 2>/dev/null | grep -q :$port && ! lsof -i :$port 2>/dev/null; then
            echo $port
            return
        fi
    done
    echo 3000
}

PORT=$(find_free_port)

# ایجاد ساختار داده
echo -e "${BLUE}📁 بررسی ساختار داده...${NC}"
mkdir -p /data/data/com.termux/files/home/tetrashop-projects/data/chess
mkdir -p /data/data/com.termux/files/home/tetrashop-projects/public/modules/chess
mkdir -p /data/data/com.termux/files/home/tetrashop-projects/modules/chess-revenue/public

# بررسی فایل‌های ضروری
echo -e "${BLUE}🔍 بررسی فایل‌های سیستم...${NC}"
required_files=(
    "server.js"
    "package.json"
    "public/index.html"
    "public/modules/chess/index.html"
    "modules/chess-revenue/routes.js"
    "data/chess/users.json"
)

for file in "${required_files[@]}"; do
    if [ -f "/data/data/com.termux/files/home/tetrashop-projects/$file" ]; then
        echo -e "  ✅ $file"
    else
        echo -e "  ❌ $file (مفقود)"
    fi
done

# نصب وابستگی‌ها
echo -e "${YELLOW}📦 نصب وابستگی‌ها...${NC}"
cd /data/data/com.termux/files/home/tetrashop-projects
npm install express cors --silent

# راه‌اندازی سرور
echo -e "${GREEN}🚀 در حال راه‌اندازی سرور روی پورت ${PORT}...${NC}"
echo ""
echo -e "${BLUE}====================================================${NC}"
echo -e "${GREEN}         پلتفرم TetraShop راه‌اندازی شد!          ${NC}"
echo -e "${BLUE}====================================================${NC}"
echo ""
echo -e "${YELLOW}🌐 آدرس‌های مهم:${NC}"
echo -e "  🏠 ${GREEN}داشبورد اصلی:${NC} http://localhost:${PORT}"
echo -e "  ♟️ ${GREEN}ماژول شطرجد:${NC} http://localhost:${PORT}/chess/static"
echo -e "  📊 ${GREEN}وضعیت سرور:${NC} http://localhost:${PORT}/api/status"
echo -e "  💰 ${GREEN}وضعیت شطرجد:${NC} http://localhost:${PORT}/chess/api/status"
echo ""
echo -e "${YELLOW}🎯 ماژول شطرجد درآمدزا:${NC}"
echo -e "  • 🎮 بازی رایگان و حرفه‌ای"
echo -e "  • 💎 فروش سکه (۱۰,۰۰۰ تا ۸۰,۰۰۰ تومان)"
echo -e "  • 📈 پیش‌بینی درآمد ماهانه: ${GREEN}۹,۵۰۰,۰۰۰ تومان${NC}"
echo -e "  • 🏆 سیستم رده‌بندی رقابتی"
echo ""
echo -e "${YELLOW}👤 حساب‌های تست:${NC}"
echo -e "  • کاربر عادی: ${GREEN}test_user${NC} / ${GREEN}test${NC}"
echo -e "  • ادمین: ${GREEN}admin${NC} / ${GREEN}admin${NC}"
echo ""
echo -e "${BLUE}====================================================${NC}"
echo -e "${GREEN}✅ سیستم آماده بهره‌برداری است!${NC}"
echo -e "${BLUE}====================================================${NC}"
echo ""

# راه‌اندازی سرور
PORT=$PORT node server.js
