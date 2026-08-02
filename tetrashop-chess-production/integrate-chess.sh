#!/bin/bash

echo "🚀 شروع یکپارچه‌سازی پلتفرم شطرنج با تتراشاپ..."

CHESS_URL="https://tetrashop-chess-production-gkspbfjx0-ramin-edjlal-s-projects.vercel.app"

# پیدا کردن و جایگزینی فایل‌ها
find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) -exec grep -l "شطرنج.*بزودی\|chess.*coming.soon" {} \; 2>/dev/null | while read file; do
    echo "🔧 در حال بروزرسانی: $file"
    
    # جایگزینی متن‌ها
    sed -i 's/به زودی راه‌اندازی می‌شود/پلتفرم پیشرفته شطرنج با درآمدزایی/g' "$file"
    sed -i 's/coming soon/Active Platform/g' "$file"
    sed -i 's/status.*coming_soon/status="active"/g' "$file"
    sed -i 's/coming_soon/active/g' "$file"
    
    # اضافه کردن لینک اگر وجود ندارد
    if ! grep -q "https://tetrashop-chess" "$file"; then
        sed -i '/شطرنج/a\ \ \ \ \ \ \ \ url="'"$CHESS_URL"'"' "$file"
    fi
done

echo "✅ یکپارچه‌سازی完成 شد!"
echo "🌐 لینک شطرنج: $CHESS_URL"
