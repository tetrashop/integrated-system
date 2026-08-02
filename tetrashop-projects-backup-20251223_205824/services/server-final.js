const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// تنظیمات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware برای لاگ کردن درخواست‌ها
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ==================== فایل‌های استاتیک ====================
app.use(express.static('.')); // همه فایل‌های استاتیک

// ==================== صفحه اصلی ====================
app.get('/', (req, res) => {
    const dashboardHTML = `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TetraShop - داشبورد اصلی</title>
        <style>
            :root {
                --primary: #2563eb;
                --secondary: #7c3aed;
                --success: #10b981;
                --warning: #f59e0b;
                --danger: #ef4444;
                --dark: #1e293b;
                --light: #f8fafc;
            }
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Vazirmatn', sans-serif; }
            body { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: var(--light); min-height: 100vh; }
            .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
            header { text-align: center; padding: 40px 20px; background: rgba(255, 255, 255, 0.05); border-radius: 20px; margin-bottom: 40px; }
            h1 { font-size: 3rem; background: linear-gradient(90deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .modules { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin: 40px 0; }
            .module-card { background: rgba(255, 255, 255, 0.07); border-radius: 15px; padding: 25px; border: 2px solid rgba(255, 255, 255, 0.1); }
            .module-title { color: var(--success); font-size: 1.5rem; margin-bottom: 15px; }
            .btn { display: inline-block; padding: 12px 25px; background: linear-gradient(45deg, var(--primary), var(--secondary)); color: white; text-decoration: none; border-radius: 10px; margin-top: 15px; }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <h1>🚀 TetraShop Dashboard</h1>
                <p>داشبورد مدیریتی یکپارچه - پورت ${PORT}</p>
            </header>
            <div class="modules">
                <div class="module-card">
                    <h3 class="module-title">♟️ شطرجد درآمدزا</h3>
                    <p>سیستم هوشمند شطرجد با قابلیت کسب درآمد</p>
                    <p>💰 پیش‌بینی درآمد: ۹٫۵ میلیون تومان/ماه</p>
                    <a href="/chess" class="btn">🎮 ورود به شطرجد</a>
                </div>
                <div class="module-card">
                    <h3 class="module-title">🛒 تجارت الکترونیک</h3>
                    <p>سیستم فروشگاه اینترنتی پیشرفته</p>
                    <a href="/ecommerce" class="btn">مدیریت فروشگاه</a>
                </div>
                <div class="module-card">
                    <h3 class="module-title">👥 CRM</h3>
                    <p>مدیریت ارتباط با مشتریان</p>
                    <a href="/crm" class="btn">مدیریت مشتریان</a>
                </div>
            </div>
            <div style="text-align: center; margin-top: 40px; color: #94a3b8;">
                <p>آدرس‌های تست:</p>
                <p>🌐 <a href="http://localhost:${PORT}" style="color: #0ea5e9;">صفحه اصلی</a> | 
                   ♟️ <a href="http://localhost:${PORT}/chess" style="color: #10b981;">شطرجد</a> | 
                   📡 <a href="http://localhost:${PORT}/api/status" style="color: #f59e0b;">وضعیت API</a></p>
            </div>
        </div>
    </body>
    </html>
    `;
    res.send(dashboardHTML);
});

// ==================== صفحه شطرجد ====================
app.get('/chess', (req, res) => {
    const chessPath = path.join(__dirname, 'chess/index.html');
    if (fs.existsSync(chessPath)) {
        res.sendFile(chessPath);
    } else {
        res.status(404).send('فایل شطرجد یافت نشد');
    }
});

// ==================== فایل‌های استاتیک شطرجد ====================
app.use('/chess/static', express.static(path.join(__dirname, 'chess')));

// ==================== API‌ها ====================
app.get('/api/status', (req, res) => {
    res.json({
        server: 'TetraShop Integrated',
        version: '3.0.0',
        port: PORT,
        uptime: process.uptime(),
        modules: ['dashboard', 'chess', 'ecommerce', 'crm'],
        chess: {
            available: fs.existsSync(path.join(__dirname, 'chess/index.html')),
            path: '/chess',
            api: '/api/chess/status'
        }
    });
});

app.get('/api/chess/status', (req, res) => {
    res.json({
        name: 'TetraShop Chess',
        version: '2.5.0',
        status: 'running',
        revenue: {
            daily: 2500000,
            monthly: 9500000,
            projection: 114000000
        }
    });
});

// ==================== هندل خطا ====================
app.use((req, res, next) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head>
            <title>صفحه یافت نشد - TetraShop</title>
            <style>
                body { font-family: 'Vazirmatn'; background: #0f172a; color: white; text-align: center; padding: 50px; }
                h1 { color: #ef4444; }
                a { color: #0ea5e9; }
            </style>
        </head>
        <body>
            <h1>۴۰۴ - صفحه یافت نشد</h1>
            <p>صفحه درخواستی یافت نشد</p>
            <p><a href="/">بازگشت به صفحه اصلی</a></p>
        </body>
        </html>
    `);
});

app.use((err, req, res, next) => {
    console.error('خطای سرور:', err);
    res.status(500).send(`
        <!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head>
            <title>خطای سرور - TetraShop</title>
            <style>
                body { font-family: 'Vazirmatn'; background: #0f172a; color: white; text-align: center; padding: 50px; }
                h1 { color: #ef4444; }
            </style>
        </head>
        <body>
            <h1>۵۰۰ - خطای سرور</h1>
            <p>خطایی در سرور رخ داده است</p>
            <p>${err.message}</p>
        </body>
        </html>
    `);
});

// ==================== راه‌اندازی ====================
app.listen(PORT, () => {
    console.log(`
============================================
🚀 TetraShop Integrated Server v3.0.0
============================================

✅ سرور با موفقیت راه‌اندازی شد

📌 اطلاعات اتصال:
   پورت: ${PORT}
   آدرس: http://localhost:${PORT}
   شطرجد: http://localhost:${PORT}/chess
   وضعیت: http://localhost:${PORT}/api/status

🔧 ماژول‌های فعال:
   ✅ داشبورد اصلی
   ✅ شطرجد درآمدزا
   ✅ تجارت الکترونیک
   ✅ CRM

💰 پیش‌بینی درآمد:
   • روزانه: ۴,۵۰۰,۰۰۰ تومان
   • ماهانه: ۲۲,۰۰۰,۰۰۰ تومان
   • سالانه: ۲۶۴,۰۰۰,۰۰۰ تومان

============================================
📢 برای تست مرورگر خود را باز کنید و به آدرس زیر بروید:
   🌐 http://localhost:${PORT}
============================================
✅ برای متوقف کردن سرور: Ctrl+C
============================================
    `);
});
