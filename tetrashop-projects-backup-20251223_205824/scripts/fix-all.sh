#!/bin/bash
echo "🔧 رفع سریع همه مشکلات..."
echo "========================"

cd /data/data/com.termux/files/home/tetrashop-projects

# ۱. حل مشکل دسترسی
chmod +x create-premium-chess.sh 2>/dev/null || echo "⚠️ فایل create-premium-chess.sh یافت نشد"

# ۲. توقف سرورهای قدیمی
echo "🛑 توقف سرورهای قدیمی..."
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "npm start" 2>/dev/null || true
sleep 2

# ۳. ایجاد پوشه chess-premium اگر وجود ندارد
if [ ! -d "chess-premium" ]; then
    echo "📁 ایجاد پوشه chess-premium..."
    mkdir -p chess-premium
fi

# ۴. رفتن به پوشه chess-premium
cd chess-premium

# ۵. ایجاد فایل‌های ضروری
echo "📝 ایجاد فایل‌های ضروری..."

# ایجاد server.js با پورت 4000
cat > server.js << 'SERVER_JS'
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
SERVER_JS

# ایجاد package.json ساده
cat > package.json << 'PKG_JSON'
{
  "name": "chess-premium-simple",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
PKG_JSON

# ۶. نصب وابستگی‌ها
echo "📦 نصب وابستگی‌ها..."
npm install 2>/dev/null || echo "⚠️ npm install با خطا مواجه شد"

# ۷. ایجاد پوشه public
mkdir -p public

# ۸. اجرای سرور
echo "🚀 اجرای سرور روی پورت 4000..."
PORT=4000 node server.js &
SERVER_PID=$!
sleep 3

# ۹. بررسی وضعیت
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ سرور با موفقیت راه‌اندازی شد!"
    echo "🌐 آدرس: http://localhost:4000"
    echo "📌 PID: $SERVER_PID"
else
    echo "❌ سرور راه‌اندازی نشد"
    echo "🔧 تلاش با پورت 4001..."
    PORT=4001 node server.js &
    sleep 2
    echo "🌐 آدرس جدید: http://localhost:4001"
fi

echo ""
echo "🎯 برای متوقف کردن سرور:"
echo "   pkill -f 'node.*server.js'"
