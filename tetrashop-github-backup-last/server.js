const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// سرو فایل‌های استاتیک از هر پوشه پروژه
app.use('/chess', express.static(path.join(__dirname, 'chess')));
app.use('/writer', express.static(path.join(__dirname, 'writer')));
app.use('/quantum', express.static(path.join(__dirname, 'quantum')));
app.use('/secret-garden', express.static(path.join(__dirname, 'secret-garden')));
app.use('/speech', express.static(path.join(__dirname, 'speech-recognition')));

// روت‌های اصلی برای دسترسی به هر پروژه
app.get('/chess', (req, res) => {
    res.sendFile(path.join(__dirname, 'chess', 'index.html'));
});

app.get('/writer', (req, res) => {
    res.sendFile(path.join(__dirname, 'writer', 'index.html'));
});

app.get('/quantum', (req, res) => {
    res.sendFile(path.join(__dirname, 'quantum', 'index.html'));
});

app.get('/secret-garden', (req, res) => {
    res.sendFile(path.join(__dirname, 'secret-garden', 'index.html'));
});

app.get('/speech', (req, res) => {
    res.sendFile(path.join(__dirname, 'speech-recognition', 'index.html'));
});

// صفحه اصلی
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>تتراشاپ - پلتفرم ۵ پروژه هوش مصنوعی</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vazirmatn/monospace@latest/font-face.css">
            <style>
                * {
                    font-family: 'Vazirmatn', sans-serif;
                }
                
                body {
                    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                    color: white;
                    margin: 0;
                    padding: 0;
                    min-height: 100vh;
                }
                
                .container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }
                
                .header {
                    text-align: center;
                    padding: 50px 20px;
                    background: rgba(0,0,0,0.3);
                    border-radius: 20px;
                    margin-bottom: 50px;
                    border: 3px solid #4361ee;
                }
                
                .projects-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 30px;
                    margin: 40px 0;
                }
                
                .project-card {
                    background: rgba(255,255,255,0.05);
                    border-radius: 20px;
                    padding: 30px;
                    text-align: center;
                    border: 2px solid;
                    transition: all 0.3s;
                    position: relative;
                    overflow: hidden;
                    min-height: 300px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                
                .project-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                }
                
                .project-card h3 {
                    font-size: 1.8em;
                    margin-bottom: 15px;
                }
                
                .project-card p {
                    color: #aaa;
                    line-height: 1.6;
                    flex-grow: 1;
                }
                
                .btn {
                    display: inline-block;
                    background: linear-gradient(45deg, #4361ee, #3a0ca3);
                    color: white;
                    padding: 15px 35px;
                    border-radius: 30px;
                    text-decoration: none;
                    font-weight: bold;
                    margin-top: 20px;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(67, 97, 238, 0.4);
                }
                
                .project-card:nth-child(1) { border-color: #4cc9f0; }
                .project-card:nth-child(2) { border-color: #7209b7; }
                .project-card:nth-child(3) { border-color: #f72585; }
                .project-card:nth-child(4) { border-color: #00ff88; }
                .project-card:nth-child(5) { border-color: #ff9e00; }
                
                .stats {
                    display: flex;
                    justify-content: center;
                    gap: 40px;
                    margin: 50px 0;
                    flex-wrap: wrap;
                }
                
                .stat-item {
                    text-align: center;
                    padding: 25px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 15px;
                    min-width: 200px;
                }
                
                .stat-value {
                    font-size: 3em;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                
                .pricing {
                    text-align: center;
                    padding: 50px;
                    background: linear-gradient(45deg, #f8961e, #f3722c);
                    border-radius: 20px;
                    margin-top: 50px;
                }
                
                .api-info {
                    background: rgba(0,0,0,0.3);
                    padding: 30px;
                    border-radius: 15px;
                    margin-top: 40px;
                }
                
                .code-block {
                    background: #1a1a2e;
                    padding: 20px;
                    border-radius: 10px;
                    font-family: monospace;
                    text-align: left;
                    direction: ltr;
                    overflow-x: auto;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="font-size: 3em; margin-bottom: 20px;">🚀 تتراشاپ</h1>
                    <p style="font-size: 1.3em; color: #4cc9f0; margin-bottom: 30px;">
                        پلتفرم ۵ پروژه هوش مصنوعی برای بهره‌وری و درآمدزایی
                    </p>
                    <div style="font-size: 1.2em; color: #00ff88; background: rgba(0,255,136,0.1); 
                                padding: 15px 30px; border-radius: 25px; display: inline-block;">
                        پورت: ${PORT} | وضعیت: فعال ✅
                    </div>
                </div>
                
                <div class="stats">
                    <div class="stat-item">
                        <div class="stat-value" style="color: #4cc9f0;">۵</div>
                        <p>پروژه فعال</p>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" style="color: #7209b7;">۹۹%</div>
                        <p>رضایت کاربران</p>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" style="color: #00ff88;">۲۴/۷</div>
                        <p>پشتیبانی</p>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" style="color: #ff9e00;">۵۰۰+</div>
                        <p>کاربر فعال</p>
                    </div>
                </div>
                
                <div class="projects-grid">
                    <div class="project-card">
                        <h3>♔ شطرنج پیشرفته</h3>
                        <p>هوش مصنوعی سطح گرندمستر با قابلیت بازی آنلاین</p>
                        <p style="color: #4cc9f0; font-weight: bold;">قیمت: ۹۹,۰۰۰ ریال/ماه</p>
                        <a href="/chess" class="btn">ورود به شطرنج</a>
                    </div>
                    
                    <div class="project-card">
                        <h3>✍️ نویسنده هوشمند</h3>
                        <p>تولید محتوای حرفه‌ای با هوش مصنوعی</p>
                        <p style="color: #7209b7; font-weight: bold;">قیمت: ۱۴۹,۰۰۰ ریال/ماه</p>
                        <a href="/writer" class="btn">ورود به نویسنده</a>
                    </div>
                    
                    <div class="project-card">
                        <h3>⚛️ نویسنده کوانتومی</h3>
                        <p>الگوریتم‌های کوانتومی برای تولید محتوای فوق‌هوشمند</p>
                        <p style="color: #f72585; font-weight: bold;">قیمت: ۱۹۹,۰۰۰ ریال/ماه</p>
                        <a href="/quantum" class="btn">ورود به کوانتومی</a>
                    </div>
                    
                    <div class="project-card">
                        <h3>🔐 باغ امن</h3>
                        <p>سیستم امنیتی پیشرفته با رمزنگاری کوانتومی</p>
                        <p style="color: #00ff88; font-weight: bold;">قیمت: ۲۹۹,۰۰۰ ریال/ماه</p>
                        <a href="/secret-garden" class="btn">ورود به باغ امن</a>
                    </div>
                    
                    <div class="project-card">
                        <h3>🎤 تشخیص گفتار</h3>
                        <p>تبدیل گفتار به متن با دقت ۹۹% برای فارسی</p>
                        <p style="color: #ff9e00; font-weight: bold;">قیمت: ۹۹,۰۰۰ ریال/ماه</p>
                        <a href="/speech" class="btn">ورود به تشخیص گفتار</a>
                    </div>
                </div>
                
                <div class="pricing">
                    <h2 style="color: #000; margin-bottom: 20px;">💰 بسته ویژه تمام پروژه‌ها</h2>
                    <p style="color: #000; font-size: 1.3em; margin-bottom: 30px;">
                        دسترسی نامحدود به تمام ۵ پروژه + پشتیبانی VIP
                    </p>
                    <div style="font-size: 3em; color: #000; font-weight: bold; margin: 30px 0;">
                        ۴۹۹,۰۰۰ ریال
                        <div style="font-size: 0.5em; color: #333;">ماهانه</div>
                    </div>
                    <button class="btn" style="background: #000; color: #ff9e00; padding: 20px 50px; font-size: 1.2em;"
                            onclick="window.location.href='/api/marketplace'">
                        🚀 خرید بسته ویژه
                    </button>
                </div>
                
                <div class="api-info">
                    <h3>🔧 API دسترسی</h3>
                    <div class="code-block">
                        // دریافت آمار پروژه‌ها<br>
                        GET /api/projects<br><br>
                        
                        // بررسی وضعیت سیستم<br>
                        GET /api/status<br><br>
                        
                        // خرید اشتراک<br>
                        POST /api/subscribe<br>
                        { "plan": "pro", "months": 12 }
                    </div>
                </div>
            </div>
            
            <script>
                // نمایش پورت فعال
                document.addEventListener('DOMContentLoaded', function() {
                    console.log('تتراشاپ روی پورت ${PORT} فعال است');
                });
            </script>
        </body>
        </html>
    `);
});

// API Routes
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        server: 'Tetrashop Platform',
        version: '3.0.0',
        port: PORT,
        projects: [
            { name: 'شطرنج پیشرفته', endpoint: '/chess', active: true },
            { name: 'نویسنده هوشمند', endpoint: '/writer', active: true },
            { name: 'نویسنده کوانتومی', endpoint: '/quantum', active: true },
            { name: 'باغ امن', endpoint: '/secret-garden', active: true },
            { name: 'تشخیص گفتار', endpoint: '/speech', active: true }
        ],
        revenue_models: [
            'اشتراک ماهانه',
            'پکیج محدود',
            'API سازمانی',
            'خدمات سفارشی'
        ]
    });
});

app.get('/api/projects', (req, res) => {
    res.json({
        chess: { 
            name: 'شطرنج پیشرفته',
            description: 'هوش مصنوعی سطح گرندمستر',
            price: 99000,
            features: ['AI سطح GM', 'بازی آنلاین', 'تحلیل حرکات'],
            endpoint: '/chess'
        },
        writer: {
            name: 'نویسنده هوشمند',
            description: 'تولید محتوای حرفه‌ای',
            price: 149000,
            features: ['قالب‌های متنوع', 'لحن‌های مختلف', 'ویرایش هوشمند'],
            endpoint: '/writer'
        },
        quantum: {
            name: 'نویسنده کوانتومی',
            description: 'الگوریتم‌های کوانتومی',
            price: 199000,
            features: ['محاسبات کوانتومی', 'برهم‌نهی حالت‌ها', 'درهم‌تنیدگی'],
            endpoint: '/quantum'
        },
        security: {
            name: 'باغ امن',
            description: 'سیستم امنیتی پیشرفته',
            price: 299000,
            features: ['رمزنگاری 256 بیتی', 'مانیتورینگ آنلاین', 'لاگ دسترسی'],
            endpoint: '/secret-garden'
        },
        speech: {
            name: 'تشخیص گفتار',
            description: 'تبدیل گفتار به متن فارسی',
            price: 99000,
            features: ['دقت 99%', 'چند زبانه', 'ویرایش هوشمند'],
            endpoint: '/speech'
        }
    });
});

app.get('/api/marketplace', (req, res) => {
    res.json({
        plans: [
            {
                name: 'پایه',
                price: 99000,
                features: ['دسترسی به 1 پروژه', 'پشتیب ایمیل', 'استفاده محدود'],
                projects: ['شطرنج']
            },
            {
                name: 'حرفه‌ای',
                price: 299000,
                features: ['دسترسی به 3 پروژه', 'پشتیب تلفنی', 'استفاده نامحدود'],
                projects: ['شطرنج', 'نویسنده', 'تشخیص گفتار']
            },
            {
                name: 'سازمانی',
                price: 499000,
                features: ['دسترسی به تمام پروژه‌ها', 'پشتیبانی VIP', 'API اختصاصی'],
                projects: ['همه پروژه‌ها']
            }
        ],
        payment_methods: ['درگاه بانکی', 'زرین پال', 'پی پینگ'],
        support: 'support@tetrashop.com'
    });
});

// راه‌اندازی سرور
app.listen(PORT, () => {
    console.log(`
    🎉 ==============================================
    🚀 تتراشاپ با موفقیت راه‌اندازی شد!
    🎉 ==============================================
    
    🌐 آدرس اصلی: http://localhost:${PORT}
    
    📁 پروژه‌های فعال:
       1. ♔ شطرنج پیشرفته: http://localhost:${PORT}/chess
       2. ✍️ نویسنده هوشمند: http://localhost:${PORT}/writer
       3. ⚛️ نویسنده کوانتومی: http://localhost:${PORT}/quantum
       4. 🔐 باغ امن: http://localhost:${PORT}/secret-garden
       5. 🎤 تشخیص گفتار: http://localhost:${PORT}/speech
    
    🔧 APIها:
       📊 آمار سیستم: http://localhost:${PORT}/api/status
       📋 لیست پروژه‌ها: http://localhost:${PORT}/api/projects
       💰 فروشگاه: http://localhost:${PORT}/api/marketplace
    
    💰 مدل درآمدزایی:
       • اشتراک ماهانه: از ۹۹,۰۰۰ ریال
       • پکیج محدود: از ۱۹۹,۰۰۰ ریال
       • API سازمانی: از ۴۹۹,۰۰۰ ریال
       • خدمات سفارشی: قیمت توافقی
    
    ⚡ برای توقف: Ctrl+C
    🐛 گزارش مشکل: console.log
    📧 پشتیبانی: support@tetrashop.com
    
    🔥 نکته: تمام پروژه‌ها کاملاً واکنش‌گرا و فارسی هستند!
    `);
});
