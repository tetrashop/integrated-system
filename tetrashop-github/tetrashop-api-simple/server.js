import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    version: '3.2.0',
    status: '✅ فعال با ۲۵۶ پروژه و ۳۲ سرویس',
    timestamp: new Date().toISOString()
  });
});

// NLP API
app.post('/api/nlp/process', (req, res) => {
  const { text } = req.body;
  
  // الگوریتم NLP ساده
  const words = text ? text.split(/\s+/).filter(w => w.length > 0) : [];
  const sentiment = text && text.includes('عالی') ? 'مثبت' : 'خنثی';
  
  res.json({
    success: true,
    original: text,
    result: {
      tokens: words,
      sentiment,
      wordCount: words.length
    }
  });
});

// Serve frontend if exists
app.use('/app', express.static('frontend'));

// Default route
app.get('/', (req, res) => {
  res.json({
    name: 'TetraSaaS v3.2',
    description: 'بزرگترین مجموعه هوش مصنوعی فارسی',
    endpoints: {
      health: '/api/health',
      nlp: '/api/nlp/process',
      frontend: '/app'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 سرور TetraSaaS v3.2 در پورت ${PORT} اجرا شد`);
  console.log(`📡 API سلامت: http://localhost:${PORT}/api/health`);
});
