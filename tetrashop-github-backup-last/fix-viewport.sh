#!/bin/bash

echo "📱 اصلاح viewport در همه صفحات HTML..."

find . -name "*.html" -type f ! -path "./node_modules/*" ! -path "./.git/*" | while read file; do
    echo "در حال بررسی $file"
    
    # اگر viewport وجود ندارد، اضافه کن
    if ! grep -q "viewport" "$file"; then
        sed -i '/<head>/a \
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">' "$file"
        echo "  ✅ viewport اضافه شد"
    fi
    
    # اگر background-color سیاه است، تغییر بده
    sed -i 's/background-color:\s*#000000/background-color: #f8f9fa/g' "$file"
    sed -i 's/background-color:\s*black/background-color: #f8f9fa/g' "$file"
    sed -i 's/background:\s*#000000/background: #f8f9fa/g' "$file"
    sed -i 's/background:\s*black/background: #f8f9fa/g' "$file"
    
    # حذف margin و padding اضافی از body و html
    sed -i 's/<body[^>]*>/<body style="margin:0;padding:0;min-height:100vh;">/g' "$file"
    sed -i 's/<html[^>]*>/<html style="height:100%;">/g' "$file"
done

echo "✅ همه صفحات بررسی و اصلاح شدند"
