const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3001;
const GATEWAY_URL = 'http://localhost:3000';

// تنظیمات
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// داده‌های نمونه برای توسعه
const sampleData = {
  totalServices: 23,
  activeServices: 3,
  services: [
    { id: 1, name: 'پردازش زبان طبیعی', category: 'هوش مصنوعی', status: 'فعال', uptime: '99.8%', requests: 12450 },
    { id: 2, name: 'تبدیل تصویر', category: 'گرافیک', status: 'فعال', uptime: '99.5%', requests: 8560 },
    { id: 3, name: 'امنیت پیشرفته', category: 'امنیت', status: 'فعال', uptime: '100%', requests: 3420 }
  ],
  categories: [
    { name: 'هوش مصنوعی', count: 3, color: '#4CAF50' },
    { name: 'گرافیک و رسانه', count: 6, color: '#2196F3' },
    { name: 'امنیت', count: 3, color: '#F44336' },
    { name: 'سیستم و بهینه‌سازی', count: 8, color: '#FF9800' },
    { name: 'بهره‌وری', count: 2, color: '#9C27B0' },
    { name: 'توسعه', count: 1, color: '#607D8B' }
  ]
};

// صفحه اصلی داشبورد
app.get('/', async (req, res) => {
  try {
    // دریافت داده از Gateway
    const servicesResponse = await axios.get(\`\${GATEWAY_URL}/api/services\`);
    const statsResponse = await axios.get(\`\${GATEWAY_URL}/api/stats\`);
    
    res.render('index', {
      title: 'داشبورد مدیریت Tetrashop',
      services: servicesResponse.data.services || sampleData.services,
      stats: statsResponse.data || sampleData,
      gatewayStatus: 'connected'
    });
  } catch (error) {
    // اگر Gateway در دسترس نبود، از داده‌های نمونه استفاده کن
    console.log('Using sample data:', error.message);
    res.render('index', {
      title: 'داشبورد مدیریت Tetrashop',
      services: sampleData.services,
      stats: sampleData,
      gatewayStatus: 'disconnected'
    });
  }
});

// API برای دریافت داده‌های real-time
app.get('/api/dashboard-data', async (req, res) => {
  try {
    const [services, stats] = await Promise.all([
      axios.get(\`\${GATEWAY_URL}/api/services\`),
      axios.get(\`\${GATEWAY_URL}/api/stats\`)
    ]);
    
    res.json({
      success: true,
      services: services.data,
      stats: stats.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      success: false,
      data: sampleData,
      message: 'Using sample data',
      timestamp: new Date().toISOString()
    });
  }
});

// کنترل سرویس‌ها
app.post('/api/service/:id/control', (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  
  // اینجا در واقع باید به Gateway دستور بدهیم
  // برای نمونه، پاسخ می‌دهیم
  res.json({
    success: true,
    message: \`سرویس \${id} با عمل \${action} کنترل شد\`,
    action: action,
    serviceId: id,
    timestamp: new Date().toISOString()
  });
});

// راه‌اندازی سرور
app.listen(PORT, () => {
  console.log('🎨 Dashboard running on port ' + PORT);
  console.log('📊 URL: http://localhost:' + PORT);
  console.log('🔗 Gateway: ' + GATEWAY_URL);
});
