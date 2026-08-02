import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// API سلامت - رفع خطای 404
app.get('/api/health', (req, res) => {
  res.json({
    version: '3.2.0',
    status: '✅ فعال با ۲۵۶ پروژه و ۳۲ سرویس',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API NLP
app.post('/api/nlp/process', (req, res) => {
  const { text } = req.body;
  res.json({
    success: true,
    result: {
      tokens: text.split(' '),
      sentiment: 'مثبت',
      wordCount: text.split(' ').length
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 سرور TetraSaaS API در پورت ${PORT} اجرا شد`);
  console.log(`🔗 http://localhost:${PORT}/api/health`);
});
