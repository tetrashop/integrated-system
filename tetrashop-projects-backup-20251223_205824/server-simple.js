const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// سرو فایل‌های ایستا
app.use(express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(path.join(__dirname, 'data')));

// صفحه اصلی
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/showcase.html'));
});

// API برای دریافت سرویس‌ها
app.get('/api/services', (req, res) => {
    const services = require('./data/cloud-services.json');
    res.json({ success: true, data: services });
});

app.listen(PORT, () => {
    console.log(`نمایشگاه تتراشاپ روی پورت ${PORT}`);
    console.log(`آدرس: http://localhost:${PORT}`);
});
