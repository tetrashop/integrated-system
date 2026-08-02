#!/bin/bash

echo "🚀 شروع deploy روی Vercel..."

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. بررسی وضعیت
echo -e "${BLUE}📊 بررسی وضعیت پروژه...${NC}"
ls -la

# 2. بررسی تنظیمات Vercel
if [ ! -f "vercel.json" ]; then
    echo -e "${YELLOW}⚠️  فایل vercel.json وجود ندارد. ایجاد...${NC}"
    cat > vercel.json << 'VERCEL'
{
  "version": 2,
  "builds": [{ "src": "**", "use": "@vercel/static" }],
  "routes": [{ "src": "/(.*)", "dest": "/index.html" }]
}
VERCEL
fi

# 3. Deploy
echo -e "${BLUE}🚀 در حال deploy...${NC}"
vercel --prod 2>&1 | tee deploy-log.txt

# 4. بررسی نتیجه
if grep -q "Production Deployment" deploy-log.txt; then
    echo -e "${GREEN}✅ deploy موفقیت‌آمیز بود!${NC}"
    
    # استخراج URL
    URL=$(grep -o "https://tetrashop-projects[^\s]*" deploy-log.txt | head -1)
    if [ -n "$URL" ]; then
        echo -e "${BLUE}🌐 آدرس پروژه: $URL${NC}"
        
        # باز کردن در مرورگر
        if command -v xdg-open &> /dev/null; then
            xdg-open "$URL"
        elif command -v open &> /dev/null; then
            open "$URL"
        fi
        
        # تست پروژه
        echo -e "${YELLOW}🧪 تست پروژه...${NC}"
        curl -s -o /dev/null -w "%{http_code}" "$URL"
        echo " - کد وضعیت"
    fi
else
    echo -e "${RED}❌ deploy با مشکل مواجه شد.${NC}"
    echo "📋 لاگ کامل:"
    cat deploy-log.txt | tail -20
fi

# 5. تمیزکاری
rm -f deploy-log.txt

echo -e "${GREEN}🎉 عملیات تکمیل شد!${NC}"
