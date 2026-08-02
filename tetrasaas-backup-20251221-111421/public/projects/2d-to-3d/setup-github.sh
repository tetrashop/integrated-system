#!/bin/bash
echo "🎯 راه‌اندازی کامل تتراشاپ برای گیت‌هاب"
echo "========================================"

# 1. بررسی گیت
if [ ! -d .git ]; then
    echo "🔄 مقداردهی اولیه گیت..."
    git init
    git checkout -b main
else
    echo "✅ گیت قبلاً مقداردهی شده"
fi

# 2. اضافه کردن فایل‌ها
echo "📁 اضافه کردن فایل‌ها به گیت..."
git add .

# 3. کامیت
echo "💾 ایجاد کامیت..."
git commit -m "🚀 Tetrashop v3.0.0 - Complete Platform

- 5 AI Projects: Chess, Writer, Quantum, Security, Speech
- Full Persian RTL Interface
- Revenue Models & Marketplace
- Auto-deployment ready
- Docker & CI/CD configured"

# 4. تنظیم ریموت
if ! git remote | grep -q origin; then
    echo "🌐 لطفاً آدرس ریموت گیت‌هاب را وارد کنید:"
    echo "   (مثال: https://github.com/username/tetrashop-projects.git)"
    read -p "آدرس ریموت: " remote_url
    
    if [ -n "$remote_url" ]; then
        git remote add origin "$remote_url"
        echo "✅ ریموت اضافه شد: $remote_url"
    else
        echo "⚠️ هیچ آدرسی وارد نشد. ریموت تنظیم نشد."
    fi
else
    echo "✅ ریموت از قبل تنظیم شده"
    git remote -v
fi

# 5. پوش به گیت‌هاب
echo "🚀 پوش به گیت‌هاب..."
if git remote | grep -q origin; then
    echo "آیا می‌خواهید به گیت‌هاب پوش کنید؟ (y/n)"
    read -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push -u origin main
        echo "✅ پروژه به گیت‌هاب پوش شد!"
        
        # نمایش اطلاعات
        echo ""
        echo "🎉 ================================="
        echo "✅ تتراشاپ آماده دیپلوی است!"
        echo ""
        echo "📊 مراحل بعدی:"
        echo "   1. به Railway.app بروید"
        echo "   2. New Project → Deploy from GitHub"
        echo "   3. ریپوی tetrashop-projects را انتخاب کنید"
        echo "   4. Deploy را بزنید"
        echo ""
        echo "🌐 یا از دکمه‌های زیر استفاده کنید:"
        echo "   [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/yourusername/tetrashop-projects)"
        echo "   [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)"
        echo ""
        echo "💰 برای شروع درآمدزایی:"
        echo "   • اشتراک‌های ماهانه را فعال کنید"
        echo "   • درگاه پرداخت اضافه کنید"
        echo "   • تبلیغات شروع کنید"
        echo "🎉 ================================="
    fi
else
    echo "⚠️ ریموت تنظیم نشده. نمی‌توان پوش کرد."
fi

# 6. نمایش اطلاعات فنی
echo ""
echo "🔧 اطلاعات فنی:"
echo "   Node.js: $(node --version)"
echo "   npm: $(npm --version)"
echo "   پروژه‌ها: 5 کامل"
echo "   خطوط کد: ~$(find . -name "*.js" -o -name "*.html" -o -name "*.css" | xargs wc -l | tail -1 | awk '{print $1}') خط"
echo "   اندازه: $(du -sh . | cut -f1)"
