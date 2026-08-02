/**
 * 🧠 سیستم مدیریت حالت یکپارچه
 */

class StateManager {
    constructor() {
        this.state = new Map();
        this.subscribers = new Map();
        this.initialState = {
            user: null,
            cart: [],
            products: [],
            preferences: {}
        };
        
        this._initializeState();
        console.log('🧠 StateManager راه‌اندازی شد');
    }

    _initializeState() {
        // مقداردهی اولیه state
        this.state.set('global', { ...this.initialState });
    }

    set(path, value) {
        const pathParts = path.split('.');
        let current = this.state.get('global');

        for (let i = 0; i < pathParts.length - 1; i++) {
            const part = pathParts[i];
            if (!current[part]) current[part] = {};
            current = current[part];
        }

        const lastPart = pathParts[pathParts.length - 1];
        const oldValue = current[lastPart];
        current[lastPart] = value;

        // اطلاع‌رسانی به subscribers
        this._notifySubscribers(path, value, oldValue);

        // ذخیره در localStorage (در محیط browser)
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('tetrashop_state', JSON.stringify(this.state.get('global')));
        }

        return true;
    }

    get(path, defaultValue = null) {
        const pathParts = path.split('.');
        let current = this.state.get('global');

        for (const part of pathParts) {
            if (current === undefined || current === null) return defaultValue;
            current = current[part];
        }

        return current !== undefined ? current : defaultValue;
    }

    subscribe(path, callback) {
        if (!this.subscribers.has(path)) {
            this.subscribers.set(path, new Set());
        }
        
        this.subscribers.get(path).add(callback);
        
        // بازگشت تابع unsubscribe
        return () => {
            const subscribers = this.subscribers.get(path);
            if (subscribers) {
                subscribers.delete(callback);
                if (subscribers.size === 0) {
                    this.subscribers.delete(path);
                }
            }
        };
    }

    _notifySubscribers(path, newValue, oldValue) {
        const subscribers = this.subscribers.get(path);
        if (subscribers) {
            subscribers.forEach(callback => {
                try {
                    callback(newValue, oldValue);
                } catch (error) {
                    console.error('❌ خطا در اجرای callback:', error);
                }
            });
        }
    }

    reset() {
        this.state.set('global', { ...this.initialState });
        console.log('🔄 state بازنشانی شد');
    }

    getState() {
        return this.state.get('global');
    }

    // متدهای utility
    addToCart(product) {
        const cart = this.get('cart', []);
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        this.set('cart', cart);
        return cart;
    }

    removeFromCart(productId) {
        const cart = this.get('cart', []);
        const newCart = cart.filter(item => item.id !== productId);
        this.set('cart', newCart);
        return newCart;
    }

    getCartTotal() {
        const cart = this.get('cart', []);
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}

// ایجاد instance و export
export const stateManager = new StateManager();
export default StateManager;
