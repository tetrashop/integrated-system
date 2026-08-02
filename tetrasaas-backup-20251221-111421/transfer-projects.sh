#!/bin/bash

SOURCE_DIR="/data/data/com.termux/files/home/tetrashop-github"
TARGET_DIR="/data/data/com.termux/files/home/tetrashop-vercel"

echo "🚚 انتقال پروژه‌ها از $SOURCE_DIR به $TARGET_DIR"
echo "=============================================="

# لیست پروژه‌های اصلی برای انتقال
projects=("chess" "nlp" "quantum" "secret-garden" "speech-processor" "2d-to-3d")

for project in "${projects[@]}"; do
    echo ""
    echo "📦 پروژه: $project"
    
    # بررسی وجود پروژه در منبع
    if [ -d "$SOURCE_DIR/$project" ]; then
        echo "   ✅ پوشه $project/ موجود است"
        
        # ایجاد پوشه در مقصد
        mkdir -p "$TARGET_DIR/$project"
        
        # کپی فایل‌های اصلی
        cp -r "$SOURCE_DIR/$project/"* "$TARGET_DIR/$project/" 2>/dev/null
        echo "   📋 فایل‌ها کپی شدند"
        
        # بررسی فایل index.html
        if [ -f "$TARGET_DIR/$project/index.html" ]; then
            echo "   ✅ index.html موجود است"
        else
            echo "   ⚠️ index.html یافت نشد - ایجاد فایل جایگزین"
            cat > "$TARGET_DIR/$project/index.html" << HTML
<!DOCTYPE html>
<html dir="rtl">
<head>
    <title>$project - TetraShop</title>
    <style>body{font-family:Tahoma;padding:30px;text-align:center;}</style>
</head>
<body>
    <h1>پروژه $project</h1>
    <p>محتوای اصلی به زودی منتقل می‌شود.</p>
    <a href="/">🏠 بازگشت</a>
</body>
</html>
HTML
        fi
    else
        echo "   ❌ پوشه $project/ یافت نشد"
        
        # جستجو برای فایل‌های مرتبط
        find "$SOURCE_DIR" -type f -name "*$project*" 2>/dev/null | while read file; do
            echo "   🔍 فایل مرتبط: $(basename "$file")"
        done
    fi
done

echo ""
echo "✅ انتقال پروژه‌ها کامل شد!"
echo "📁 ساختار نهایی $TARGET_DIR:"
ls -la "$TARGET_DIR"
