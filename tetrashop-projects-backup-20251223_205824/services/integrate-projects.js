const fs = require('fs');
const path = require('path');

// خواندن server.js
let serverContent = fs.readFileSync('server.js', 'utf8');

// اضافه کردن route برای پروژه‌های جدید
const newRoutes = `
// ======================
// 🆕 پروژه‌های جدید اضافه شده
// ======================

// Route برای tetrashop-manager
app.use('/manager', express.static(path.join(__dirname, 'tetrashop-manager', 'public')));
app.get('/manager/api', (req, res) => {
  res.json({ 
    message: 'TetraShop Manager API',
    endpoints: ['/status', '/users', '/projects'],
    version: '1.0.0'
  });
});

// Route برای tetrashop-web
app.use('/web', express.static(path.join(__dirname, 'tetrashop-web')));
app.get('/web/api', (req, res) => {
  res.json({ 
    message: 'TetraShop Web API',
    features: ['landing-page', 'project-showcase', 'contact-form'],
    version: '1.0.0'
  });
});

// Route برای مدیریت پروژه‌ها
app.get('/api/managed-projects', (req, res) => {
  res.json({
    projects: [
      { name: 'TetraShop Web', path: '/web', status: 'active' },
      { name: 'TetraShop Manager', path: '/manager', status: 'active' },
      { name: 'NLP Project', path: '/nlp', status: '修复中' },
      { name: 'Chess AI', path: '/chess', status: 'active' },
      { name: 'Quantum Writer', path: '/quantum', status: 'active' }
    ]
  });
});
`;

// پیدا کردن جای مناسب برای اضافه کردن routes
const insertPoint = serverContent.indexOf('// APIها:');
if (insertPoint !== -1) {
  const before = serverContent.substring(0, insertPoint);
  const after = serverContent.substring(insertPoint);
  serverContent = before + newRoutes + after;
  
  fs.writeFileSync('server.js', serverContent);
  console.log('✅ Routes جدید به server.js اضافه شدند');
} else {
  console.log('⚠️ نقطه درج پیدا نشد، routes به انتهای فایل اضافه می‌شوند');
  serverContent += '\n' + newRoutes;
  fs.writeFileSync('server.js', serverContent);
}
