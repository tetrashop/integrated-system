const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/projects', (req, res) => {
    res.json({
        success: true,
        projects: [
            { id: 1, name: 'فروشگاه اصلی', status: 'active' },
            { id: 2, name: 'سیستم پرداخت', status: 'active' },
            { id: 3, name: 'پنل مدیریت', status: 'development' },
            { id: 4, name: 'هوش مصنوعی', status: 'planning' }
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ سرور Tetrashop در پورت ${PORT} راه‌اندازی شد`);
    console.log(`🌐 آدرس: http://localhost:${PORT}`);
});
