const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// لیست کامل سرویس‌ها
const SERVICES = [
  { id: 1, name: "quantum-writer", port: 3001, category: "AI", description: "نویسنده کوانتومی" },
  { id: 2, name: "ai-writer", port: 3002, category: "AI", description: "نویسنده هوش مصنوعی" },
  { id: 3, name: "secret-garden", port: 3003, category: "Productivity", description: "باغ مخفی" },
  { id: 4, name: "3d-converter", port: 3004, category: "Graphics", description: "مبدل سه بعدی" },
  { id: 5, name: "2d-to-3d", port: 3005, category: "Graphics", description: "تبدیل دو بعدی به سه بعدی" },
  { id: 6, name: "content-analyzer", port: 3006, category: "AI", description: "تحلیلگر محتوا" },
  { id: 7, name: "anti-fragmentation", port: 3007, category: "System", description: "ضد تکه تکه شدن" },
  { id: 8, name: "formula-solver", port: 3008, category: "Tools", description: "حل کننده فرمول" },
  { id: 9, name: "code-cleaner", port: 3009, category: "Development", description: "پاک کننده کد" },
  { id: 10, name: "graphic-2d", port: 3010, category: "Graphics", description: "گرافیک دو بعدی" },
  { id: 11, name: "anti-smoke", port: 3011, category: "Health", description: "ضد دود" },
  { id: 12, name: "telescope-design", port: 3012, category: "Design", description: "طراحی تلسکوپ" },
  { id: 13, name: "teleport-system", port: 3013, category: "System", description: "سیستم انتقال" },
  { id: 14, name: "image-processor", port: 3014, category: "Graphics", description: "پردازشگر تصویر" },
  { id: 15, name: "audio-converter", port: 3015, category: "Media", description: "مبدل صوتی" },
  { id: 16, name: "video-editor", port: 3016, category: "Media", description: "ویرایشگر ویدیو" },
  { id: 17, name: "data-encryptor", port: 3017, category: "Security", description: "رمزگذار داده" },
  { id: 18, name: "network-scanner", port: 3018, category: "Security", description: "اسکنر شبکه" },
  { id: 19, name: "battery-optimizer", port: 3019, category: "System", description: "بهینه‌ساز باتری" },
  { id: 20, name: "file-organizer", port: 3020, category: "Productivity", description: "سازماندهی فایل" },
  { id: 21, name: "password-generator", port: 3021, category: "Security", description: "تولیدکننده رمز" },
  { id: 22, name: "system-monitor", port: 3022, category: "System", description: "مانیتور سیستم" },
  { id: 23, name: "backup-manager", port: 3023, category: "System", description: "مدیریت پشتیبان" }
];

// Route اصلی
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 TetraSaaS API Gateway',
    version: '2.0.0',
    status: 'active',
    timestamp: new Date().toISOString(),
    total_services: SERVICES.length,
    documentation: 'https://github.com/YOUR-USERNAME/tetrasaas/wiki',
    endpoints: {
      home: '/',
      health: '/health',
      services: '/services',
      service_detail: '/services/:id',
      stats: '/stats',
      ping: '/ping'
    }
  });
});

// Route سلامت
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: SERVICES.length,
    memory: process.memoryUsage()
  });
});

// لیست همه سرویس‌ها
app.get('/services', (req, res) => {
  res.json({
    success: true,
    count: SERVICES.length,
    services: SERVICES
  });
});

// اطلاعات سرویس خاص
app.get('/services/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const service = SERVICES.find(s => s.id === id);
  
  if (service) {
    res.json({
      success: true,
      service: service
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Service not found'
    });
  }
});

// آمار سرویس‌ها
app.get('/stats', (req, res) => {
  const categories = {};
  SERVICES.forEach(service => {
    categories[service.category] = (categories[service.category] || 0) + 1;
  });
  
  res.json({
    success: true,
    stats: {
      total_services: SERVICES.length,
      categories: categories,
      ports_range: "3001-3023",
      active_since: new Date().toISOString()
    }
  });
});

// Route برای تست
app.get('/ping', (req, res) => {
  res.json({
    success: true,
    message: 'pong',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Route برای سیمولیشن سرویس‌ها
app.get('/simulate/:service', (req, res) => {
  const serviceName = req.params.service;
  const service = SERVICES.find(s => s.name === serviceName);
  
  if (service) {
    res.json({
      success: true,
      service: service.name,
      action: 'simulated',
      result: `پردازش ${service.description} انجام شد`,
      processing_time: Math.floor(Math.random() * 100) + 50,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Service not found'
    });
  }
});

// Route 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    available_endpoints: [
      '/',
      '/health',
      '/services',
      '/services/:id',
      '/stats',
      '/ping',
      '/simulate/:service'
    ]
  });
});

// پورت داینامیک برای Vercel
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 TetraSaaS API Gateway running on port ${PORT}`);
  console.log(`📡 Total services: ${SERVICES.length}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

module.exports = app;
