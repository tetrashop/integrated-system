#!/bin/bash

echo "🔍 بررسی پروژه‌ها..."
echo "===================="

projects=("chess" "writer" "nlp" "quantum" "gardening" "voice-recognition" "2d-to-3d")

for project in "${projects[@]}"; do
    echo -e "\n📁 بررسی $project:"
    
    # بررسی وجود پوشه
    if [ -d "$project" ]; then
        echo "✅ پوشه وجود دارد"
        
        # بررسی index.html
        if [ -f "$project/index.html" ]; then
            echo "✅ index.html وجود دارد"
            
            # بررسی محتوای index.html
            if grep -q "<!DOCTYPE html>" "$project/index.html"; then
                echo "✅ ساختار HTML صحیح است"
            else
                echo "⚠️  ممکن است مشکل در ساختار HTML باشد"
            fi
            
            # بررسی خطاهای رایج
            if grep -q "display:\s*none" "$project/index.html"; then
                echo "⚠️  ممکن است display:none مشکل ایجاد کند"
            fi
            
            if grep -q "background:\s*black\|background:\s*#000\|background:\s*#000000" "$project/index.html"; then
                echo "⚠️  پس‌زمینه سیاه پیدا شد"
            fi
            
        else
            echo "❌ index.html وجود ندارد"
            
            # پیدا کردن فایل‌های HTML دیگر
            html_files=$(find "$project" -name "*.html" -type f)
            if [ -n "$html_files" ]; then
                echo "📄 فایل‌های HTML پیدا شد:"
                echo "$html_files"
                
                # ایجاد index.html اگر وجود ندارد
                first_html=$(echo "$html_files" | head -1)
                echo "🔗 ایجاد لینک از $first_html به index.html"
                ln -sf "$first_html" "$project/index.html"
            else
                echo "❌ هیچ فایل HTML یافت نشد"
            fi
        fi
    else
        echo "❌ پوشه $project وجود ندارد"
    fi
done

echo -e "\n✅ بررسی کامل شد"
