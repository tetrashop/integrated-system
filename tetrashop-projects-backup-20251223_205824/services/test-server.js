const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('.'));

// صفحه اصلی
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head>
            <meta charset="UTF-8">
            <title>تست TetraShop</title>
            <style>
                body { font-family: 'Vazirmatn'; background: #0f172a; color: white; padding: 20px; }
                h1 { color: #0ea5e9; }
                .box { background: #1e293b; padding: 20px; border-radius: 10px; margin: 10px 0; }
                a { color: #0ea5e9; text-decoration: none; display: block; padding: 10px; background: rgba(14,165,233,0.1); border-radius: 5px; margin: 5px 0; }
            </style>
        </head>
        <body>
            <h1>🚀 تست سرور TetraShop</h1>
            <div class="box">
                <p>✅ سرور در حال اجرا است</p>
                <p>📌 پورت: ${PORT}</p>
                <p>🕐 زمان: ${new Date().toLocaleString('fa-IR')}</p>
            </div>
            <div class="box">
                <h3>🌐 لینک‌های تست:</h3>
                <a href="/">صفحه اصلی</a>
                <a href="/chess">شطرجد</a>
                <a href="/api/status">وضعیت API</a>
            </div>
        </body>
        </html>
    `);
});

// صفحه شطرجد
app.get('/chess', (req, res) => {
    res.sendFile(__dirname + '/chess/index.html');
});

// API وضعیت
app.get('/api/status', (req, res) => {
    res.json({
        status: 'running',
        port: PORT,
        time: new Date().toISOString()
    });
});

// راه‌اندازی
app.listen(PORT, () => {
    console.log('==========================================');
    console.log('🚀 سرور تست TetraShop');
    console.log('==========================================');
    console.log(`📌 پورت: ${PORT}`);
    console.log(`🌐 آدرس: http://localhost:${PORT}`);
    console.log(`♟️ شطرجد: http://localhost:${PORT}/chess`);
    console.log('==========================================');
    console.log('✅ برای خروج: Ctrl+C');
    console.log('==========================================');
});
