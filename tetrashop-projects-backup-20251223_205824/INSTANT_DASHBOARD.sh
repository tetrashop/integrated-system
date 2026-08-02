#!/bin/bash

echo "🖥️  داشبرد فوری TetraShop - وضعیت واقعی"
echo "======================================"
echo ""

# بخش ۱: وضعیت سرور و ماژول‌ها
echo "📊 ۱. وضعیت هسته سیستم:"
echo "   • مسیر پروژه: $(pwd)"
echo "   • فایل server.js: $(if [ -f "api/server.js" ]; then echo "✅ موجود"; else echo "❌ مفقود"; fi)"
echo "   • package.json: $(if [ -f "package.json" ]; then echo "✅ موجود"; else echo "❌ مفقود"; fi)"
echo "   • node_modules: $(if [ -d "node_modules" ]; then echo "✅ نصب شده"; else echo "❌ نصب نشده"; fi)"
echo ""

# بخش ۲: ماژول‌های درآمدزا
echo "💰 ۲. ماژول‌های درآمدزای شناسایی شده:"
MODULES=("payment" "premium" "store" "ads" "gateway")
for mod in "${MODULES[@]}"; do
    if [ -f "api/$mod.js" ]; then
        ENDPOINTS=$(grep -c "app\.[get|post|put|delete]" "api/$mod.js" 2>/dev/null || echo "0")
        echo "   • $mod.js: ✅ موجود ($ENDPOINTS endpoint)"
    else
        echo "   • $mod.js: ❌ مفقود"
    fi
done
echo ""

# بخش ۳: آنالیز کد server.js برای وابستگی‌ها
echo "🔍 ۳. آنالیز وابستگی‌های مورد نیاز:"
if [ -f "api/server.js" ]; then
    echo "   وابستگی‌های شناسایی شده در server.js:"
    grep -o "require('.*')" api/server.js | sed "s/require('//" | sed "s/')//" | sort -u | while read dep; do
        if [ -d "node_modules/$dep" ]; then
            echo "      • $dep: ✅ نصب شده"
        else
            echo "      • $dep: ❌ نیاز به نصب"
        fi
    done
fi
echo ""

# بخش ۴: endpointهای قابل دسترسی
echo "🌐 ۴. endpointهای شناسایی شده در کل پروژه:"
echo "   APIهای پیدا شده:"
find api/ -name "*.js" -exec grep -h "app\.[get|post|put|delete]" {} \; 2>/dev/null | head -15 | sed 's/^/      • /'
echo ""

# بخش ۵: اقدام بعدی
echo "🚀 ۵. راه‌حل فوری:"
if [ ! -d "node_modules" ]; then
    echo "   دستور: npm install"
    echo "   هدف: نصب همه وابستگی‌ها"
elif grep -q "require('compression')" api/server.js 2>/dev/null && [ ! -d "node_modules/compression" ]; then
    echo "   دستور: npm install compression"
    echo "   هدف: رفع خطای فعلی"
else
    echo "   دستور: node api/server.js"
    echo "   هدف: راه‌اندازی سرور اصلی"
fi
