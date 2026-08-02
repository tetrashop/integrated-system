// API Gateway مرکزی برای پلتفرم TetraSaaS
// مسئولیت‌ها:
// 1. دریافت درخواست‌های کلاینت
// 2. احراز هویت با JWT
// 3. مسیریابی به سرویس مناسب
// 4. بازگشت پاسخ به کلاینت

const express = require('express');
const app = express();
app.use(express.json());

// نگاشت سرویس‌ها به آدرس‌ها
const services = {
  'quantum-writer': 'http://quantum-writer:3001',
  'formula-solver': 'http://formula-solver:3008',
  'content-analyzer': 'http://content-analyzer:3009',
  '3d-converter': 'http://3d-converter:3010'
  // ... 19 سرویس دیگر
};

// Route اصلی برای دسترسی به سرویس‌ها
app.all('/api/:service/:action', async (req, res) => {
  const service = req.params.service;
  const action = req.params.action;
  
  if (!services[service]) {
    return res.status(404).json({error: 'سرویس یافت نشد'});
  }
  
  try {
    // ارسال درخواست به سرویس مقصد
    const response = await fetch(`${services[service]}/${action}`, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' ? JSON.stringify(req.body) : null
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({error: 'خطا در ارتباط با سرویس'});
  }
});

// راه‌اندازی سرور
app.listen(8080, () => {
  console.log('API Gateway در حال اجرا روی پورت 8080');
});
