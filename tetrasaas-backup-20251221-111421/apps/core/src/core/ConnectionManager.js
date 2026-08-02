/**
 * 🔗 مدیریت هوشمند ارتباط - نسخه بهینه شده
 */

class ConnectionManager {
    constructor(config = {}) {
        this.config = {
            baseURL: config.baseURL || 'https://tetrashop100.ramin-edjlal1359.workers.dev',
            retryAttempts: config.retryAttempts || 3,
            cacheTTL: config.cacheTTL || 5 * 60 * 1000,
            ...config
        };

        this.cache = new Map();
        this.isOnline = navigator?.onLine ?? true;
        console.log('🔗 ConnectionManager راه‌اندازی شد');
    }

    async smartFetch(endpoint, options = {}) {
        const cacheKey = this._generateCacheKey(endpoint, options);
        
        // استفاده از کش برای درخواست‌های GET
        if (options.method === 'GET' && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.config.cacheTTL) {
                console.log('📦 استفاده از داده کش شده:', endpoint);
                return cached.data;
            }
        }

        try {
            // شبیه‌سازی درخواست شبکه
            await new Promise(resolve => setTimeout(resolve, 20));
            
            let data;
            if (endpoint.includes('/api/products')) {
                data = {
                    products: [
                        { id: 1, name: 'لپ‌تاپ گیمینگ', price: 25000000, category: 'الکترونیک' },
                        { id: 2, name: 'هدفون بی‌سیم', price: 3500000, category: 'صوتی' },
                        { id: 3, name: 'کتاب برنامه‌نویسی', price: 450000, category: 'کتاب' }
                    ],
                    count: 3,
                    source: 'optimized-cache'
                };
            } else if (endpoint.includes('/api/health')) {
                data = {
                    status: 'healthy',
                    service: 'Tetrashop100',
                    timestamp: new Date().toISOString()
                };
            } else {
                data = { message: 'Endpoint not implemented', endpoint };
            }

            // ذخیره در کش
            if (options.method === 'GET') {
                this.cache.set(cacheKey, {
                    data,
                    timestamp: Date.now()
                });
            }

            return data;

        } catch (error) {
            console.error('❌ خطا در ارتباط:', error);
            return this._getFallbackData(endpoint);
        }
    }

    _generateCacheKey(endpoint, options) {
        return `${endpoint}_${JSON.stringify(options)}`;
    }

    _getFallbackData(endpoint) {
        const fallbackData = {
            '/api/products': {
                products: [
                    { id: 1, name: 'محصول نمونه (آفلاین)', price: 100000, offline: true }
                ],
                offline: true
            },
            '/api/health': {
                status: 'offline',
                message: 'حالت آفلاین'
            }
        };

        return fallbackData[endpoint] || { error: 'داده آفلاین موجود نیست', offline: true };
    }

    clearCache() {
        this.cache.clear();
        console.log('🗑️ کش پاک شد');
    }

    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

// ایجاد instance و export
export const connectionManager = new ConnectionManager();
export default ConnectionManager;
