/**
 * سیستم مدیریت کاربران شطرجد TetraShop - نسخه سرور
 */

const fs = require('fs');
const path = require('path');

class UserManagerFixed {
    constructor() {
        this.dataDir = path.join(__dirname, '../../data');
        this.usersFile = path.join(this.dataDir, 'users.json');
        this.sessionsFile = path.join(this.dataDir, 'sessions.json');
        
        // ایجاد دایرکتوری داده اگر وجود نداشت
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
        
        // ایجاد فایل‌های داده اگر وجود نداشتند
        if (!fs.existsSync(this.usersFile)) {
            fs.writeFileSync(this.usersFile, JSON.stringify({}, null, 2));
        }
        
        if (!fs.existsSync(this.sessionsFile)) {
            fs.writeFileSync(this.sessionsFile, JSON.stringify([], null, 2));
        }
        
        this.users = this.loadUsers();
        this.sessions = this.loadSessions();
    }
    
    /**
     * بارگذاری کاربران از فایل
     */
    loadUsers() {
        try {
            const data = fs.readFileSync(this.usersFile, 'utf8');
            return new Map(Object.entries(JSON.parse(data)));
        } catch (error) {
            console.error('خطا در بارگذاری کاربران:', error.message);
            return new Map();
        }
    }
    
    /**
     * بارگذاری نشست‌ها از فایل
     */
    loadSessions() {
        try {
            const data = fs.readFileSync(this.sessionsFile, 'utf8');
            return new Map(JSON.parse(data));
        } catch (error) {
            console.error('خطا در بارگذاری نشست‌ها:', error.message);
            return new Map();
        }
    }
    
    /**
     * ذخیره کاربران در فایل
     */
    saveUsers() {
        try {
            const usersObj = Object.fromEntries(this.users);
            fs.writeFileSync(this.usersFile, JSON.stringify(usersObj, null, 2));
        } catch (error) {
            console.error('خطا در ذخیره کاربران:', error.message);
        }
    }
    
    /**
     * ذخیره نشست‌ها در فایل
     */
    saveSessions() {
        try {
            const sessionsArr = Array.from(this.sessions.entries());
            fs.writeFileSync(this.sessionsFile, JSON.stringify(sessionsArr, null, 2));
        } catch (error) {
            console.error('خطا در ذخیره نشست‌ها:', error.message);
        }
    }
    
    /**
     * ثبت نام کاربر جدید
     */
    async register(userData) {
        const { username, email, password } = userData;
        
        // اعتبارسنجی
        if (!username || !email || !password) {
            throw new Error('تمامی فیلدها الزامی هستند');
        }
        
        if (username.length < 3) {
            throw new Error('نام کاربری باید حداقل ۳ کاراکتر باشد');
        }
        
        if (password.length < 6) {
            throw new Error('رمز عبور باید حداقل ۶ کاراکتر باشد');
        }
        
        // بررسی تکراری نبودن
        if (this.isUsernameTaken(username)) {
            throw new Error('نام کاربری قبلاً ثبت شده است');
        }
        
        if (this.isEmailTaken(email)) {
            throw new Error('ایمیل قبلاً ثبت شده است');
        }
        
        // ایجاد کاربر جدید
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const user = {
            id: userId,
            username,
            email,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            profile: {
                rating: 1200,
                gamesPlayed: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                coins: 100, // سکه رایگان اولیه
                level: 'مبتدی'
            },
            subscription: {
                type: 'free',
                expiresAt: null,
                features: ['basic_analysis', 'beginner_level']
            },
            stats: {
                lastLogin: null,
                totalPlayTime: 0,
                achievements: []
            },
            settings: {
                theme: 'dark',
                language: 'fa',
                sound: true,
                notifications: true
            }
        };
        
        this.users.set(userId, user);
        this.saveUsers();
        
        return {
            success: true,
            userId,
            message: 'ثبت نام با موفقیت انجام شد!'
        };
    }
    
    /**
     * ورود کاربر
     */
    async login(identifier, password) {
        // پیدا کردن کاربر با نام کاربری یا ایمیل
        let user = null;
        
        for (const [id, u] of this.users) {
            if (u.username === identifier || u.email === identifier) {
                user = u;
                break;
            }
        }
        
        if (!user) {
            throw new Error('کاربر یافت نشد');
        }
        
        // بررسی رمز عبور
        if (user.password !== this.hashPassword(password)) {
            throw new Error('رمز عبور اشتباه است');
        }
        
        // ایجاد نشست
        const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 12)}`;
        const session = {
            sessionId,
            userId: user.id,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 روز
            userAgent: 'unknown'
        };
        
        this.sessions.set(sessionId, session);
        this.saveSessions();
        
        // به‌روزرسانی آخرین ورود
        user.stats.lastLogin = new Date().toISOString();
        this.saveUsers();
        
        return {
            success: true,
            sessionId,
            user: this.sanitizeUser(user),
            message: 'ورود موفقیت‌آمیز بود!'
        };
    }
    
    /**
     * خروج کاربر
     */
    logout(sessionId) {
        this.sessions.delete(sessionId);
        this.saveSessions();
        return { success: true, message: 'خروج با موفقیت انجام شد' };
    }
    
    /**
     * بررسی اعتبار نشست
     */
    validateSession(sessionId) {
        const session = this.sessions.get(sessionId);
        
        if (!session) {
            return { valid: false, reason: 'نشست یافت نشد' };
        }
        
        if (new Date(session.expiresAt) < new Date()) {
            this.sessions.delete(sessionId);
            this.saveSessions();
            return { valid: false, reason: 'نشست منقضی شده' };
        }
        
        const user = this.users.get(session.userId);
        if (!user) {
            return { valid: false, reason: 'کاربر یافت نشد' };
        }
        
        return {
            valid: true,
            session,
            user: this.sanitizeUser(user)
        };
    }
    
    /**
     * به‌روزرسانی پروفایل
     */
    updateProfile(userId, updates) {
        const user = this.users.get(userId);
        if (!user) {
            throw new Error('کاربر یافت نشد');
        }
        
        // فیلدهای قابل به‌روزرسانی
        const allowedUpdates = ['settings', 'profile'];
        const updatedUser = { ...user };
        
        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key.split('.')[0])) {
                this.setNestedValue(updatedUser, key, updates[key]);
            }
        });
        
        this.users.set(userId, updatedUser);
        this.saveUsers();
        
        return {
            success: true,
            user: this.sanitizeUser(updatedUser)
        };
    }
    
    /**
     * به‌روزرسانی آمار بازی
     */
    updateGameStats(userId, gameResult) {
        const user = this.users.get(userId);
        if (!user) return;
        
        user.profile.gamesPlayed++;
        
        switch (gameResult.result) {
            case 'win':
                user.profile.wins++;
                user.profile.rating += 20;
                user.profile.coins += 10;
                break;
            case 'loss':
                user.profile.losses++;
                user.profile.rating = Math.max(800, user.profile.rating - 15);
                user.profile.coins += 2;
                break;
            case 'draw':
                user.profile.draws++;
                user.profile.rating += 5;
                user.profile.coins += 5;
                break;
        }
        
        // به‌روزرسانی سطح بر اساس ریتینگ
        if (user.profile.rating >= 2000) user.profile.level = 'استاد';
        else if (user.profile.rating >= 1600) user.profile.level = 'پیشرفته';
        else if (user.profile.rating >= 1400) user.profile.level = 'متوسط';
        else user.profile.level = 'مبتدی';
        
        user.stats.totalPlayTime += gameResult.duration || 0;
        
        this.users.set(userId, user);
        this.saveUsers();
    }
    
    /**
     * مدیریت سکه‌ها
     */
    manageCoins(userId, amount, operation = 'add', reason = '') {
        const user = this.users.get(userId);
        if (!user) {
            throw new Error('کاربر یافت نشد');
        }
        
        switch (operation) {
            case 'add':
                user.profile.coins += amount;
                break;
            case 'subtract':
                if (user.profile.coins < amount) {
                    throw new Error('موجودی سکه کافی نیست');
                }
                user.profile.coins -= amount;
                break;
            case 'set':
                user.profile.coins = amount;
                break;
        }
        
        this.users.set(userId, user);
        this.saveUsers();
        
        return {
            success: true,
            newBalance: user.profile.coins,
            transaction: {
                userId,
                operation,
                amount,
                reason,
                timestamp: new Date().toISOString(),
                balance: user.profile.coins
            }
        };
    }
    
    /**
     * دریافت لیست کاربران بر اساس ریتینگ
     */
    getLeaderboard(limit = 50) {
        return Array.from(this.users.values())
            .filter(user => user.profile.gamesPlayed > 0)
            .sort((a, b) => b.profile.rating - a.profile.rating)
            .slice(0, limit)
            .map(user => ({
                username: user.username,
                rating: user.profile.rating,
                level: user.profile.level,
                gamesPlayed: user.profile.gamesPlayed,
                winRate: user.profile.gamesPlayed > 0 ? 
                    Math.round((user.profile.wins / user.profile.gamesPlayed) * 100) : 0
            }));
    }
    
    /**
     * دریافت آمار سیستم
     */
    getSystemStats() {
        const totalUsers = this.users.size;
        const activeSessions = this.sessions.size;
        
        let totalGames = 0;
        let totalCoins = 0;
        let averageRating = 0;
        
        this.users.forEach(user => {
            totalGames += user.profile.gamesPlayed;
            totalCoins += user.profile.coins;
            averageRating += user.profile.rating;
        });
        
        averageRating = totalUsers > 0 ? Math.round(averageRating / totalUsers) : 0;
        
        return {
            totalUsers,
            activeSessions,
            totalGames,
            totalCoins,
            averageRating,
            onlineUsers: this.getOnlineUsers().length
        };
    }
    
    /**
     * کاربران آنلاین
     */
    getOnlineUsers() {
        const online = [];
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        
        for (const [sessionId, session] of this.sessions) {
            if (new Date(session.createdAt) > oneHourAgo) {
                const user = this.users.get(session.userId);
                if (user) {
                    online.push({
                        username: user.username,
                        lastActive: session.createdAt,
                        rating: user.profile.rating
                    });
                }
            }
        }
        
        return online;
    }
    
    /**
     * جستجوی کاربر
     */
    searchUsers(query, limit = 20) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        
        for (const user of this.users.values()) {
            if (user.username.toLowerCase().includes(lowerQuery) || 
                user.email.toLowerCase().includes(lowerQuery)) {
                results.push(this.sanitizeUser(user));
            }
            
            if (results.length >= limit) break;
        }
        
        return results;
    }
    
    // ---------- توابع کمکی ----------
    
    /**
     * هش کردن رمز عبور (ساده)
     */
    hashPassword(password) {
        // در واقعیت از bcrypt استفاده می‌شود
        return Buffer.from(password).toString('base64').split('').reverse().join('');
    }
    
    /**
     * بررسی نام کاربری تکراری
     */
    isUsernameTaken(username) {
        for (const user of this.users.values()) {
            if (user.username === username) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * بررسی ایمیل تکراری
     */
    isEmailTaken(email) {
        for (const user of this.users.values()) {
            if (user.email === email) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * حذف اطلاعات حساس کاربر
     */
    sanitizeUser(user) {
        const sanitized = { ...user };
        delete sanitized.password;
        delete sanitized.email;
        return sanitized;
    }
    
    /**
     * تنظیم مقدار در آبجکت تودرتو
     */
    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
    }
}

module.exports = UserManagerFixed;
