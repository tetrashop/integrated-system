const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// صفحه اصلی
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <title>تتراشاپ - پروژه‌های کامل</title>
      <style>
        body { 
          font-family: 'Vazirmatn', sans-serif; 
          padding: 40px; 
          text-align: center; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
        }
        h1 {
          font-size: 3rem;
          margin-bottom: 30px;
          text-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .projects {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          margin: 40px 0;
        }
        .project-card {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 15px;
          padding: 30px 20px;
          text-decoration: none;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s;
        }
        .project-card:hover {
          transform: translateY(-10px);
          background: rgba(255, 255, 255, 0.25);
          box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        }
        .project-icon {
          font-size: 3rem;
          margin-bottom: 15px;
          display: block;
        }
        .monetization-banner {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #333;
          padding: 25px;
          border-radius: 15px;
          margin: 40px 0;
          font-weight: bold;
        }
      </style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vazirmatn@33.003/font.css">
    </head>
    <body>
      <div class="container">
        <h1>🚀 تتراشاپ - پروژه‌های کامل</h1>
        <p>مجموعه‌ای از ۵ پروژه تعاملی با سیستم درآمدزایی یکپارچه</p>
        
        <div class="monetization-banner">
          ✨ سیستم درآمدزایی فعال! ماهانه تا ۲۲۸,۰۰۰ تومان درآمد
        </div>
        
        <div class="projects">
          <a href="/chess" class="project-card">
            <span class="project-icon">♔</span>
            <h3>شطرنج تعاملی</h3>
            <p>بازی شطرنج با قابلیت‌های پیشرفته و درآمدزایی</p>
          </a>
          
          <a href="/writer" class="project-card">
            <span class="project-icon">✍️</span>
            <h3>نویسنده هوشمند</h3>
            <p>ویرایشگر پیشرفته با پیشنهادات هوشمند</p>
          </a>
          
          <a href="/quantum" class="project-card">
            <span class="project-icon">⚛️</span>
            <h3>شبیه‌ساز کوانتومی</h3>
            <p>شبیه‌سازی مفاهیم مکانیک کوانتومی</p>
          </a>
          
          <a href="/secret-garden" class="project-card">
            <span class="project-icon">🌿</span>
            <h3>باغ رازآلود</h3>
            <p>بازی ماجراجویی با معماهای تعاملی</p>
          </a>
          
          <a href="/speech-recognition" class="project-card">
            <span class="project-icon">🎤</span>
            <h3>تشخیص گفتار فارسی</h3>
            <p>تبدیل گفتار به متن با پشتیبانی فارسی</p>
          </a>
        </div>
        
        <div style="margin-top: 50px;">
          <a href="/monetization" style="background: #FFD700; color: #333; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; margin: 10px;">
            🚀 راهنمای درآمدزایی
          </a>
          <a href="/api/status" style="background: #4CAF50; color: white; padding: 15px 30px; border-radius: 10px; text-decoration: none; margin: 10px;">
            📊 وضعیت سرور
          </a>
        </div>
        
        <div style="margin-top: 40px; color: rgba(255,255,255,0.7); font-size: 0.9rem;">
          <p>آدرس: tetrashop-projects.vercel.app | آخرین بروزرسانی: امروز</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Route برای پروژه‌ها
app.get('/chess', (req, res) => {
  res.sendFile(path.join(__dirname, '../chess/index.html'));
});

app.get('/writer', (req, res) => {
  res.sendFile(path.join(__dirname, '../writer/index.html'));
});

app.get('/quantum', (req, res) => {
  res.sendFile(path.join(__dirname, '../quantum/index.html'));
});

app.get('/secret-garden', (req, res) => {
  res.sendFile(path.join(__dirname, '../secret-garden/index.html'));
});

app.get('/speech-recognition', (req, res) => {
  res.sendFile(path.join(__dirname, '../speech-recognition/index.html'));
});

// صفحه درآمدزایی
app.get('/monetization', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <title>درآمدزایی | تتراشاپ</title>
      <style>
        body { font-family: 'Vazirmatn'; padding: 30px; }
        .income-methods { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin: 50px 0; }
        .method-card { background: #f8f9fa; border-radius: 15px; padding: 30px; text-align: center; border: 2px solid #e9ecef; }
        .method-card h3 { color: #333; }
        .method-price { font-size: 32px; color: #4CAF50; margin: 15px 0; }
        .btn { display: inline-block; margin-top: 20px; padding: 12px 30px; background: #0070f3; color: white; text-decoration: none; border-radius: 8px; }
      </style>
    </head>
    <body>
      <h1>💰 سیستم درآمدزایی تتراشاپ</h1>
      <p>چگونه از ۵ پروژه درآمد داشته باشیم؟</p>
      
      <div class="income-methods">
        <div class="method-card">
          <h3>👑 عضویت پریمیوم</h3>
          <p>ارائه قابلیت‌های پیشرفته</p>
          <div class="method-price">۲۹,۰۰۰ تومان</div>
          <p>در ماه</p>
          <a href="/api/premium/pricing" class="btn">شروع کنید</a>
        </div>
        
        <div class="method-card">
          <h3>📢 تبلیغات</h3>
          <p>اجاره فضای تبلیغاتی</p>
          <div class="method-price">۱۵۰,۰۰۰ تومان</div>
          <p>در ماه</p>
          <a href="/api/ads" class="btn">مشاهده نرخ‌ها</a>
        </div>
        
        <div class="method-card">
          <h3>💻 فروش سورس کد</h3>
          <p>فروش کدهای پروژه</p>
          <div class="method-price">۴۹,۰۰۰ تومان</div>
          <p>هر پروژه</p>
          <a href="/api/store" class="btn">مشاهده فروشگاه</a>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 50px;">
        <a href="/" style="color: #0070f3;">← بازگشت به صفحه اصلی</a>
      </div>
    </body>
    </html>
  `);
});

// API وضعیت
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'active',
    time: new Date().toISOString(),
    projects: ['chess', 'writer', 'quantum', 'secret-garden', 'speech-recognition'],
    message: 'سرور فعال و آماده است'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).send(`
    <div style="font-family: 'Vazirmatn'; text-align: center; padding: 100px;">
      <h1>۴۰۴ - صفحه پیدا نشد</h1>
      <p>صفحه مورد نظر وجود ندارد</p>
      <a href="/" style="color: #0070f3; text-decoration: none;">بازگشت به صفحه اصلی</a>
    </div>
  `);
});

// راه‌اندازی سرور
app.listen(PORT, () => {
  console.log(`سرور در پورت ${PORT} اجرا شد`);
});

module.exports = app;
