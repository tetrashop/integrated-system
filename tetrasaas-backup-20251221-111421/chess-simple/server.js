const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head><meta charset="UTF-8"><title>شطرنج ساده</title></head>
    <body style="font-family:Tahoma;text-align:center;padding:50px;">
        <h1 style="color:#6C63FF;">♟️ شطرنج TetraShop</h1>
        <p>نسخه ساده - موتور C++ در حال آماده‌سازی</p>
        <div style="margin:30px;">
            <button style="padding:15px;background:#6C63FF;color:white;border:none;border-radius:10px;margin:10px;">
                🎮 بازی با موتور
            </button>
            <button style="padding:15px;background:#4CAF50;color:white;border:none;border-radius:10px;margin:10px;">
                📚 آموزش‌ها
            </button>
        </div>
    </body>
    </html>
    `);
});

app.listen(PORT, () => console.log(\`شطرنج روی پورت \${PORT}\`));
