const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <title>♟️ شطرنج حرفه‌ای</title>
        <style>
            body { font-family: Tahoma; padding: 20px; background: #1a1a2e; color: white; text-align: center; }
            .container { max-width: 800px; margin: 0 auto; }
            h1 { color: #4cc9f0; }
            .btn { padding: 15px 30px; background: #4361ee; color: white; border: none; border-radius: 10px; margin: 10px; cursor: pointer; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>♟️ شطرنج حرفه‌ای - نسخه ساده</h1>
            <p>پلتفرم آموزش و درآمدزایی شطرنج</p>
            <button class="btn" onclick="alert('نسخه کامل در حال آماده‌سازی است')">🎮 شروع بازی</button>
            <button class="btn" onclick="alert('سیستم درآمدزایی فعال خواهد شد')">💰 اشتراک پرمیوم</button>
            <div style="margin-top: 50px; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px;">
                <h3>ویژگی‌ها:</h3>
                <p>• موتور شطرنج C++ قدرتمند</p>
                <p>• سیستم آموزش سطح‌بندی</p>
                <p>• مسابقات با جایزه نقدی</p>
                <p>• مربی خصوصی</p>
            </div>
        </div>
    </body>
    </html>
    `);
});

app.listen(PORT, () => {
    console.log(\`🚀 سرور شطرنج روی پورت \${PORT} راه‌اندازی شد\`);
    console.log(\`🌐 آدرس: http://localhost:\${PORT}\`);
});
