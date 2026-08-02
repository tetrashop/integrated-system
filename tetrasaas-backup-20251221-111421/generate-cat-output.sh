#!/bin/bash
echo "🐱 تولید کدهای آماده cat برای الگوریتم‌ها"
echo "========================================"

cd ~/tetrashop-projects

# ایجاد فایل خروجی برای cat
cat > ui/cat-output.txt << 'CATEOF'
# 🐱 دستورات cat برای کپی سریع الگوریتم‌های تتراشاپ
# ⏰ تاریخ تولید: $(date '+%Y-%m-%d %H:%M:%S')
# 📊 تعداد الگوریتم‌ها: 119 فایل
# 📁 فقط کافی است هر بخش را کپی و در ترمینال پیست کنید

echo "🚀 شروع کپی الگوریتم‌های تتراشاپ..."

CATEOF

# اضافه کردن الگوریتم‌های JavaScript
echo "# 📜 JavaScript Algorithms (71 فایل)" >> ui/cat-output.txt
find algorithms/js -name "*.js" | while read file; do
    filename=$(basename "$file")
    echo "" >> ui/cat-output.txt
    echo "# =========================================" >> ui/cat-output.txt
    echo "# فایل: $filename" >> ui/cat-output.txt
    echo "# مسیر: algorithms/js/$filename" >> ui/cat-output.txt
    echo "# =========================================" >> ui/cat-output.txt
    echo "cat > algorithms/js/$filename << 'JS_EOF'" >> ui/cat-output.txt
    cat "$file" >> ui/cat-output.txt
    echo "JS_EOF" >> ui/cat-output.txt
    echo "echo '✅ $filename کپی شد'" >> ui/cat-output.txt
done

# اضافه کردن الگوریتم‌های Python
echo "" >> ui/cat-output.txt
echo "# 🐍 Python Algorithms (39 فایل)" >> ui/cat-output.txt
find algorithms/python -name "*.py" | while read file; do
    filename=$(basename "$file")
    echo "" >> ui/cat-output.txt
    echo "# =========================================" >> ui/cat-output.txt
    echo "# فایل: $filename" >> ui/cat-output.txt
    echo "# مسیر: algorithms/python/$filename" >> ui/cat-output.txt
    echo "# =========================================" >> ui/cat-output.txt
    echo "cat > algorithms/python/$filename << 'PY_EOF'" >> ui/cat-output.txt
    cat "$file" >> ui/cat-output.txt
    echo "PY_EOF" >> ui/cat-output.txt
    echo "echo '✅ $filename کپی شد'" >> ui/cat-output.txt
done

# اضافه کردن الگوریتم‌های C++
echo "" >> ui/cat-output.txt
echo "# ⚙️ C++ Algorithms (1 فایل)" >> ui/cat-output.txt
find algorithms/cpp -name "*.cpp" -o -name "*.hpp" -o -name "*.h" | while read file; do
    filename=$(basename "$file")
    echo "" >> ui/cat-output.txt
    echo "# =========================================" >> ui/cat-output.txt
    echo "# فایل: $filename" >> ui/cat-output.txt
    echo "# مسیر: algorithms/cpp/$filename" >> ui/cat-output.txt
    echo "# =========================================" >> ui/cat-output.txt
    echo "cat > algorithms/cpp/$filename << 'CPP_EOF'" >> ui/cat-output.txt
    cat "$file" >> ui/cat-output.txt
    echo "CPP_EOF" >> ui/cat-output.txt
    echo "echo '✅ $filename کپی شد'" >> ui/cat-output.txt
done

# اضافه کردن مستندات
echo "" >> ui/cat-output.txt
echo "# 📄 مستندات (8 فایل)" >> ui/cat-output.txt
find algorithms/docs -name "*.md" | while read file; do
    filename=$(basename "$file")
    echo "" >> ui/cat-output.txt
    echo "# =========================================" >> ui/cat-output.txt
    echo "# فایل: $filename" >> ui/cat-output.txt
    echo "# مسیر: algorithms/docs/$filename" >> ui/cat-output.txt
    echo "# =========================================" >> ui/cat-output.txt
    echo "cat > algorithms/docs/$filename << 'DOC_EOF'" >> ui/cat-output.txt
    cat "$file" >> ui/cat-output.txt
    echo "DOC_EOF" >> ui/cat-output.txt
    echo "echo '✅ $filename کپی شد'" >> ui/cat-output.txt
done

echo "" >> ui/cat-output.txt
echo "# 🎉 کپی الگوریتم‌ها کامل شد!" >> ui/cat-output.txt
echo "echo '✅ تمام الگوریتم‌ها با موفقیت کپی شدند'" >> ui/cat-output.txt
echo "echo '📊 تعداد فایل‌ها: 119'" >> ui/cat-output.txt
echo "echo '📁 ساختار ایجاد شده: algorithms/{js,python,cpp,docs}/'" >> ui/cat-output.txt

echo "✅ فایل خروجی ایجاد شد: ui/cat-output.txt"
echo "📊 حجم فایل: $(wc -l < ui/cat-output.txt) خط"
echo ""
echo "🐱 برای استفاده:"
echo "   cat ui/cat-output.txt | pbcopy    # روی Mac"
echo "   cat ui/cat-output.txt | xclip     # روی Linux"
echo "   یا مستقیماً کپی/پیست کنید"
