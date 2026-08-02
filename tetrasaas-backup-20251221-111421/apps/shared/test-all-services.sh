#!/bin/bash

echo "🎯 تست کامل تمام سرویس‌های Tetrashop"
echo "===================================="

# رنگ‌ها برای نمایش بهتر
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# تابع تست سرویس
test_service() {
    local name=$1
    local url=$2
    local method=${3:-GET}
    local data=${4:-}
    
    echo -n "🧪 تست $name... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -X POST -H "Content-Type: application/json" -d "$data" "$url")
    else
        response=$(curl -s "$url")
    fi
    
    if [ $? -eq 0 ] && [ ! -z "$response" ]; then
        echo -e "${GREEN}✅ موفق${NC}"
        echo "   📋 پاسخ: $(echo $response | cut -c 1-50)..."
    else
        echo -e "${RED}❌ خطا${NC}"
        echo "   💡 سرویس ممکن است اجرا نشده باشد"
    fi
}

# تست سرویس‌ها
echo ""
echo "🔍 تست سلامت سرویس‌ها:"

test_service "Tetrashop اصلی" "http://localhost:3000/api/health"
test_service "Backend API" "http://localhost:8000/api/health" 
test_service "Intelligent Writer" "http://localhost:3002/api/health"

echo ""
echo "🛒 تست عملکرد فروشگاه:"

test_service "لیست محصولات" "http://localhost:3000/api/products"
test_service "صفحه اصلی" "http://localhost:3000"

echo ""
echo "🤖 تست قابلیت‌های هوش مصنوعی:"

test_service "پردازش AI" "http://localhost:8000/api/ai/process" "POST" '{"text": "سلام تست", "model": "default"}'
test_service "تولید محتوا" "http://localhost:3002/api/generate" "POST" '{"prompt": "تست سیستم تولید محتوا", "model": "creative"}'

echo ""
echo "🌐 تست دسترسی‌های وب:"

# تست دسترسی به صفحات
echo -n "🧪 تست صفحه مدیریت... "
if curl -s http://localhost:3000/admin > /dev/null; then
    echo -e "${GREEN}✅ در دسترس${NC}"
else
    echo -e "${YELLOW}⚠️ ممکن است نیاز به ساخت داشته باشد${NC}"
fi

echo -n "🧪 تست مستندات API... "
if curl -s http://localhost:8000/docs > /dev/null; then
    echo -e "${GREEN}✅ در دسترس${NC}"
else
    echo -e "${YELLOW}⚠️ ممکن است نیاز به ساخت داشته باشد${NC}"
fi

echo ""
echo "📊 نتیجه نهایی تست:"
echo "==================="

# بررسی پورت‌های فعال
echo "🔍 پورت‌های فعال:"
for port in 3000 3002 8000 9002; do
    if netstat -tuln | grep ":$port " > /dev/null; then
        echo -e "   ${GREEN}✅ پورت $port فعال${NC}"
    else
        echo -e "   ${RED}❌ پورت $غیرفعال${NC}"
    fi
done

echo ""
echo "🎯 دستورات راه‌اندازی اگر سرویس‌ها اجرا نیستند:"
echo "   ./emergency-repair-30min.sh"
echo "   node unified-manager.js"
echo ""
echo "🌐 برای تست دستی در مرورگر:"
echo "   فروشگاه: http://localhost:3000"
echo "   شطرنج: http://localhost:9002/chess_ui.html"
echo "   مستندات: http://localhost:8000/docs"
