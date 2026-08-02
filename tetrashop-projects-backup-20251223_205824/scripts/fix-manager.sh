#!/bin/bash
cd /data/data/com.termux/files/home/tetrashop-github

echo "🔧 رفع مشکل پنل مدیریت..."
echo "========================"

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# توقف سرورها
echo -e "${YELLOW}1. توقف سرورهای قبلی...${NC}"
pkill -f "node.*server.js" 2>/dev/null
pkill -f "node.*8080" 2>/dev/null
pkill -f "node.*3001" 2>/dev/null
fuser -k 8080/tcp 2>/dev/null
fuser -k 3001/tcp 2>/dev/null
sleep 2

# بررسی پورت‌ها
echo -e "${YELLOW}2. بررسی پورت‌ها...${NC}"
if lsof -i:8080 >/dev/null 2>&1; then
    echo -e "${RED}❌ پورت 8080 هنوز در حال استفاده است${NC}"
    echo "برنامه‌های در حال استفاده از پورت 8080:"
    lsof -i:8080
    exit 1
else
    echo -e "${GREEN}✅ پورت 8080 آزاد است${NC}"
fi

# راه‌اندازی فروشگاه
echo -e "${YELLOW}3. راه‌اندازی فروشگاه...${NC}"
nohup node server.js > shop.log 2>&1 &
SHOP_PID=$!
sleep 3

if ps -p $SHOP_PID > /dev/null; then
    echo -e "${GREEN}✅ فروشگاه روی پورت 3001 راه‌اندازی شد${NC}"
else
    echo -e "${RED}❌ خطا در راه‌اندازی فروشگاه${NC}"
    tail -10 shop.log
    exit 1
fi

# راه‌اندازی پنل مدیریت
echo -e "${YELLOW}4. راه‌اندازی پنل مدیریت...${NC}"
PORT=8080 nohup node server.js > manager.log 2>&1 &
MANAGER_PID=$!
sleep 3

if ps -p $MANAGER_PID > /dev/null; then
    echo -e "${GREEN}✅ پنل مدیریت روی پورت 8080 راه‌اندازی شد${NC}"
else
    echo -e "${YELLOW}⚠️ تلاش با پورت جایگزین...${NC}"
    # پورت 3002 را امتحان کن
    PORT=3002 nohup node server.js > manager.log 2>&1 &
    MANAGER_PID=$!
    sleep 3
    
    if ps -p $MANAGER_PID > /dev/null; then
        echo -e "${GREEN}✅ پنل مدیریت روی پورت 3002 راه‌اندازی شد${NC}"
    else
        echo -e "${RED}❌ خطا در راه‌اندازی پنل مدیریت${NC}"
        tail -10 manager.log
        exit 1
    fi
fi

# تست دسترسی
echo -e "${YELLOW}5. تست دسترسی...${NC}"
echo -n "فروشگاه (3001): "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✅ فعال${NC}"
else
    echo -e "${RED}❌ غیرفعال${NC}"
fi

echo -n "پنل مدیریت (8080): "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✅ فعال${NC}"
    MANAGER_PORT=8080
elif curl -s -o /dev/null -w "%{http_code}" http://localhost:3002 | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✅ فعال (پورت 3002)${NC}"
    MANAGER_PORT=3002
else
    echo -e "${RED}❌ غیرفعال${NC}"
fi

# نمایش اطلاعات نهایی
echo ""
echo -e "${GREEN}🎉 عملیات کامل شد!${NC}"
echo "======================"
echo "🛒 فروشگاه: http://localhost:3001"
if [ ! -z "$MANAGER_PORT" ]; then
    echo "🛠️ پنل مدیریت: http://localhost:$MANAGER_PORT"
fi
echo ""
echo "📋 وضعیت فرآیندها:"
ps aux | grep "node.*server.js" | grep -v grep | awk '{print "   PID: "$2" | پورت: "$(NF)}'
echo ""
echo "📊 لاگ‌ها:"
echo "   فروشگاه: tail -f shop.log"
echo "   مدیریت: tail -f manager.log"
echo ""
echo "🔄 برای توقف: pkill -f node"
