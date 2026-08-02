/**
 * سیستم درآمدزایی شطرجد TetraShop - نسخه سرور
 * استفاده از فایل‌های JSON برای ذخیره داده‌ها
 */

const fs = require('fs');
const path = require('path');

class PaymentSystemFixed {
    constructor() {
        this.dataDir = path.join(__dirname, '../../data');
        this.transactionsFile = path.join(this.dataDir, 'transactions.json');
        this.productsFile = path.join(this.dataDir, 'products.json');
        
        // ایجاد دایرکتوری داده اگر وجود نداشت
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
        
        // ایجاد فایل‌های داده اگر وجود نداشتند
        if (!fs.existsSync(this.transactionsFile)) {
            fs.writeFileSync(this.transactionsFile, JSON.stringify([], null, 2));
        }
        
        if (!fs.existsSync(this.productsFile)) {
            const defaultProducts = {
                coins: [
                    { id: 'coin_100', name: '۱۰۰ سکه', price: 10000, coins: 100 },
                    { id: 'coin_500', name: '۵۰۰ سکه', price: 45000, coins: 500, discount: '۱۰٪' },
                    { id: 'coin_1000', name: '۱۰۰۰ سکه', price: 80000, coins: 1000, discount: '۲۰٪' },
                    { id: 'coin_5000', name: '۵۰۰۰ سکه', price: 350000, coins: 5000, discount: '۳۰٪' }
                ],
                subscriptions: [
                    { id: 'sub_basic', name: 'اشتراک پایه', price: 50000, duration: 30, features: ['سطح متوسط', 'تحلیل ساده'] },
                    { id: 'sub_pro', name: 'اشتراک حرفه‌ای', price: 150000, duration: 30, features: ['تمام سطوح', 'تحلیل عمیق', 'آموزش ویژه'] },
                    { id: 'sub_premium', name: 'اشتراک پریمیوم', price: 300000, duration: 30, features: ['همه ویژگی‌ها', 'پشتیبانی ویژه', 'تورنمنت'] }
                ],
                features: [
                    { id: 'deep_analysis', name: 'تحلیل عمیق', price: 5000, coins: 50 },
                    { id: 'master_level', name: 'بازی با سطح استاد', price: 10000, coins: 100 },
                    { id: 'opening_book', name: 'کتاب افتتاحیه کامل', price: 20000, coins: 200 },
                    { id: 'video_lessons', name: 'دوره آموزشی', price: 50000, coins: 500 }
                ]
            };
            fs.writeFileSync(this.productsFile, JSON.stringify(defaultProducts, null, 2));
        }
        
        this.transactions = this.loadTransactions();
        this.products = this.loadProducts();
    }
    
    /**
     * بارگذاری تراکنش‌ها از فایل
     */
    loadTransactions() {
        try {
            const data = fs.readFileSync(this.transactionsFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('خطا در بارگذاری تراکنش‌ها:', error.message);
            return [];
        }
    }
    
    /**
     * بارگذاری محصولات از فایل
     */
    loadProducts() {
        try {
            const data = fs.readFileSync(this.productsFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('خطا در بارگذاری محصولات:', error.message);
            return this.getDefaultProducts();
        }
    }
    
    /**
     * ذخیره تراکنش‌ها در فایل
     */
    saveTransactions() {
        try {
            fs.writeFileSync(this.transactionsFile, JSON.stringify(this.transactions, null, 2));
        } catch (error) {
            console.error('خطا در ذخیره تراکنش‌ها:', error.message);
        }
    }
    
    /**
     * محصولات پیش‌فرض
     */
    getDefaultProducts() {
        return {
            coins: [
                { id: 'coin_100', name: '۱۰۰ سکه', price: 10000, coins: 100 },
                { id: 'coin_500', name: '۵۰۰ سکه', price: 45000, coins: 500, discount: '۱۰٪' },
                { id: 'coin_1000', name: '۱۰۰۰ سکه', price: 80000, coins: 1000, discount: '۲۰٪' },
                { id: 'coin_5000', name: '۵۰۰۰ سکه', price: 350000, coins: 5000, discount: '۳۰٪' }
            ],
            subscriptions: [
                { id: 'sub_basic', name: 'اشتراک پایه', price: 50000, duration: 30, features: ['سطح متوسط', 'تحلیل ساده'] },
                { id: 'sub_pro', name: 'اشتراک حرفه‌ای', price: 150000, duration: 30, features: ['تمام سطوح', 'تحلیل عمیق', 'آموزش ویژه'] },
                { id: 'sub_premium', name: 'اشتراک پریمیوم', price: 300000, duration: 30, features: ['همه ویژگی‌ها', 'پشتیبانی ویژه', 'تورنمنت'] }
            ],
            features: [
                { id: 'deep_analysis', name: 'تحلیل عمیق', price: 5000, coins: 50 },
                { id: 'master_level', name: 'بازی با سطح استاد', price: 10000, coins: 100 },
                { id: 'opening_book', name: 'کتاب افتتاحیه کامل', price: 20000, coins: 200 },
                { id: 'video_lessons', name: 'دوره آموزشی', price: 50000, coins: 500 }
            ]
        };
    }
    
    /**
     * خرید سکه
     */
    async buyCoins(productId, userId) {
        const product = this.products.coins.find(p => p.id === productId);
        if (!product) {
            throw new Error('محصول یافت نشد');
        }
        
        // شبیه‌سازی پرداخت
        const paymentResult = await this.processPayment(product.price, userId);
        
        if (paymentResult.success) {
            // ثبت تراکنش
            const transaction = {
                id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId: userId,
                type: 'coin_purchase',
                product: product.name,
                amount: product.price,
                coins: product.coins,
                timestamp: new Date().toISOString(),
                status: 'completed'
            };
            
            this.transactions.push(transaction);
            this.saveTransactions();
            
            return {
                success: true,
                transaction: transaction,
                message: `✅ ${product.coins.toLocaleString('fa-IR')} سکه با موفقیت خریداری شد!`
            };
        }
        
        return paymentResult;
    }
    
    /**
     * خرید اشتراک
     */
    async buySubscription(productId, userId) {
        const product = this.products.subscriptions.find(p => p.id === productId);
        if (!product) {
            throw new Error('اشتراک یافت نشد');
        }
        
        // شبیه‌سازی پرداخت
        const paymentResult = await this.processPayment(product.price, userId);
        
        if (paymentResult.success) {
            // ثبت تراکنش
            const transaction = {
                id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId: userId,
                type: 'subscription',
                product: product.name,
                amount: product.price,
                duration: product.duration,
                expiresAt: new Date(Date.now() + product.duration * 24 * 60 * 60 * 1000),
                timestamp: new Date().toISOString(),
                status: 'active'
            };
            
            this.transactions.push(transaction);
            this.saveTransactions();
            
            return {
                success: true,
                transaction: transaction,
                message: `✅ اشتراک ${product.name} با موفقیت فعال شد!`
            };
        }
        
        return paymentResult;
    }
    
    /**
     * پردازش پرداخت (شبیه‌سازی)
     */
    async processPayment(amount, userId) {
        return new Promise(resolve => {
            setTimeout(() => {
                // شبیه‌سازی پرداخت موفق
                const success = Math.random() > 0.1; // 90% موفقیت
                
                if (success) {
                    resolve({
                        success: true,
                        transactionId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        amount: amount,
                        message: 'پرداخت با موفقیت انجام شد'
                    });
                } else {
                    resolve({
                        success: false,
                        error: 'پرداخت ناموفق بود. لطفاً مجدداً تلاش کنید.',
                        code: 'PAYMENT_FAILED'
                    });
                }
            }, 1000);
        });
    }
    
    /**
     * بررسی وضعیت اشتراک کاربر
     */
    checkSubscription(userId) {
        const userSubs = this.transactions.filter(t => 
            t.userId === userId && 
            t.type === 'subscription' && 
            t.status === 'active'
        );
        
        if (userSubs.length === 0) {
            return { hasSubscription: false };
        }
        
        // جدیدترین اشتراک
        const latestSub = userSubs.sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        )[0];
        
        const isExpired = new Date(latestSub.expiresAt) < new Date();
        
        return {
            hasSubscription: !isExpired,
            subscription: latestSub,
            isExpired: isExpired,
            daysLeft: isExpired ? 0 : Math.ceil((new Date(latestSub.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))
        };
    }
    
    /**
     * دریافت تراکنش‌های کاربر
     */
    getUserTransactions(userId, limit = 10) {
        return this.transactions
            .filter(t => t.userId === userId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }
    
    /**
     * دریافت آمار فروش
     */
    getSalesStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        const todaySales = this.transactions.filter(t => 
            new Date(t.timestamp) >= today && t.status === 'completed'
        );
        
        const weekSales = this.transactions.filter(t => 
            new Date(t.timestamp) >= lastWeek && t.status === 'completed'
        );
        
        return {
            totalTransactions: this.transactions.length,
            today: {
                count: todaySales.length,
                revenue: todaySales.reduce((sum, t) => sum + t.amount, 0)
            },
            lastWeek: {
                count: weekSales.length,
                revenue: weekSales.reduce((sum, t) => sum + t.amount, 0)
            },
            byType: {
                coins: this.transactions.filter(t => t.type === 'coin_purchase').length,
                subscriptions: this.transactions.filter(t => t.type === 'subscription').length,
                features: this.transactions.filter(t => t.type === 'feature').length
            }
        };
    }
    
    /**
     * دریافت لیست محصولات
     */
    getProductList() {
        return this.products;
    }
    
    /**
     * بررسی موجودی سکه کاربر
     */
    getUserCoins(userId) {
        const coinTransactions = this.transactions.filter(t => 
            t.userId === userId && 
            t.type === 'coin_purchase' && 
            t.status === 'completed'
        );
        
        const spentTransactions = this.transactions.filter(t => 
            t.userId === userId && 
            t.type === 'feature' && 
            t.status === 'activated'
        );
        
        const totalCoins = coinTransactions.reduce((sum, t) => sum + t.coins, 0);
        const spentCoins = spentTransactions.reduce((sum, t) => sum + t.coins, 0);
        
        return {
            total: totalCoins,
            spent: spentCoins,
            remaining: totalCoins - spentCoins
        };
    }
    
    /**
     * اعتبارسنجی دسترسی کاربر به ویژگی
     */
    validateAccess(userId, featureId) {
        const userSub = this.checkSubscription(userId);
        const userCoins = this.getUserCoins(userId);
        
        // اگر اشتراک پریمیوم دارد، به همه چیز دسترسی دارد
        if (userSub.hasSubscription && userSub.subscription.product.includes('پریمیوم')) {
            return { hasAccess: true, reason: 'اشتراک پریمیوم' };
        }
        
        // بررسی ویژگی‌های خریداری شده
        const purchasedFeatures = this.transactions.filter(t => 
            t.userId === userId && 
            t.type === 'feature' && 
            t.status === 'activated' &&
            t.product.includes(featureId)
        );
        
        if (purchasedFeatures.length > 0) {
            return { hasAccess: true, reason: 'خریداری شده' };
        }
        
        // بررسی سکه‌ها برای خرید آنی
        const feature = this.products.features.find(f => f.id === featureId);
        if (feature && userCoins.remaining >= feature.coins) {
            return { 
                hasAccess: false, 
                canBuy: true, 
                price: feature.price, 
                coins: feature.coins,
                message: `برای دسترسی به این ویژگی نیاز به ${feature.coins} سکه دارید.`
            };
        }
        
        return { 
            hasAccess: false, 
            canBuy: false,
            message: 'برای دسترسی به این ویژگی باید سکه خریداری کنید یا اشتراک بگیرید.'
        };
    }
}

module.exports = PaymentSystemFixed;
