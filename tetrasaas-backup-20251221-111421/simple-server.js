const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const server = http.createServer((req, res) => {
    console.log(`📥 درخواست: ${req.url}`);
    
    // مسیر فایل
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './dashboard-main.html';
    }
    
    // نوع محتوا
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
        case '.txt':
            contentType = 'text/plain';
            break;
    }
    
    // خواندن فایل
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code === 'ENOENT') {
                // فایل یافت نشد
                console.log(`❌ فایل ${filePath} یافت نشد`);
                
                // اگر فایل API درخواست شده
                if (req.url.startsWith('/api/')) {
                    handleAPI(req, res);
                } else {
                    // صفحه ۴۰۴
                    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(`
                        <html dir="rtl">
                        <head><title>404 - یافت نشد</title></head>
                        <body style="font-family: Tahoma; text-align: center; padding: 50px;">
                            <h1>۴۰۴ - صفحه مورد نظر یافت نشد</h1>
                            <p>آدرس: ${req.url}</p>
                            <p><a href="/">بازگشت به دشبورد</a></p>
                        </body>
                        </html>
                    `, 'utf-8');
                }
            } else {
                // خطای سرور
                console.error(`❌ خطای سرور: ${error.code}`);
                res.writeHead(500);
                res.end('خطای سرور: ' + error.code);
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType + '; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            });
            res.end(content, 'utf-8');
        }
    });
});

// هندلر API
function handleAPI(req, res) {
    const url = req.url;
    
    if (url === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: 23,
            uptime: process.uptime()
        }, null, 2));
    }
    else if (url === '/api/services') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            count: 23,
            services: [
                { id: 1, name: 'نویسنده کوانتومی', port: 3001, status: 'active' },
                { id: 2, name: 'نویسنده هوشمند', port: 3002, status: 'active' },
                { id: 3, name: 'باغ راز آلود', port: 3003, status: 'active' },
                { id: 4, name: 'مبدل سه‌بعدی', port: 3004, status: 'active' },
                { id: 5, name: 'تبدیل 2D به 3D', port: 3005, status: 'active' },
                { id: 6, name: 'تحلیلگر محتوا', port: 3006, status: 'active' },
                { id: 7, name: 'سامانه ضد چندپارگی', port: 3007, status: 'active' },
                { id: 8, name: 'حل کننده فرمول', port: 3008, status: 'active' },
                { id: 9, name: 'تمیز کننده کد', port: 3009, status: 'active' },
                { id: 10, name: 'گرافیکی دو بعدی', port: 3010, status: 'active' },
                { id: 11, name: 'سامانه ضد سیگار', port: 3011, status: 'active' },
                { id: 12, name: 'طراحی تلسکوپ', port: 3012, status: 'active' },
                { id: 13, name: 'سیستم تله‌پورت', port: 3013, status: 'active' },
                { id: 14, name: 'پردازشگر تصویر', port: 3014, status: 'active' },
                { id: 15, name: 'مبدل صوت', port: 3015, status: 'active' },
                { id: 16, name: 'ویرایشگر ویدیو', port: 3016, status: 'active' },
                { id: 17, name: 'رمزگذار داده', port: 3017, status: 'active' },
                { id: 18, name: 'اسکنر شبکه', port: 3018, status: 'active' },
                { id: 19, name: 'بهینه‌ساز باتری', port: 3019, status: 'active' },
                { id: 20, name: 'سازماندهی فایل', port: 3020, status: 'active' },
                { id: 21, name: 'تولیدکننده رمز', port: 3021, status: 'active' },
                { id: 22, name: 'مانیتور سیستم', port: 3022, status: 'active' },
                { id: 23, name: 'مدیر پشتیبان', port: 3023, status: 'active' }
            ]
        }, null, 2));
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            error: 'API endpoint not found',
            available: ['/api/health', '/api/services']
        }, null, 2));
    }
}

// شروع سرور
server.listen(PORT, '0.0.0.0', () => {
    console.log(`
🚀 سرور TetraSaaS Dashboard راه‌اندازی شد
========================================

🌐 آدرس‌های دسترسی:
   • محلی: http://localhost:${PORT}
   • شبکه: http://${getIPAddress()}:${PORT}

📊 وضعیت:
   • پورت: ${PORT}
   • دایرکتوری: ${__dirname}
   • زمان: ${new Date().toLocaleString('fa-IR')}

💡 دستورات:
   • Ctrl+C برای توقف
   • F5 در مرورگر برای رفرش
   • نگه داشتن Shift + F5 برای رفرش کامل

🔧 تست سلامت API:
   curl http://localhost:${PORT}/api/health
    `);
});

// تابع دریافت آدرس IP
function getIPAddress() {
    const interfaces = require('os').networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

// هندلر خروج تمیز
process.on('SIGINT', () => {
    console.log('\n\n👋 خاموش کردن سرور...');
    server.close(() => {
        console.log('✅ سرور متوقف شد');
        process.exit(0);
    });
});
