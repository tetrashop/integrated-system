console.log('🔴 1. شروع فایل');

const express = require('express');
console.log('🔴 2. Express وارد شد');

const app = express();
console.log('🔴 3. برنامه Express ایجاد شد');

const PORT = 3000;
console.log('🔴 4. پورت تنظیم شد');

// middleware پایه
console.log('🔴 5. قبل از middlewareها');
app.use(express.json());
console.log('🔴 6. middleware json اضافه شد');

app.use(express.static('.'));
console.log('🔴 7. middleware static اضافه شد');

// route اصلی
console.log('🔴 8. قبل از تعریف routes');
app.get('/', (req, res) => {
    console.log('📥 درخواست دریافت شد: GET /');
    res.send('✅ سرور کار می‌کند!');
});
console.log('🔴 9. route اصلی تعریف شد');

app.get('/api/status', (req, res) => {
    res.json({ status: 'active' });
});
console.log('🔴 10. route API تعریف شد');

console.log('🔴 11. قبل از listen');
app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 سرور در پورت ' + PORT + ' اجرا شد');
    console.log('🌐 آدرس: http://localhost:' + PORT);
});
console.log('🔴 12. بعد از listen - باید اجرا شده باشد');

module.exports = app;
console.log('🔴 13. فایل export شد');
