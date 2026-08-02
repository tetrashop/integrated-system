#!/bin/bash

echo "🧪 تست سایت deploy شده..."

URL="https://tetrashop-projects-au7miu45t-ramin-edjlal-s-projects.vercel.app"

# تست صفحه اصلی
echo "1. تست صفحه اصلی..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
if [ "$STATUS" = "200" ]; then
    echo "✅ صفحه اصلی: قابل دسترس"
    
    # بررسی محتوا
    TITLE=$(curl -s "$URL" | grep -o "<title>[^<]*</title>" | head -1)
    echo "📝 عنوان صفحه: $TITLE"
    
    # بررسی NLP
    NLP_COUNT=$(curl -s "$URL" | grep -o "۲۲۳" | head -1)
    if [ "$NLP_COUNT" = "۲۲۳" ]; then
        echo "✅ تعداد پست‌های NLP: ۲۲۳"
    else
        echo "⚠️  تعداد پست‌های NLP پیدا نشد"
    fi
else
    echo "❌ صفحه اصلی: خطا $STATUS"
fi

# تست پروژه NLP
echo -e "\n2. تست پروژه NLP..."
NLP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL/nlp")
if [ "$NLP_STATUS" = "200" ]; then
    echo "✅ صفحه NLP: قابل دسترس"
    
    # بررسی تعداد پست‌ها در صفحه NLP
    POSTS=$(curl -s "$URL/nlp" | grep -o "۲۲۳" | head -1)
    if [ "$POSTS" = "۲۲۳" ]; then
        echo "✅ تعداد پست‌های NLP در صفحه: ۲۲۳"
    else
        echo "⚠️  تعداد پست‌ها در صفحه NLP پیدا نشد"
    fi
else
    echo "❌ صفحه NLP: خطا $NLP_STATUS"
fi

echo -e "\n🎉 تست کامل شد!"
echo "🌐 آدرس پروژه: $URL"
