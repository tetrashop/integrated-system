#!/bin/bash
echo "🧪 تست یکپارچگی TetraShop"
echo "========================="

echo "1. بررسی پوشه‌ها..."
ls -la

echo ""
echo "2. بررسی public..."
ls -la public/

echo ""
echo "3. بررسی public/projects..."
ls -la public/projects/

echo ""
echo "4. بررسی projects..."
ls -la projects/

echo ""
echo "5. تست دسترسی به پروژه‌ها..."
echo "انتظار برای راه‌اندازی سرور..."
sleep 2

# تست ساده
for project in quantum-writer ai-writer secret-garden; do
    if [ -f "public/projects/$project/index.html" ]; then
        echo "✅ $project: فایل وجود دارد"
    else
        echo "❌ $project: فایل وجود ندارد"
    fi
done

echo ""
echo "📋 دستور نهایی برای اجرا:"
echo "   ./manage-tetra.sh start"
echo ""
echo "🌐 سپس در مرورگر: http://localhost:8080/public/"
