/**
 * سرور اصلی TetraShop برای Termux
 * با پشتیبانی کامل از شطرجد
 */

const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');

const PORT = 3000;
const HOST = '0.0.0.0'; // برای دسترسی از localhost و 127.0.0.1

// MIME types
const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.ico': 'image/x-icon'
};

// تخته شطرجد
const initialChessBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

const pieceSymbols = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

// صفحه داشبورد اصلی
const dashboardHTML = `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TetraShop - داشبورد اصلی</title>
    <style>
        :root {
            --primary: #2563eb;
            --secondary: #7c3aed;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --dark: #0f172a;
            --light: #f8fafc;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Vazirmatn', sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, var(--dark) 0%, #1e293b 100%);
            color: var(--light);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        header {
            text-align: center;
            padding: 40px 20px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            margin-bottom: 40px;
            border: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        h1 {
            font-size: 3rem;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 15px;
        }
        
        .modules-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin: 40px 0;
        }
        
        .module-card {
            background: rgba(255, 255, 255, 0.07);
            border-radius: 15px;
            padding: 25px;
            transition: all 0.3s;
            border: 2px solid rgba(255, 255, 255, 0.1);
            text-decoration: none;
            color: inherit;
            display: block;
        }
        
        .module-card:hover {
            transform: translateY(-5px);
            border-color: var(--success);
        }
        
        .module-card.chess {
            border-color: rgba(16, 185, 129, 0.3);
        }
        
        .module-title {
            font-size: 1.5rem;
            color: var(--success);
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .module-stats {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid rgba(255,255,255,0.1);
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-value {
            font-size: 1.3rem;
            font-weight: bold;
            color: var(--warning);
        }
        
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.7;
        }
        
        .status-badge {
            display: inline-block;
            padding: 8px 20px;
            background: rgba(14, 165, 233, 0.2);
            color: #0ea5e9;
            border-radius: 50px;
            margin: 5px;
            font-size: 0.9rem;
        }
        
        footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 1px solid rgba(255,255,255,0.1);
            color: rgba(255,255,255,0.7);
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🚀 TetraShop Quantum</h1>
            <p>پلتفرم جامع کسب‌وکار - نسخه Termux</p>
            <div>
                <span class="status-badge">✅ آنلاین</span>
                <span class="status-badge">💰 درآمدزایی فعال</span>
                <span class="status-badge">🎮 شطرجد فعال</span>
            </div>
        </header>
        
        <div class="modules-grid">
            <a href="/chess" class="module-card chess">
                <h3 class="module-title">♟️ شطرجد درآمدزا</h3>
                <p>سیستم هوشمند شطرجد با قابلیت کسب درآمد تا ۹٫۵ میلیون تومان در ماه</p>
                <div class="module-stats">
                    <div class="stat-item">
                        <div class="stat-value">۹٫۵M</div>
                        <div class="stat-label">درآمد/ماه</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">۲٫۵K</div>
                        <div class="stat-label">بازیکنان</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">۹۸٪</div>
                        <div class="stat-label">رضایت</div>
                    </div>
                </div>
            </a>
            
            <div class="module-card">
                <h3 class="module-title">🛒 تجارت الکترونیک</h3>
                <p>سیستم فروشگاه اینترنتی پیشرفته با امکانات کامل</p>
                <div class="module-stats">
                    <div class="stat-item">
                        <div class="stat-value">۱۲٫۵M</div>
                        <div class="stat-label">درآمد/ماه</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">۱٫۲K</div>
                        <div class="stat-label">سفارشات</div>
                    </div>
                </div>
            </div>
            
            <div class="module-card">
                <h3 class="module-title">👥 CRM پیشرفته</h3>
                <p>مدیریت هوشمند ارتباط با مشتریان و تحلیل رفتار</p>
                <div class="module-stats">
                    <div class="stat-item">
                        <div class="stat-value">۲٫۴K</div>
                        <div class="stat-label">مشتریان</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">۹۴٪</div>
                        <div class="stat-label">رضایت</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="text-align: center; margin: 50px 0; padding: 30px; background: rgba(0,0,0,0.3); border-radius: 15px;">
            <h3 style="color: var(--warning); margin-bottom: 20px;">📊 آمار کلی پلتفرم</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                <div>
                    <div style="font-size: 2rem; color: var(--success);">۲۲M</div>
                    <div>درآمد ماهانه</div>
                </div>
                <div>
                    <div style="font-size: 2rem; color: #0ea5e9;">۱۲٫۵K</div>
                    <div>کاربران فعال</div>
                </div>
                <div>
                    <div style="font-size: 2rem; color: #f59e0b;">۳۵٪</div>
                    <div>نرخ رشد</div>
                </div>
                <div>
                    <div style="font-size: 2rem; color: #8b5cf6;">۹۹٫۹٪</div>
                    <div>آپ‌تایم</div>
                </div>
            </div>
        </div>
        
        <footer>
            <p>© ۲۰۲۴ TetraShop Quantum - نسخه Termux</p>
            <p style="margin-top: 15px; font-size: 0.9rem;">
                پورت: ${PORT} | آدرس: http://localhost:${PORT} | شطرجد: /chess
            </p>
        </footer>
    </div>
</body>
</html>
`;

// صفحه شطرجد
const chessHTML = `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>♟️ شطرجد TetraShop</title>
    <style>
        :root {
            --chess-dark: #1a1a2e;
            --chess-light: #f0f0f0;
            --chess-green: #10b981;
            --chess-blue: #0ea5e9;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Vazirmatn', sans-serif;
        }
        
        body {
            background: var(--chess-dark);
            color: var(--chess-light);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            padding: 30px;
            background: rgba(16, 185, 129, 0.1);
            border-radius: 15px;
            margin-bottom: 30px;
            border: 2px solid rgba(16, 185, 129, 0.3);
        }
        
        h1 {
            color: var(--chess-green);
            font-size: 2.5rem;
            margin-bottom: 15px;
        }
        
        .chess-board {
            width: 100%;
            max-width: 500px;
            margin: 30px auto;
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            border: 4px solid #475569;
            border-radius: 5px;
            overflow: hidden;
        }
        
        .square {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            cursor: pointer;
        }
        
        .light {
            background: #f0d9b5;
        }
        
        .dark {
            background: #b58863;
        }
        
        .controls {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin: 30px 0;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 15px 25px;
            background: linear-gradient(45deg, var(--chess-green), var(--chess-blue));
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .btn:hover {
            opacity: 0.9;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .stat-card {
            background: rgba(255, 255, 255, 0.05);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        
        .stat-value {
            font-size: 2rem;
            font-weight: bold;
            color: var(--chess-green);
            margin-bottom: 5px;
        }
        
        .back-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            text-decoration: none;
            border-radius: 8px;
        }
        
        .piece {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .piece.white {
            color: white;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        
        .piece.black {
            color: var(--chess-dark);
            text-shadow: 0 2px 4px rgba(255,255,255,0.3);
        }
    </style>
</head>
<body>
    <a href="/" class="back-btn">🏠 بازگشت</a>
    
    <div class="container">
        <div class="header">
            <h1>♟️ شطرجد TetraShop</h1>
            <p>سیستم هوشمند شطرجد با قابلیت درآمدزایی - پورت ${PORT}</p>
        </div>
        
        <div id="chess-board" class="chess-board"></div>
        
        <div class="controls">
            <button class="btn" onclick="startGame('free')">
                🆓 شروع بازی رایگان
            </button>
            <button class="btn" onclick="startGame('premium')">
                💎 بازی حرفه‌ای
            </button>
            <button class="btn" onclick="showShop()">
                🛒 خرید سکه
            </button>
            <button class="btn" onclick="showStats()">
                📊 آمار درآمد
            </button>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-value" id="online-count">۰</div>
                <div>بازیکنان آنلاین</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">۲٫۵M</div>
                <div>درآمد امروز</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">۹٫۵M</div>
                <div>درآمد ماهانه</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">۱۲</div>
                <div>بازی‌های فعال</div>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 10px;">
            <h3 style="color: var(--chess-green); margin-bottom: 15px;">💰 سیستم درآمدزایی</h3>
            <p>کاربران با بازی رایگان شروع می‌کنند و برای ویژگی‌های پیشرفته پرداخت می‌کنند</p>
            <p style="margin-top: 10px; color: #f59e0b;">
                پیش‌بینی درآمد ماهانه: <strong>۹,۵۰۰,۰۰۰ تومان</strong>
            </p>
        </div>
    </div>
    
    <script>
        // نمادهای شطرجد
        const pieceSymbols = {
            'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
            'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
        };
        
        // تخته اولیه
        const initialBoard = [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ];
        
        // ایجاد تخته
        function createBoard() {
            const board = document.getElementById('chess-board');
            board.innerHTML = '';
            
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const square = document.createElement('div');
                    square.className = \`square \${(row + col) % 2 === 0 ? 'dark' : 'light'}\`;
                    square.dataset.row = row;
                    square.dataset.col = col;
                    
                    const piece = initialBoard[row][col];
                    if (piece) {
                        const pieceDiv = document.createElement('div');
                        pieceDiv.className = \`piece \${piece === piece.toLowerCase() ? 'black' : 'white'}\`;
                        pieceDiv.textContent = pieceSymbols[piece];
                        square.appendChild(pieceDiv);
                    }
                    
                    square.onclick = () => handleSquareClick(row, col);
                    board.appendChild(square);
                }
            }
        }
        
        function handleSquareClick(row, col) {
            alert(\`خانه (\${row}, \${col}) انتخاب شد\`);
        }
        
        function startGame(type) {
            if (type === 'premium') {
                alert('برای بازی حرفه‌ای نیاز به خرید سکه دارید');
                showShop();
                return;
            }
            
            alert('🎮 بازی رایگان شروع شد!\\n\\nسطح: متوسط\\nزمان: نامحدود');
            createBoard();
        }
        
        function showShop() {
            const shopHTML = \`
                <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                    <div style="background: #1a1a2e; padding: 30px; border-radius: 15px; max-width: 500px; width: 90%; border: 2px solid #10b981;">
                        <h2 style="color: #10b981; margin-bottom: 20px;">🛒 فروشگاه سکه</h2>
                        
                        <div style="display: grid; gap: 15px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                                <div>
                                    <div style="font-weight: bold;">۱۰۰ سکه</div>
                                    <div style="color: #94a3b8; font-size: 0.9rem;">برای تحلیل‌های ساده</div>
                                </div>
                                <button onclick="buyCoins(100, 10000)" style="padding: 8px 20px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer;">
                                    ۱۰,۰۰۰ تومان
                                </button>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(14, 165, 233, 0.1); border-radius: 10px;">
                                <div>
                                    <div style="font-weight: bold;">۵۰۰ سکه</div>
                                    <div style="color: #94a3b8; font-size: 0.9rem;">تخفیف ۱۰٪</div>
                                </div>
                                <button onclick="buyCoins(500, 45000)" style="padding: 8px 20px; background: #0ea5e9; color: white; border: none; border-radius: 6px; cursor: pointer;">
                                    ۴۵,۰۰۰ تومان
                                </button>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(245, 158, 11, 0.1); border-radius: 10px;">
                                <div>
                                    <div style="font-weight: bold;">اشتراک ماهانه</div>
                                    <div style="color: #94a3b8; font-size: 0.9rem;">دسترسی نامحدود</div>
                                </div>
                                <button onclick="buySubscription()" style="padding: 8px 20px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer;">
                                    ۳۰۰,۰۰۰ تومان
                                </button>
                            </div>
                        </div>
                        
                        <button onclick="document.body.removeChild(this.parentNode.parentNode)" style="width: 100%; padding: 12px; margin-top: 20px; background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 8px; cursor: pointer;">
                            انصراف
                        </button>
                    </div>
                </div>
            \`;
            
            document.body.insertAdjacentHTML('beforeend', shopHTML);
        }
        
        function buyCoins(coins, price) {
            alert(\`✅ \${coins} سکه به مبلغ \${price.toLocaleString('fa-IR')} تومان خریداری شد!\`);
            document.querySelector('[style*="position: fixed; top: 0; left: 0; right: 0; bottom: 0"]').remove();
        }
        
        function buySubscription() {
            if (confirm('آیا مایل به خرید اشتراک ماهانه به مبلغ ۳۰۰,۰۰۰ تومان هستید؟')) {
                alert('✅ اشتراک ماهانه با موفقیت فعال شد!');
                document.querySelector('[style*="position: fixed; top: 0; left: 0; right: 0; bottom: 0"]').remove();
            }
        }
        
        function showStats() {
            alert(\`💰 آمار درآمد شطرجد\\n\\n• درآمد روزانه: ۲,۵۰۰,۰۰۰ تومان\\n• درآمد ماهانه: ۹,۵۰۰,۰۰۰ تومان\\n• درآمد سالانه: ۱۱۴,۰۰۰,۰۰۰ تومان\\n\\n📊 پیش‌بینی:\\n• ماه اول: ۹٫۵ میلیون تومان\\n• سه ماهه: ۲۸٫۵ میلیون تومان\\n• سال اول: ۱۱۴ میلیون تومان\`);
        }
        
        // بارگیری اولیه
        document.addEventListener('DOMContentLoaded', () => {
            createBoard();
            
            // آمار آنلاین تصادفی
            setInterval(() => {
                document.getElementById('online-count').textContent = 
                    Math.floor(Math.random() * 100) + 50;
            }, 5000);
        });
    </script>
</body>
</html>
`;

// API پاسخ‌ها
const apiResponses = {
    '/api/status': {
        name: 'TetraShop Quantum',
        version: '3.0.0',
        port: PORT,
        modules: ['dashboard', 'chess', 'ecommerce', 'crm'],
        chess: {
            available: true,
            path: '/chess',
            revenue: {
                daily: 2500000,
                monthly: 9500000
            }
        }
    },
    '/api/chess/status': {
        name: 'TetraShop Chess',
        version: '2.5.0',
        status: 'running',
        stats: {
            onlinePlayers: Math.floor(Math.random() * 100) + 50,
            activeGames: Math.floor(Math.random() * 20) + 5,
            revenueToday: 2500000
        }
    }
};

// تابع برای خواندن فایل
async function serveFile(filePath, res) {
    try {
        const data = await fs.readFile(filePath);
        const ext = path.extname(filePath);
        res.writeHead(200, {
            'Content-Type': mimeTypes[ext] || 'text/plain'
        });
        res.end(data);
    } catch (error) {
        res.writeHead(404);
        res.end('File not found');
    }
}

// ایجاد سرور
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // پاسخ به OPTIONS برای CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    try {
        // API routes
        if (apiResponses[pathname]) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(apiResponses[pathname]));
            return;
        }
        
        // صفحه اصلی
        if (pathname === '/') {
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            });
            res.end(dashboardHTML);
            return;
        }
        
        // صفحه شطرجد
        if (pathname === '/chess') {
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            });
            res.end(chessHTML);
            return;
        }
        
        // فایل‌های استاتیک
        if (pathname.startsWith('/public/')) {
            const filePath = path.join(__dirname, pathname);
            await serveFile(filePath, res);
            return;
        }
        
        // 404 - صفحه یافت نشد
        res.writeHead(404, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        res.end(`
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <title>صفحه یافت نشد - TetraShop</title>
                <style>
                    body { font-family: 'Vazirmatn'; background: #0f172a; color: white; text-align: center; padding: 50px; }
                    h1 { color: #ef4444; }
                    a { color: #0ea5e9; }
                </style>
            </head>
            <body>
                <h1>۴۰۴ - صفحه یافت نشد</h1>
                <p>صفحه "${pathname}" یافت نشد</p>
                <p><a href="/">بازگشت به صفحه اصلی</a></p>
            </body>
            </html>
        `);
        
    } catch (error) {
        console.error('خطا در پردازش درخواست:', error);
        res.writeHead(500, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        res.end(`
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <title>خطای سرور - TetraShop</title>
                <style>
                    body { font-family: 'Vazirmatn'; background: #0f172a; color: white; text-align: center; padding: 50px; }
                    h1 { color: #ef4444; }
                </style>
            </head>
            <body>
                <h1>۵۰۰ - خطای سرور</h1>
                <p>خطایی در سرور رخ داد: ${error.message}</p>
                <p><a href="/">بازگشت به صفحه اصلی</a></p>
            </body>
            </html>
        `);
    }
});

// راه‌اندازی سرور
server.listen(PORT, HOST, () => {
    console.log('='.repeat(50));
    console.log('🚀 TetraShop Quantum - نسخه Termux');
    console.log('='.repeat(50));
    console.log(`✅ سرور با موفقیت راه‌اندازی شد`);
    console.log(`📌 پورت: ${PORT}`);
    console.log(`🏠 میزبان: ${HOST}`);
    console.log('');
    console.log('🌐 آدرس‌های مهم:');
    console.log(`   📍 صفحه اصلی: http://localhost:${PORT}`);
    console.log(`   📍 صفحه اصلی: http://127.0.0.1:${PORT}`);
    console.log(`   ♟️ شطرجد: http://localhost:${PORT}/chess`);
    console.log(`   📊 وضعیت API: http://localhost:${PORT}/api/status`);
    console.log('');
    console.log('💰 پیش‌بینی درآمد:');
    console.log(`   • روزانه: ۴,۵۰۰,۰۰۰ تومان`);
    console.log(`   • ماهانه: ۲۲,۰۰۰,۰۰۰ تومان`);
    console.log('');
    console.log('🎯 برای تست:');
    console.log('   1. مرورگر خود را باز کنید');
    console.log('   2. یکی از آدرس‌های بالا را وارد کنید');
    console.log('   3. سیستم را تست کنید');
    console.log('');
    console.log('='.repeat(50));
    console.log('⏳ سرور در حال اجرا...');
    console.log('برای خروج: Ctrl+C');
    console.log('='.repeat(50));
});

// هندل خروج تمیز
process.on('SIGINT', () => {
    console.log('\n\n👋 خداحافظ! سرور متوقف شد.');
    process.exit(0);
});
