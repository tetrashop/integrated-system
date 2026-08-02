const http = require('http');

console.log('🟡 شروع اجرای سرور تست...');

const server = http.createServer((req, res) => {
    console.log('📥 درخواست دریافت شد: ' + req.url);
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head><title>تست سرور</title></head>
        <body>
            <h1>✅ سرور تست کار می‌کند!</h1>
            <p>آدرس: http://localhost:3000</p>
            <p>زمان: ${new Date().toLocaleString('fa-IR')}</p>
        </body>
        </html>
    `);
});

server.listen(3000, '0.0.0.0', () => {
    console.log('🚀 سرور تست در پورت 3000 اجرا شد');
    console.log('📱 آدرس: http://localhost:3000');
    console.log('⏰ زمان شروع: ' + new Date().toLocaleString('fa-IR'));
});

// هندلر خطا
server.on('error', (err) => {
    console.error('❌ خطای سرور:', err.message);
    console.error('🔧 جزئیات خطا:', err);
});

// هندلر سیگنال‌ها
process.on('SIGINT', () => {
    console.log('🛑 دریافت SIGINT - خروج تمیز');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('🛑 دریافت SIGTERM - خروج تمیز');
    process.exit(0);
});

console.log('🟢 اسکریپت به انتها رسید، سرور باید در حال اجرا باشد...');
