const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// صفحه اصلی ساده
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>تتراشاپ - پلتفرم هوش مصنوعی</title>
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
                    transition: transform 0.3s;
                }
                .project-card:hover {
                    transform: translateY(-10px);
                    background: rgba(255,255,255,0.15);
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
                .status {
                    background: rgba(76, 201, 240, 0.2);
                    color: #4cc9f0;
                    padding: 5px 15px;
                    border-radius: 20px;
                    display: inline-block;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 تتراشاپ - پلتفرم هوش مصنوعی</h1>
                <p>۵ پروژه پیشرفته برای بهره‌وری و درآمدزایی</p>
                <div class="status">پورت ${PORT} فعال</div>
                
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
                    <h3>🔧 APIهای فعال</h3>
                    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin: 20px 0;">
                        <a href="/api/status" class="btn" style="background: #4cc9f0;">آمار سیستم</a>
                        <a href="/api/projects" class="btn" style="background: #f8961e;">لیست پروژه‌ها</a>
                        <a href="/api/marketplace" class="btn" style="background: #7209b7;">فروشگاه</a>
                        <a href="/api/analytics" class="btn" style="background: #f72585;">آمار کلی</a>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
});

// APIهای ساده
app.get('/api/status', (req, res) => {
    res.json({
        status: 'فعال',
        port: PORT,
        projects: 5,
        active: true,
        message: 'سیستم تتراشاپ با موفقیت راه‌اندازی شد'
    });
});

app.get('/api/projects', (req, res) => {
    res.json([
        { id: 1, name: 'شطرنج پیشرفته', type: 'chess', status: 'فعال' },
        { id: 2, name: 'نویسنده هوشمند', type: 'writer', status: 'فعال' },
        { id: 3, name: 'نویسنده کوانتومی', type: 'quantum', status: 'فعال' },
        { id: 4, name: 'باغ امن', type: 'security', status: 'فعال' },
        { id: 5, name: 'تشخیص گفتار', type: 'speech', status: 'فعال' }
    ]);
});

app.get('/api/chess', (req, res) => {
    res.json({
        move: 'e2e4',
        evaluation: '+0.5',
        depth: 12,
        message: 'حرکت هوش مصنوعی شطرنج'
    });
});

app.get('/api/writer', (req, res) => {
    res.json({
        text: 'این یک متن نمونه تولید شده توسط نویسنده هوشمند است.',
        length: 50,
        style: 'formal',
        success: true
    });
});

app.get('/api/marketplace', (req, res) => {
    res.json({
        products: [
            { name: 'اشتراک شطرنج', price: 99000, currency: 'IRR' },
            { name: 'پکیج نویسنده', price: 199000, currency: 'IRR' },
            { name: 'API سازمانی', price: 499000, currency: 'IRR' }
        ]
    });
});

// راه‌اندازی سرور
app.listen(PORT, () => {
    console.log(`
    🚀 سرور تتراشاپ با موفقیت راه‌اندازی شد!
    
    🌐 آدرس‌های مهم:
       📍 صفحه اصلی: http://localhost:${PORT}
       📊 آمار سیستم: http://localhost:${PORT}/api/status
       📋 لیست پروژه‌ها: http://localhost:${PORT}/api/projects
       💰 فروشگاه: http://localhost:${PORT}/api/marketplace
    
    ⚡ پروژه‌های فعال:
       1. ♔ شطرنج پیشرفته
       2. ✍️ نویسنده هوشمند  
       3. ⚛️ نویسنده کوانتومی
       4. 🔐 باغ امن
       5. 🎤 تشخیص گفتار
    
    💰 برای درآمدزایی:
       • فروش اشتراک ماهانه
       • فروش پکیج‌های محدود
       • ارائه API سازمانی
    
    ⚡ برای توقف: Ctrl+C
    `);
});
