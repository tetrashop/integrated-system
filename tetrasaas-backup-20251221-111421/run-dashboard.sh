#!/bin/bash

echo "🚀 راه‌اندازی دشبورد TetraSaaS"
echo "================================"

# بررسی پورت‌ها
echo "🔍 بررسی سرویس‌های فعال..."
active_services=0
for port in {3001..3023}; do
    if curl -s "http://localhost:$port/health" --connect-timeout 2 &>/dev/null; then
        echo "✅ پورت $port: فعال"
        ((active_services++))
    else
        echo "❌ پورت $port: غیرفعال"
    fi
done

echo ""
echo "📊 آمار: $active_services/23 سرویس فعال"

# ایجاد فایل پیکربندی
cat > dashboard-config.json << 'CONFIG_EOF'
{
    "dashboard": {
        "title": "پلتفرم TetraSaaS",
        "version": "1.0.0",
        "description": "دشبورد مدیریت ۲۳ سرویس ابری",
        "author": "TetraShop Team",
        "created_at": "$(date -Iseconds)"
    },
    "services": [
        {
            "id": 1,
            "name": "نویسنده کوانتومی",
            "port": 3001,
            "category": "ai",
            "status": "active",
            "interface_file": "quantum-writer-ui.html"
        },
        {
            "id": 2,
            "name": "نویسنده هوشمند",
            "port": 3002,
            "category": "ai",
            "status": "active",
            "interface_file": "ai-writer-ui.html"
        },
        {
            "id": 3,
            "name": "باغ راز آلود",
            "port": 3003,
            "category": "security",
            "status": "active",
            "interface_file": "secret-garden-ui.html"
        },
        {
            "id": 4,
            "name": "مبدل سه‌بعدی",
            "port": 3004,
            "category": "tools",
            "status": "active",
            "interface_file": "3d-converter-ui.html"
        },
        {
            "id": 5,
            "name": "تبدیل 2D به 3D",
            "port": 3005,
            "category": "ai",
            "status": "active",
            "interface_file": "2d-to-3d-ui.html"
        },
        {
            "id": 6,
            "name": "تحلیلگر محتوا",
            "port": 3006,
            "category": "ai",
            "status": "active",
            "interface_file": "content-analyzer-ui.html"
        },
        {
            "id": 7,
            "name": "سامانه ضد چندپارگی",
            "port": 3007,
            "category": "system",
            "status": "active",
            "interface_file": "anti-fragmentation-ui.html"
        },
        {
            "id": 8,
            "name": "حل کننده فرمول",
            "port": 3008,
            "category": "tools",
            "status": "active",
            "interface_file": "formula-solver-ui.html"
        },
        {
            "id": 9,
            "name": "تمیز کننده کد",
            "port": 3009,
            "category": "dev",
            "status": "active",
            "interface_file": "code-cleaner-ui.html"
        },
        {
            "id": 10,
            "name": "گرافیکی دو بعدی",
            "port": 3010,
            "category": "tools",
            "status": "active",
            "interface_file": "graphic-2d-ui.html"
        },
        {
            "id": 11,
            "name": "سامانه ضد سیگار",
            "port": 3011,
            "category": "system",
            "status": "active",
            "interface_file": "anti-smoke-ui.html"
        },
        {
            "id": 12,
            "name": "طراحی تلسکوپ",
            "port": 3012,
            "category": "science",
            "status": "active",
            "interface_file": "telescope-design-ui.html"
        },
        {
            "id": 13,
            "name": "سیستم تله‌پورت",
            "port": 3013,
            "category": "network",
            "status": "active",
            "interface_file": "teleport-system-ui.html"
        },
        {
            "id": 14,
            "name": "پردازشگر تصویر",
            "port": 3014,
            "category": "ai",
            "status": "active",
            "interface_file": "image-processor-ui.html"
        },
        {
            "id": 15,
            "name": "مبدل صوت",
            "port": 3015,
            "category": "tools",
            "status": "active",
            "interface_file": "audio-converter-ui.html"
        },
        {
            "id": 16,
            "name": "ویرایشگر ویدیو",
            "port": 3016,
            "category": "tools",
            "status": "active",
            "interface_file": "video-editor-ui.html"
        },
        {
            "id": 17,
            "name": "رمزگذار داده",
            "port": 3017,
            "category": "security",
            "status": "active",
            "interface_file": "data-encryptor-ui.html"
        },
        {
            "id": 18,
            "name": "اسکنر شبکه",
            "port": 3018,
            "category": "network",
            "status": "active",
            "interface_file": "network-scanner-ui.html"
        },
        {
            "id": 19,
            "name": "بهینه‌ساز باتری",
            "port": 3019,
            "category": "system",
            "status": "active",
            "interface_file": "battery-optimizer-ui.html"
        },
        {
            "id": 20,
            "name": "سازماندهی فایل",
            "port": 3020,
            "category": "tools",
            "status": "active",
            "interface_file": "file-organizer-ui.html"
        },
        {
            "id": 21,
            "name": "تولیدکننده رمز",
            "port": 3021,
            "category": "security",
            "status": "active",
            "interface_file": "password-generator-ui.html"
        },
        {
            "id": 22,
            "name": "مانیتور سیستم",
            "port": 3022,
            "category": "system",
            "status": "active",
            "interface_file": "system-monitor-ui.html"
        },
        {
            "id": 23,
            "name": "مدیر پشتیبان",
            "port": 3023,
            "category": "system",
            "status": "active",
            "interface_file": "backup-manager-ui.html"
        }
    ],
    "settings": {
        "theme": "dark",
        "language": "persian",
        "auto_refresh": true,
        "notification": true,
        "analytics": true
    }
}
CONFIG_EOF

echo "✅ پیکربندی ایجاد شد"

# ایجاد سرور ساده برای سرو کردن دشبورد
cat > simple-server.js << 'SERVER_EOF'
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const DASHBOARD_FILE = 'dashboard-main.html';

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './' + DASHBOARD_FILE;
    }
    
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.ico':
            contentType = 'image/x-icon';
            break;
    }
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                // فایل یافت نشد
                res.writeHead(404);
                res.end('فایل یافت نشد');
            } else {
                // خطای سرور
                res.writeHead(500);
                res.end('خطای سرور: ' + error.code);
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 دشبورد TetraSaaS روی پورت ${PORT} اجرا شد`);
    console.log(`🌐 آدرس: http://localhost:${PORT}`);
    console.log(`📱 برای دسترسی از دستگاه دیگر: http://[آی‌پی دستگاه]:${PORT}`);
    console.log(`\n💡 دستورات:`);
    console.log(`  Ctrl+C برای توقف`);
    console.log(`  F5 برای رفرش صفحه`);
});
SERVER_EOF

echo ""
echo "🎯 دشبورد آماده است!"
echo ""
echo "🔧 گزینه‌های اجرا:"
echo "1. اجرای مستقیم دشبورد:"
echo "   - مرورگر را باز کنید"
echo "   - آدرس زیر را وارد کنید:"
echo "     file://$(pwd)/dashboard-main.html"
echo ""
echo "2. اجرا با سرور محلی:"
echo "   node simple-server.js"
echo ""
echo "📁 ساختار ایجاد شده:"
echo "  dashboard-main.html         (دشبورد اصلی)"
echo "  service-interfaces/         (واسط‌های ۲۳ سرویس)"
echo "  service-loader.js           (لودر واسط‌ها)"
echo "  dashboard-config.json       (پیکربندی)"
echo "  simple-server.js            (سرور تست)"
echo "  run-dashboard.sh           (اسکریپت اجرا)"
echo ""
echo "🚀 برای شروع کار:"
echo "  1. مرورگر باز کنید"
echo "  2. آدرس زیر را وارد کنید:"
echo "     file://$(pwd)/dashboard-main.html"
echo ""
echo "🎨 ویژگی‌های دشبورد:"
echo "  - ۲۳ کارت سرویس با طراحی زیبا"
echo "  - واسط کاربری برای هر سرویس"
echo "  - عدم نمایش کد اصلی"
echo "  - سیستم کش واسط‌ها"
echo "  - پشتیبانی از زبان فارسی"
echo "  - طراحی ریسپانسیو"
