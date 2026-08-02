const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// سرویس فایل‌های استاتیک
app.use(express.static(__dirname));
app.use('/projects', express.static(path.join(__dirname, 'projects')));

// روت اصلی
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API ساده برای تست
app.get('/api/status', (req, res) => {
    res.json({
        status: 'active',
        timestamp: new Date().toISOString(),
        projects: 3,
        uptime: process.uptime()
    });
});

// شروع سرور
app.listen(PORT, () => {
    console.log('========================================');
    console.log('  Tetrashop Sample Server Started');
    console.log('========================================');
    console.log('  Local:    http://localhost:' + PORT);
    console.log('  Status:   http://localhost:' + PORT + '/api/status');
    console.log('');
    console.log('  Projects Available:');
    console.log('    • Dashboard: /projects/dashboard/');
    console.log('    • Store:     /projects/store/');
    console.log('    • Analytics: /projects/analytics/');
    console.log('');
    console.log('========================================');
    console.log('  Ready for development!');
    console.log('========================================');
});
