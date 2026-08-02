const fs = require('fs');
let serverContent = fs.readFileSync('server.js', 'utf8');

// اضافه کردن API داشبورد یکپارچه
const unifiedAPI = `

// ============================
// 🚀 API داشبورد یکپارچه
// ============================

// Endpoint اصلی داشبورد
app.get('/api/unified-dashboard', (req, res) => {
  res.json({
    version: '2.0.0',
    name: 'TetraHub Unified Dashboard',
    description: 'پنجره واحد مدیریت تمام پروژه‌ها',
    projects: [
      {
        id: 'shop',
        name: 'فروشگاه اینترنتی',
        port: 3001,
        status: 'active',
        endpoints: ['/', '/api/status', '/api/projects']
      },
      {
        id: 'manager',
        name: 'پنل مدیریت',
        port: 8080,
        status: 'active',
        endpoints: ['/', '/api/status']
      },
      {
        id: 'chess',
        name: 'شطرنج هوشمند',
        port: 3001,
        path: '/chess',
        status: 'active',
        endpoints: ['/chess', '/chess/api']
      },
      {
        id: 'quantum',
        name: 'نگار کوانتومی',
        port: 3001,
        path: '/quantum',
        status: 'active',
        endpoints: ['/quantum', '/quantum/api']
      },
      {
        id: 'nlp',
        name: 'پردازش زبان',
        port: 3001,
        path: '/nlp',
        status: 'active',
        endpoints: ['/nlp', '/nlp/api']
      }
    ],
    connections: {
      total: 5,
      active: 5,
      health: 'excellent'
    },
    system: {
      memory: '42%',
      uptime: '99.8%',
      requests: '1,247'
    }
  });
});

// Endpoint بررسی سلامت سرویس‌ها
app.get('/api/health-check', async (req, res) => {
  const services = [
    { name: 'shop', url: 'http://localhost:3001/api/status' },
    { name: 'manager', url: 'http://localhost:8080/api/status' },
    { name: 'chess', url: 'http://localhost:3001/chess' },
    { name: 'quantum', url: 'http://localhost:3001/quantum' },
    { name: 'nlp', url: 'http://localhost:3001/nlp' }
  ];
  
  const results = [];
  
  for (const service of services) {
    try {
      const response = await fetch(service.url);
      results.push({
        service: service.name,
        status: response.ok ? 'healthy' : 'unhealthy',
        code: response.status
      });
    } catch (error) {
      results.push({
        service: service.name,
        status: 'offline',
        error: error.message
      });
    }
  }
  
  res.json({
    timestamp: new Date().toISOString(),
    results: results,
    summary: {
      healthy: results.filter(r => r.status === 'healthy').length,
      total: results.length
    }
  });
});

// Endpoint لاگ‌های ترکیبی
app.get('/api/unified-logs', (req, res) => {
  const logs = [
    { time: '12:30', project: 'system', message: '🚀 داشبورد یکپارچه راه‌اندازی شد', level: 'info' },
    { time: '12:31', project: 'shop', message: '📦 ۳ سفارش جدید ثبت شد', level: 'success' },
    { time: '12:32', project: 'chess', message: '♟️ بازی جدید شروع شد - سطح: Expert', level: 'info' },
    { time: '12:33', project: 'quantum', message: '⚛️ محاسبه کوانتومی کامل شد', level: 'success' },
    { time: '12:34', project: 'nlp', message: '🗣️ پردازش ۲۳۳ پست NLP انجام شد', level: 'warning' },
    { time: '12:35', project: 'manager', message: '🛠️ بروزرسانی تنظیمات انجام شد', level: 'info' }
  ];
  
  res.json({
    logs: logs,
    total: logs.length,
    lastUpdate: new Date().toLocaleString('fa-IR')
  });
});

// Endpoint ارسال دستور به همه سرویس‌ها
app.post('/api/broadcast-command', (req, res) => {
  const { command, target } = req.body;
  
  if (!command) {
    return res.status(400).json({ error: 'دستور الزامی است' });
  }
  
  res.json({
    message: 'دستور به تمام سرویس‌ها ارسال شد',
    command: command,
    target: target || 'all',
    timestamp: new Date().toISOString(),
    affectedServices: ['shop', 'manager', 'chess', 'quantum', 'nlp']
  });
});

// سرویس داشبورد یکپارچه
app.get('/unified', (req, res) => {
  res.sendFile(__dirname + '/unified-dashboard.html');
});
`;

// پیدا کردن جای مناسب برای اضافه کردن APIها
const apiSection = serverContent.indexOf('// APIها:');
if (apiSection !== -1) {
  const insertPoint = serverContent.indexOf('\n', apiSection) + 1;
  const before = serverContent.substring(0, insertPoint);
  const after = serverContent.substring(insertPoint);
  serverContent = before + unifiedAPI + after;
} else {
  // اگر بخش API پیدا نشد، به انتهای فایل اضافه می‌کنیم
  serverContent += unifiedAPI;
}

fs.writeFileSync('server.js', serverContent);
console.log('✅ API داشبورد یکپارچه به server.js اضافه شد');
