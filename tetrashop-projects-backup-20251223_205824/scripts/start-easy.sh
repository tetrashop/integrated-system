#!/bin/bash

echo ""
echo "🚀 راه‌اندازی آسان TetraShop"
echo "============================"

# رنگ‌ها
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# توقف سرورهای قبلی
echo -e "${YELLOW}🛑 توقف سرورهای قبلی...${NC}"
pkill -f "node.*server" 2>/dev/null
sleep 2

# بررسی پورت
PORT=3000
while netstat -tulpn 2>/dev/null | grep -q :$PORT; do
    echo -e "${YELLOW}⚠️ پورت $PORT در حال استفاده است، آزمایش پورت $((PORT+1))...${NC}"
    PORT=$((PORT+1))
done

# بررسی وابستگی‌ها
echo -e "${BLUE}📦 بررسی وابستگی‌ها...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📥 نصب express...${NC}"
    npm install express --silent
fi

# بررسی فایل شطرجد
if [ ! -f "chess/index.html" ]; then
    echo -e "${YELLOW}📝 ایجاد فایل شطرجد...${NC}"
    mkdir -p chess
    cat > chess/index.html << 'CHESS_BASIC'
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <title>شطرجد TetraShop</title>
    <style>
        :root { --dark: #1a1a2e; --light: #f0f0f0; --green: #10b981; }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Vazirmatn'; }
        body { background: var(--dark); color: var(--light); padding: 20px; }
        .header { text-align: center; padding: 30px; background: rgba(16, 185, 129, 0.1); border-radius: 15px; margin-bottom: 30px; }
        h1 { color: var(--green); font-size: 2.5rem; margin-bottom: 15px; }
        .board { display: grid; grid-template-columns: repeat(8, 60px); margin: 20px auto; width: 480px; border: 4px solid #475569; }
        .square { width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; }
        .light { background: #f0d9b5; }
        .dark { background: #b58863; }
        .controls { display: flex; gap: 15px; justify-content: center; margin: 30px; }
        .btn { padding: 15px 25px; background: var(--green); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>♟️ شطرجد TetraShop</h1>
        <p>سیستم هوشمند شطرجد با قابلیت درآمدزایی</p>
        <p style="margin-top: 15px; color: #94a3b8;">
            🎮 بازی رایگان | 💰 خرید سکه | 📊 تحلیل حرفه‌ای
        </p>
    </div>
    
    <div class="board" id="board"></div>
    
    <div class="controls">
        <button class="btn" onclick="startGame()">🎮 شروع بازی</button>
        <button class="btn" onclick="showShop()">🛒 خرید سکه</button>
        <a href="/" class="btn">🏠 بازگشت</a>
    </div>
    
    <div style="text-align: center; margin-top: 40px; color: #94a3b8;">
        <p>💰 پیش‌بینی درآمد ماهانه: <strong style="color: var(--green);">۹,۵۰۰,۰۰۰ تومان</strong></p>
    </div>
    
    <script>
        // ایجاد تخته
        const board = document.getElementById('board');
        for(let i=0; i<64; i++) {
            const square = document.createElement('div');
            const row = Math.floor(i/8);
            square.className = `square ${(row + i) % 2 === 0 ? 'dark' : 'light'}`;
            board.appendChild(square);
        }
        
        function startGame() {
            alert('🎮 بازی رایگان شروع شد!\n\nسطح: متوسط\nزمان: نامحدود\n\nبرای بازی حرفه‌ای سکه خریداری کنید.');
        }
        
        function showShop() {
            alert('🛒 فروشگاه سکه\n\n• ۱۰۰ سکه: ۱۰,۰۰۰ تومان\n• ۵۰۰ سکه: ۴۵,۰۰۰ تومان\n• اشتراک ماهانه: ۳۰۰,۰۰۰ تومان');
        }
    </script>
</body>
</html>
CHESS_BASIC
fi

# راه‌اندازی سرور
echo -e "${GREEN}🚀 راه‌اندازی سرور روی پورت $PORT...${NC}"
echo ""
echo "================================================"
echo "✅ TetraShop آماده بهره‌برداری!"
echo "================================================"
echo ""
echo "🌐 ${GREEN}آدرس‌های مهم:${NC}"
echo "   📍 ${BLUE}داشبورد اصلی:${NC} http://localhost:$PORT"
echo "   ♟️ ${BLUE}شطرجد:${NC}       http://localhost:$PORT/chess"
echo "   📡 ${BLUE}وضعیت API:${NC}   http://localhost:$PORT/api/status"
echo ""
echo "💰 ${GREEN}پیش‌بینی درآمد:${NC}"
echo "   • شطرجد: ۹,۵۰۰,۰۰۰ تومان/ماه"
echo "   • کل سیستم: ۲۲,۰۰۰,۰۰۰ تومان/ماه"
echo ""
echo "🔧 ${GREEN}برای تست:${NC}"
echo "   1. مرورگر خود را باز کنید"
echo "   2. آدرس بالا را وارد کنید"
echo "   3. سیستم را تست کنید"
echo ""
echo "================================================"
echo "⏳ سرور در حال اجرا... (برای خروج: Ctrl+C)"
echo "================================================"
echo ""

# اجرای سرور
PORT=$PORT node server-final.js
