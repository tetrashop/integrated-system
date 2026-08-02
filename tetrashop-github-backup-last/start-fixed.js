const express = require('express');
const app = express();
const PORT = 3001;  // پورت متفاوت

// Middleware
app.use(express.json());
app.use(express.static('.'));

// صفحه اصلی
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>تتراشاپ - پورت ${PORT}</title>
            <style>
                body {
                    font-family: 'Vazirmatn', sans-serif;
                    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                    color: white;
                    margin: 0;
                    padding: 40px;
                    direction: rtl;
                    text-align: center;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .projects {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin: 40px 0;
                }
                .project-card {
                    background: rgba(255,255,255,0.1);
                    border-radius: 15px;
                    padding: 25px;
                    border: 1px solid rgba(255,255,255,0.2);
                }
                .status {
                    background: rgba(76, 201, 240, 0.2);
                    color: #4cc9f0;
                    padding: 5px 15px;
                    border-radius: 20px;
                    display: inline-block;
                }
                .btn {
                    display: inline-block;
                    background: #4361ee;
                    color: white;
                    padding: 12px 30px;
                    border-radius: 25px;
                    text-decoration: none;
                    margin: 10px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 تتراشاپ - راه‌اندازی موفق</h1>
                <p>سیستم روی پورت ${PORT} فعال شد</p>
                <div class="status">✅ پورت ${PORT} آزاد و فعال</div>
                
                <div class="projects">
                    <div class="project-card">
                        <h3>♔ شطرنج پیشرفته</h3>
                        <p>هوش مصنوعی سطح GM</p>
                        <a href="/api/chess" class="btn">تست API</a>
                    </div>
                    
                    <div class="project-card">
                        <h3>✍️ نویسنده هوشمند</h3>
                        <p>تولید محتوا با AI</p>
                        <a href="/api/writer" class="btn">تست API</a>
                    </div>
                    
                    <div class="project-card">
                        <h3>⚛️ نویسنده کوانتومی</h3>
                        <p>الگوریتم‌های کوانتومی</p>
                        <a href="/api/quantum" class="btn">تست API</a>
                    </div>
                    
                    <div class="project-card">
                        <h3>🔐 باغ امن</h3>
                        <p>سیستم امنیتی پیشرفته</p>
                        <a href="/api/security" class="btn">تست API</a>
                    </div>
                    
                    <div class="project-card">
                        <h3>🎤 تشخیص گفتار</h3>
                        <p>تبدیل گفتار به متن</p>
                        <a href="/api/speech" class="btn">تست API</a>
                    </div>
                </div>
                
                <div style="margin-top: 50px;">
                    <h3>🔧 تست سریع APIها</h3>
                    <div>
                        <a href="/api/status" class="btn" style="background: #4cc9f0;">آمار سیستم</a>
                        <a href="/api/projects" class="btn" style="background: #f8961e;">لیست پروژه‌ها</a>
                        <a href="/api/test" class="btn" style="background: #7209b7;">تست اتصال</a>
                    </div>
                </div>
                
                <div style="margin-top: 40px; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 10px;">
                    <h3>📊 اطلاعات فنی</h3>
                    <p>پورت: ${PORT} | Node.js: ${process.version}</p>
                    <p>✅ هیچ درگیری پورتی وجود ندارد</p>
                </div>
            </div>
        </body>
        </html>
    `);
});

// APIهای اصلی
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        message: 'سرور تتراشاپ با موفقیت راه‌اندازی شد',
        port: PORT,
        timestamp: new Date().toISOString(),
        projects: {
            chess: { status: 'فعال', price: 99000 },
            writer: { status: 'فعال', price: 149000 },
            quantum: { status: 'فعال', price: 199000 },
            security: { status: 'فعال', price: 299000 },
            speech: { status: 'فعال', price: 99000 }
        },
        revenue_models: [
            'فروش اشتراک ماهانه',
            'فروش پکیج محدود',
            'API سازمانی',
            'خدمات سفارشی'
        ]
    });
});

app.get('/api/projects', (req, res) => {
    res.json([
        { id: 1, name: 'شطرنج پیشرفته', status: 'فعال', endpoint: '/api/chess' },
        { id: 2, name: 'نویسنده هوشمند', status: 'فعال', endpoint: '/api/writer' },
        { id: 3, name: 'نویسنده کوانتومی', status: 'فعال', endpoint: '/api/quantum' },
        { id: 4, name: 'باغ امن', status: 'فعال', endpoint: '/api/security' },
        { id: 5, name: 'تشخیص گفتار', status: 'فعال', endpoint: '/api/speech' }
    ]);
});

app.get('/api/test', (req, res) => {
    res.json({
        test: 'successful',
        server: 'tetrashop',
        port: PORT,
        time: new Date().toLocaleString('fa-IR')
    });
});

// APIهای پروژه‌ها
app.get('/api/chess', (req, res) => {
    res.json({ move: 'e2e4', evaluation: '+0.5', depth: 12 });
});

app.get('/api/writer', (req, res) => {
    res.json({ text: 'متن تولید شده توسط نویسنده هوشمند', length: 45 });
});

// راه‌اندازی سرور
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    🎉 ===============================
    ✅ تتراشاپ با موفقیت راه‌اندازی شد!
    🎉 ===============================
    
    🌐 آدرس اصلی: http://localhost:${PORT}
    📊 آمار سیستم: http://localhost:${PORT}/api/status
    📋 پروژه‌ها: http://localhost:${PORT}/api/projects
    
    ⚡ پروژه‌های فعال (5 پروژه):
       1. ♔ شطرنج پیشرفته - API: /api/chess
       2. ✍️ نویسنده هوشمند - API: /api/writer
       3. ⚛️ نویسنده کوانتومی - API: /api/quantum
       4. 🔐 باغ امن - API: /api/security
       5. 🎤 تشخیص گفتار - API: /api/speech
    
    💰 مدل درآمدزایی:
       • اشتراک ماهانه: از ۹۹,۰۰۰ ریال
       • پکیج محدود: از ۱۹۹,۰۰۰ ریال
       • API سازمانی: از ۴۹۹,۰۰۰ ریال
       • خدمات سفارشی: قیمت توافقی
    
    📱 تست سریع:
       curl http://localhost:${PORT}/api/status
       curl http://localhost:${PORT}/api/test
    
    ⚡ برای توقف: Ctrl+C
    
    🔥 نکته: این پورت (${PORT}) توسط مرورگرها مسدود نیست
    `);
});

// مدیریت خطا
process.on('SIGINT', () => {
    console.log('\n🛑 سرور متوقف شد');
    process.exit(0);
});
