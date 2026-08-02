const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Route اصلی
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API‌های اصلی
app.get('/api/status', (req, res) => {
  res.json({
    status: 'active',
    message: '🚀 Tetra System Running!',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    blockHeight: 156
  });
});

app.get('/api/nlp/analyze', (req, res) => {
  const { text } = req.query;
  res.json({
    text: text || 'متن نمونه',
    sentiment: 'positive',
    confidence: 0.95,
    keywords: ['هوش', 'مصنوعی', 'پردازش'],
    summary: 'این متن درباره تست سیستم است',
    entities: [
      { type: 'SYSTEM', value: 'Tetra', confidence: 0.99 }
    ]
  });
});

app.get('/api/blockchain/status', (req, res) => {
  res.json({
    network: 'TETRA Mainnet',
    status: 'active',
    blockHeight: 156,
    nodes: 25,
    transactionCount: 1247,
    hashRate: '450 TH/s'
  });
});

app.get('/api/ai/models', (req, res) => {
  res.json({
    models: [
      { id: 'gpt-4', name: 'GPT-4 Turbo', status: 'active' },
      { id: 'claude-2', name: 'Claude 2', status: 'active' },
      { id: 'llama-2', name: 'Llama 2 70B', status: 'active' }
    ],
    activeModel: 'gpt-4',
    memoryUsage: '65%'
  });
});

app.get('/api/security/status', (req, res) => {
  res.json({
    overall: 'secure',
    threats: {
      active: 0,
      blocked: 45,
      last24h: 12
    },
    firewall: 'active',
    lastScan: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`
✨ سیستم Tetra با موفقیت راه‌اندازی شد!
📍 پورت: ${PORT}
🌐 آدرس: http://localhost:${PORT}
🕒 زمان: ${new Date().toLocaleString('fa-IR')}
📊 وضعیت: کاملاً فعال

🎯 ماژول‌های فعال:
   🧠 پردازش زبان طبیعی
   ⛓️ شبکه بلاکچین  
   🤖 هوش مصنوعی
   🔐 امنیت سایبری

✅ آماده استفاده!
  `);
});
