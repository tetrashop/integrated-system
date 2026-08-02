/**
 * سرور یکپارچه شطرجد TetraShop با سیستم درآمدزایی
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const ChessEngine = require('./engine/ChessEngine');
const PaymentSystem = require('../payment/payment-system');
const UserManager = require('../user-management/UserManager');

const app = express();
const PORT = process.env.PORT || 7666;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// سیستم‌های یکپارچه
const engine = new ChessEngine();
const paymentSystem = new PaymentSystem();
const userManager = new UserManager();

// Middleware اعتبارسنجی کاربر
const authenticate = (req, res, next) => {
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;
    
    if (!sessionId) {
        return res.status(401).json({ 
            error: 'نیاز به ورود به سیستم دارید',
            loginRequired: true 
        });
    }
    
    const validation = userManager.validateSession(sessionId);
    
    if (!validation.valid) {
        return res.status(401).json({ 
            error: validation.reason,
            loginRequired: true 
        });
    }
    
    req.user = validation.user;
    req.sessionId = sessionId;
    next();
};

// Middleware بررسی دسترسی پولی
const checkPremiumAccess = (feature) => (req, res, next) => {
    const validation = paymentSystem.validateAccess(req.user.id, feature);
    
    if (validation.hasAccess) {
        next();
    } else {
        res.status(403).json({
            error: 'دسترسی محدود',
            message: validation.message,
            canBuy: validation.canBuy,
            price: validation.price,
            coins: validation.coins,
            redirect: '/premium'
        });
    }
};

// ==================== مسیرهای عمومی ====================

// صفحه اصلی
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API وضعیت
app.get('/api/status', (req, res) => {
    const stats = userManager.getSystemStats();
    
    res.json({
        name: 'TetraShop Chess Integrated',
        version: '2.0.0',
        status: 'running',
        port: PORT,
        mode: 'integrated',
        stats: stats,
        timestamp: new Date().toISOString()
    });
});

// ==================== مسیرهای کاربری ====================

// ثبت نام
app.post('/api/auth/register', (req, res) => {
    try {
        const result = userManager.register(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ورود
app.post('/api/auth/login', (req, res) => {
    try {
        const { identifier, password } = req.body;
        const result = userManager.login(identifier, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// خروج
app.post('/api/auth/logout', authenticate, (req, res) => {
    const result = userManager.logout(req.sessionId);
    res.json(result);
});

// اطلاعات کاربر
app.get('/api/user/profile', authenticate, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

// ==================== مسیرهای شطرجد رایگان ====================

// شروع بازی رایگان
app.post('/api/game/free', authenticate, (req, res) => {
    const { difficulty = 'intermediate' } = req.body;
    
    const game = {
        id: `game_${Date.now()}`,
        playerId: req.user.id,
        difficulty: difficulty,
        mode: 'free',
        createdAt: new Date().toISOString(),
        moves: [],
        status: 'active'
    };
    
    res.json({
        success: true,
        game: game,
        message: 'بازی رایگان شروع شد'
    });
});

// حرکت موتور (رایگان - سطح محدود)
app.get('/api/engine/free-move', authenticate, (req, res) => {
    const { fen, level = 'intermediate' } = req.query;
    
    if (!fen) {
        return res.status(400).json({ error: 'پارامتر fen الزامی است' });
    }
    
    // محدودیت برای کاربران رایگان
    const allowedLevels = ['beginner', 'intermediate'];
    if (!allowedLevels.includes(level)) {
        return res.status(403).json({ 
            error: 'این سطح فقط برای کاربران پریمیوم در دسترس است',
            upgradeRequired: true 
        });
    }
    
    const depth = level === 'beginner' ? 3 : 6;
    
    try {
        const result = engine.getBestMove(fen, depth);
        
        res.json({
            success: true,
            move: engine.moveToUCI(result.move),
            evaluation: result.evaluation,
            depth: result.depth,
            free: true,
            limits: {
                remainingFreeMoves: 50, // حرکات رایگان باقی‌مانده
                maxDepth: 6
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== مسیرهای شطرجد پولی ====================

// شروع بازی حرفه‌ای
app.post('/api/game/premium', authenticate, checkPremiumAccess('master_level'), (req, res) => {
    const { difficulty = 'expert', timeControl } = req.body;
    
    const game = {
        id: `premium_${Date.now()}`,
        playerId: req.user.id,
        difficulty: difficulty,
        mode: 'premium',
        timeControl: timeControl || { minutes: 10, increment: 0 },
        createdAt: new Date().toISOString(),
        moves: [],
        status: 'active',
        features: ['deep_analysis', 'all_levels', 'opening_book']
    };
    
    // کسر سکه
    const coins = difficulty === 'expert' ? 50 : 30;
    paymentSystem.manageCoins(req.user.id, coins, 'subtract', `شروع بازی ${difficulty}`);
    
    res.json({
        success: true,
        game: game,
        coinsDeducted: coins,
        remainingCoins: userManager.manageCoins(req.user.id, 0, 'get').newBalance
    });
});

// حرکت موتور پیشرفته
app.get('/api/engine/premium-move', authenticate, checkPremiumAccess('deep_analysis'), (req, res) => {
    const { fen, level = 'expert', maxDepth = 15 } = req.query;
    
    if (!fen) {
        return res.status(400).json({ error: 'پارامتر fen الزامی است' });
    }
    
    const depth = parseInt(maxDepth);
    const finalDepth = Math.min(depth, 20); // حداکثر عمق ۲۰
    
    try {
        const startTime = Date.now();
        const result = engine.getBestMove(fen, finalDepth);
        const endTime = Date.now();
        
        // هزینه تحلیل
        const cost = Math.ceil(finalDepth / 5) * 10; // 10 سکه برای هر 5 عمق
        paymentSystem.manageCoins(req.user.id, cost, 'subtract', `تحلیل عمق ${finalDepth}`);
        
        res.json({
            success: true,
            move: engine.moveToUCI(result.move),
            evaluation: result.evaluation,
            depth: result.depth,
            time: (endTime - startTime) / 1000,
            cost: cost,
            premium: true,
            analysis: {
                bestLine: result.pv,
                alternatives: engine.analyzePosition(fen, 10).moves
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// تحلیل عمیق
app.post('/api/analyze/deep', authenticate, checkPremiumAccess('deep_analysis'), (req, res) => {
    const { fen, depth = 20 } = req.body;
    
    if (!fen) {
        return res.status(400).json({ error: 'پارامتر fen الزامی است' });
    }
    
    const analysis = engine.analyzePosition(fen, depth);
    
    // هزینه تحلیل
    const cost = Math.ceil(depth / 10) * 50;
    paymentSystem.manageCoins(req.user.id, cost, 'subtract', `تحلیل عمیق ${depth} عمق`);
    
    res.json({
        success: true,
        analysis: analysis,
        cost: cost,
        timestamp: new Date().toISOString()
    });
});

// ==================== مسیرهای پرداخت ====================

// لیست محصولات
app.get('/api/payment/products', authenticate, (req, res) => {
    res.json({
        success: true,
        products: paymentSystem.getProductList()
    });
});

// خرید سکه
app.post('/api/payment/buy-coins', authenticate, (req, res) => {
    const { productId } = req.body;
    
    paymentSystem.buyCoins(productId, req.user.id)
        .then(result => {
            if (result.success) {
                // افزایش سکه کاربر
                const product = paymentSystem.products.coins.find(p => p.id === productId);
                userManager.manageCoins(req.user.id, product.coins, 'add', `خرید ${product.name}`);
            }
            res.json(result);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
});

// خرید اشتراک
app.post('/api/payment/buy-subscription', authenticate, (req, res) => {
    const { productId } = req.body;
    
    paymentSystem.buySubscription(productId, req.user.id)
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
});

// تراکنش‌های کاربر
app.get('/api/payment/transactions', authenticate, (req, res) => {
    const transactions = paymentSystem.getUserTransactions(req.user.id, 20);
    const coins = paymentSystem.getUserCoins(req.user.id);
    
    res.json({
        success: true,
        transactions: transactions,
        coins: coins,
        subscription: paymentSystem.checkSubscription(req.user.id)
    });
});

// ==================== مسیرهای ریتینگ و لیگ ====================

// جدول رده‌بندی
app.get('/api/leaderboard', (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const leaderboard = userManager.getLeaderboard(limit);
    
    res.json({
        success: true,
        leaderboard: leaderboard,
        updatedAt: new Date().toISOString()
    });
});

// ثبت نتیجه بازی
app.post('/api/game/result', authenticate, (req, res) => {
    const { gameId, result, moves, duration } = req.body;
    
    userManager.updateGameStats(req.user.id, {
        result: result,
        moves: moves,
        duration: duration
    });
    
    // پاداش بر اساس نتیجه
    let reward = 0;
    if (result === 'win') reward = 50;
    else if (result === 'draw') reward = 25;
    else reward = 10;
    
    userManager.manageCoins(req.user.id, reward, 'add', `پاداش بازی (${result})`);
    
    res.json({
        success: true,
        reward: reward,
        newRating: userManager.users.get(req.user.id).profile.rating,
        coins: userManager.users.get(req.user.id).profile.coins
    });
});

// ==================== مسیرهای مدیریتی ====================

// آمار سیستم (نیاز به ادمین)
app.get('/api/admin/stats', authenticate, (req, res) => {
    // در واقعیت بررسی سطح دسترسی ادمین
    const userStats = userManager.getSystemStats();
    const paymentStats = paymentSystem.getSalesStats();
    const recentTransactions = paymentSystem.transactions.slice(-20);
    
    res.json({
        success: true,
        userStats: userStats,
        paymentStats: paymentStats,
        recentTransactions: recentTransactions,
        activeGames: 15, // در واقعیت از دیتابیس خوانده می‌شود
        serverLoad: {
            cpu: '45%',
            memory: '68%',
            uptime: process.uptime()
        }
    });
});

// ==================== راه‌اندازی سرور ====================

app.listen(PORT, () => {
    console.log('');
    console.log('='.repeat(70));
    console.log('🚀🚀🚀 شطرجد TetraShop یکپارچه با سیستم درآمدزایی راه‌اندازی شد! 🚀🚀🚀');
    console.log('='.repeat(70));
    console.log('');
    console.log('📊 اطلاعات سیستم:');
    console.log(`├── 🏷️  نام: TetraShop Chess Integrated`);
    console.log(`├── 🚀 نسخه: 2.0.0`);
    console.log(`├── 📍 پورت: ${PORT}`);
    console.log(`├── 💰 حالت: درآمدزایی فعال`);
    console.log(`├── 👤 کاربران: ${userManager.users.size}`);
    console.log(`└── ⏰ زمان: ${new Date().toLocaleString('fa-IR')}`);
    console.log('');
    console.log('🌐 آدرس‌های مهم:');
    console.log(`├── 🏠 صفحه اصلی: http://localhost:${PORT}`);
    console.log(`├── 🎮 بازی رایگان: http://localhost:${PORT}/free`);
    console.log(`├── 💎 بازی حرفه‌ای: http://localhost:${PORT}/premium`);
    console.log(`├── 💳 درگاه پرداخت: http://localhost:${PORT}/payment`);
    console.log(`└── 📊 پنل مدیریت: http://localhost:${PORT}/admin`);
    console.log('');
    console.log('💰 مدل درآمدزایی:');
    console.log('├── 🆓 رایگان: سطح مبتدی و متوسط، تحلیل ساده');
    console.log('├── 💎 اشتراک ماهانه: ۵۰,۰۰۰ تا ۳۰۰,۰۰۰ تومان');
    console.log('├── 🪙 خرید سکه: ۱۰,۰۰۰ تا ۳۵۰,۰۰۰ تومان');
    console.log('└── 🎯 ویژگی‌های تک: ۵,۰۰۰ تا ۵۰,۰۰۰ تومان');
    console.log('');
    console.log('🎯 پیش‌بینی درآمد ماهانه:');
    console.log('├── ۱۰۰ کاربر رایگان');
    console.log('├── ۵۰ کاربر اشتراک پایه (ماهانه ۲,۵۰۰,۰۰۰ تومان)');
    console.log('├── ۲۰ کاربر اشتراک حرفه‌ای (ماهانه ۳,۰۰۰,۰۰۰ تومان)');
    console.log('├── ۱۰ کاربر اشتراک پریمیوم (ماهانه ۳,۰۰۰,۰۰۰ تومان)');
    console.log('├── خرید سکه (ماهانه ۱,۰۰۰,۰۰۰ تومان)');
    console.log(`└── 📈 مجموع: حدود ۹,۵۰۰,۰۰۰ تومان در ماه`);
    console.log('');
    console.log('🚀 برای شروع کسب درآمد:');
    console.log('   1. کاربران در داشبورد اصلی ثبت نام می‌کنند');
    console.log('   2. بازی رایگان را تجربه می‌کنند');
    console.log('   3. برای ویژگی‌های پیشرفته اشتراک می‌خرند');
    console.log('   4. شما درآمد کسب می‌کنید!');
    console.log('');
    console.log('='.repeat(70));
});
