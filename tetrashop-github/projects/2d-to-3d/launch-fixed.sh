#!/bin/bash
echo "🚀 راه‌اندازی بهبود یافته سیستم Tetrashop"

cd ~/tetrashop-consolidated/organized-projects

# توقف سرویس‌های قبلی
echo "🧹 توقف سرورهای قبلی..."
pkill -f "python3" 2>/dev/null
pkill -f "node" 2>/dev/null
sleep 3

# راه‌اندازی سرویس‌ها
echo "🔧 راه‌اندازی سرویس‌ها..."

# 1. پنل مدیریت رمزارز (مطمئن)
cd payment-systems
echo "💰 پنل مدیریت رمزارز: http://localhost:3001/crypto-management.html"
python3 -m http.server 3001 &
cd ..

# 2. 3D Conversion با دایرکتوری صحیح
cd 3d-conversion
echo "🎯 3D Conversion: http://localhost:3000"
python3 -m http.server 3000 &
cd ..

# 3. اپ‌های وب با فایل index.html تضمینی
cd web-apps
echo "🌐 اپ‌های وب: http://localhost:3003"
python3 -m http.server 3003 &
cd ..

sleep 5

# نمایش وضعیت نهایی
echo ""
echo "=================================================="
echo "🎯 سیستم Tetrashop راه‌اندازی شد"
echo "=================================================="
echo "💰 پنل مدیریت رمزارز: http://localhost:3001/crypto-management.html"
echo "🎯 تبدیل 3D: http://localhost:3000"
echo "🌐 اپ‌های وب: http://localhost:3003"
echo "=================================================="
echo ""
echo "📱 دسترسی از مرورگر:"
echo "   - مدیریت رمزارز: http://localhost:3001/crypto-management.html"
echo "   - تبدیل 3D: http://localhost:3000"
echo "   - فروشگاه: http://localhost:3003"
