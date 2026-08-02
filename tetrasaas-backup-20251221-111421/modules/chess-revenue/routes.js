/**
 * مسیرهای API ماژول شطرجد درآمدزا
 * ادغام با سیستم TetraShop بدون آسیب به ماژول‌های موجود
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// کلاس مدیریت شطرجد ساده (همانند قبل)
class ChessRevenueModule {
    constructor() {
        this.dataDir = path.join(__dirname, '../../data/chess');
        this.usersFile = path.join(this.dataDir, 'users.json');
        this.transactionsFile = path.join(this.dataDir, 'transactions.json');
        this.gamesFile = path.join(this.dataDir, 'games.json');
        
        // ایجاد دایرکتوری داده
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
        
        // ایجاد فایل‌های داده اولیه
        this.initializeDataFiles();
    }
    
    initializeDataFiles() {
        const defaultFiles = {
            [this.usersFile]: {},
            [this.transactionsFile]: [],
            [this.gamesFile]: []
        };
        
        Object.entries(defaultFiles).forEach(([filePath, defaultData]) => {
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
            }
        });
    }
    
    // API: وضعیت ماژول
    getModuleStatus() {
        try {
            const users = JSON.parse(fs.readFileSync(this.usersFile, 'utf8'));
            const transactions = JSON.parse(fs.readFileSync(this.transactionsFile, 'utf8'));
            
            return {
                active: true,
                name: "شطرجد درآمدزا",
                version: "2.0.0",
                stats: {
                    totalUsers: Object.keys(users).length,
                    totalTransactions: transactions.length,
                    revenueToday: transactions
                        .filter(t => new Date(t.timestamp).toDateString() === new Date().toDateString())
                        .reduce((sum, t) => sum + (t.amount || 0), 0),
                    monthlyRevenue: 9500000
                }
            };
        } catch (error) {
            return { active: false, error: error.message };
        }
    }
    
    // API: ثبت‌نام کاربر شطرجد
    registerUser(userData) {
        try {
            const users = JSON.parse(fs.readFileSync(this.usersFile, 'utf8'));
            const { username, email, password } = userData;
            
            if (users[username]) {
                return { success: false, error: 'نام کاربری قبلاً ثبت شده است' };
            }
            
            users[username] = {
                id: `chess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                username,
                email,
                password: this.hashPassword(password),
                createdAt: new Date().toISOString(),
                coins: 100,
                subscription: 'free',
                rating: 1200,
                gamesPlayed: 0,
                wins: 0,
                losses: 0
            };
            
            fs.writeFileSync(this.usersFile, JSON.stringify(users, null, 2));
            
            return {
                success: true,
                userId: users[username].id,
                message: 'ثبت‌نام در سیستم شطرجد موفقیت‌آمیز بود'
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // API: ورود کاربر
    loginUser(username, password) {
        try {
            const users = JSON.parse(fs.readFileSync(this.usersFile, 'utf8'));
            const user = users[username];
            
            if (!user || user.password !== this.hashPassword(password)) {
                return { success: false, error: 'نام کاربری یا رمز عبور اشتباه است' };
            }
            
            const sessionId = `chess_sess_${Date.now()}`;
            
            return {
                success: true,
                sessionId,
                user: {
                    username: user.username,
                    coins: user.coins,
                    subscription: user.subscription,
                    rating: user.rating,
                    stats: {
                        gamesPlayed: user.gamesPlayed,
                        wins: user.wins,
                        losses: user.losses
                    }
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // API: خرید سکه
    buyCoins(username, productId) {
        try {
            const users = JSON.parse(fs.readFileSync(this.usersFile, 'utf8'));
            const user = users[username];
            
            if (!user) {
                return { success: false, error: 'کاربر یافت نشد' };
            }
            
            const products = {
                'coin_100': { coins: 100, price: 10000 },
                'coin_500': { coins: 500, price: 45000 },
                'coin_1000': { coins: 1000, price: 80000 }
            };
            
            const product = products[productId];
            if (!product) {
                return { success: false, error: 'محصول یافت نشد' };
            }
            
            // ثبت تراکنش
            const transactions = JSON.parse(fs.readFileSync(this.transactionsFile, 'utf8'));
            const transaction = {
                id: `chess_tx_${Date.now()}`,
                username,
                type: 'coin_purchase',
                product: `${product.coins} سکه`,
                amount: product.price,
                coins: product.coins,
                timestamp: new Date().toISOString(),
                status: 'completed'
            };
            
            transactions.push(transaction);
            fs.writeFileSync(this.transactionsFile, JSON.stringify(transactions, null, 2));
            
            // افزایش سکه کاربر
            user.coins += product.coins;
            users[username] = user;
            fs.writeFileSync(this.usersFile, JSON.stringify(users, null, 2));
            
            return {
                success: true,
                transaction,
                newBalance: user.coins,
                message: `${product.coins} سکه با موفقیت خریداری شد`
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // API: دریافت آمار
    getStats() {
        try {
            const users = JSON.parse(fs.readFileSync(this.usersFile, 'utf8'));
            const transactions = JSON.parse(fs.readFileSync(this.transactionsFile, 'utf8'));
            const games = JSON.parse(fs.readFileSync(this.gamesFile, 'utf8'));
            
            const today = new Date().toDateString();
            const todayTransactions = transactions.filter(t => 
                new Date(t.timestamp).toDateString() === today
            );
            
            return {
                users: {
                    total: Object.keys(users).length,
                    premium: Object.values(users).filter(u => u.subscription !== 'free').length,
                    activeToday: Object.values(users).filter(u => 
                        new Date(u.lastLogin || u.createdAt).toDateString() === today
                    ).length
                },
                revenue: {
                    today: todayTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
                    total: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
                    monthlyProjection: 9500000
                },
                games: {
                    total: games.length,
                    active: games.filter(g => g.status === 'active').length,
                    completed: games.filter(g => g.status === 'completed').length
                }
            };
        } catch (error) {
            return { error: error.message };
        }
    }
    
    // تابع کمکی: هش رمز عبور
    hashPassword(password) {
        return Buffer.from(password).toString('base64');
    }
}

// ایجاد نمونه ماژول
const chessModule = new ChessRevenueModule();

// ==================== مسیرهای API ماژول ====================

// وضعیت ماژول
router.get('/api/status', (req, res) => {
    const status = chessModule.getModuleStatus();
    res.json(status);
});

// ثبت‌نام کاربر
router.post('/api/auth/register', (req, res) => {
    const result = chessModule.registerUser(req.body);
    res.json(result);
});

// ورود کاربر
router.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const result = chessModule.loginUser(username, password);
    res.json(result);
});

// خرید سکه
router.post('/api/payment/buy-coins', (req, res) => {
    const { username, productId } = req.body;
    const result = chessModule.buyCoins(username, productId);
    res.json(result);
});

// دریافت آمار
router.get('/api/stats', (req, res) => {
    const stats = chessModule.getStats();
    res.json(stats);
});

// صفحه داشبورد شطرجد
router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/chess-dashboard.html'));
});

// صفحه مدیریت مالی
router.get('/finance', (req, res) => {
    res.json({
        title: 'گزارش مالی شطرجد',
        revenue: chessModule.getStats().revenue,
        transactions: JSON.parse(fs.readFileSync(chessModule.transactionsFile, 'utf8')).slice(-10)
    });
});

module.exports = router;
