const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// تنظیمات سرویس‌ها
const SERVICES = {
  '3d': { port: 3001, path: '/3d' },
  'nlp': { port: 3002, path: '/nlp' },
  'shop': { port: 3003, path: '/shop' },
  'admin': { port: 3004, path: '/admin' },
  'chess': { port: 3005, path: '/chess' },
  'olympic': { port: 3006, path: '/olympic' },
  'ai-manager': { port: 3007, path: '/ai-manager' },
  'probability': { port: 3008, path: '/probability' }
};

app.use(cors());
app.use(express.json());

// صفحه‌ی اصلی (فرانت‌اند یکپارچه)
app.use('/', express.static(path.join(__dirname, '../frontend')));

// مسیریابی به سرویس‌ها
Object.entries(SERVICES).forEach(([name, config]) => {
  app.use(
    config.path,
    createProxyMiddleware({
      target: `http://localhost:${config.port}`,
      changeOrigin: true,
      pathRewrite: { [`^${config.path}`]: '' },
      logLevel: 'debug'
    })
  );
});

// لیست سرویس‌ها (API برای فرانت‌اند)
app.get('/api/services', (req, res) => {
  res.json(SERVICES);
});

// وضعیت سرویس‌ها
app.get('/api/status', async (req, res) => {
  const status = {};
  for (const [name, config] of Object.entries(SERVICES)) {
    try {
      const response = await fetch(`http://localhost:${config.port}/health`);
      status[name] = response.ok ? 'running' : 'unhealthy';
    } catch {
      status[name] = 'stopped';
    }
  }
  res.json(status);
});

app.listen(PORT, () => {
  console.log(`🚪 Gateway running on port ${PORT}`);
  console.log(`📋 Services: ${Object.keys(SERVICES).join(', ')}`);
});
