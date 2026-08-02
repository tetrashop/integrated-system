const express = require('express');
const app = express();
const PORT = 3000;

// Middleware پایه
app.use(express.json());

// لیست سرویس‌ها
const services = [
  { id: 1, name: 'پردازش زبان طبیعی', category: 'هوش مصنوعی', status: 'فعال' },
  { id: 2, name: 'تبدیل تصویر', category: 'گرافیک', status: 'فعال' },
  { id: 3, name: 'امنیت پیشرفته', category: 'امنیت', status: 'فعال' }
];

// صفحه اصلی
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Tetrashop Gateway</title></head>
      <body>
        <h1>🚪 Gateway API Tetrashop</h1>
        <p>مدیریت ۲۳ سرویس ابری</p>
        <ul>
          <li><a href="/health">سلامت سرویس</a></li>
          <li><a href="/api/services">لیست سرویس‌ها</a></li>
          <li><a href="/api/stats">آمار</a></li>
        </ul>
      </body>
    </html>
  `);
});

// سلامت سرویس
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Tetrashop Gateway',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// لیست سرویس‌ها
app.get('/api/services', (req, res) => {
  res.json({
    success: true,
    count: services.length,
    totalExpected: 23,
    services: services
  });
});

// آمار
app.get('/api/stats', (req, res) => {
  res.json({
    totalServices: 23,
    activeServices: services.length,
    categories: [
      { name: 'هوش مصنوعی', count: 3 },
      { name: 'گرافیک و رسانه', count: 6 },
      { name: 'امنیت', count: 3 },
      { name: 'سیستم و بهینه‌سازی', count: 8 },
      { name: 'بهره‌وری', count: 2 },
      { name: 'توسعه', count: 1 }
    ]
  });
});

// شروع سرور
app.listen(PORT, () => {
  console.log('✅ Gateway API running on port ' + PORT);
  console.log('📡 URL: http://localhost:' + PORT);
  console.log('🏥 Health: http://localhost:' + PORT + '/health');
});
