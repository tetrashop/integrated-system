/**
 * 🔌 سیستم پلاگین‌پذیر
 */

class PluginSystem {
    constructor() {
        this.plugins = new Map();
        this.eventBus = new EventBus();
        console.log('🔌 PluginSystem راه‌اندازی شد');
    }

    async registerPlugin(pluginConfig) {
        const { id, name, version, dependencies = [], factory } = pluginConfig;

        // بررسی وابستگی‌ها
        for (const dep of dependencies) {
            if (!this.plugins.has(dep)) {
                throw new Error(`وابستگی ${dep} یافت نشد`);
            }
        }

        // ایجاد instance پلاگین
        const pluginInstance = factory();
        
        // ثبت پلاگین
        this.plugins.set(id, {
            id,
            name,
            version,
            instance: pluginInstance,
            dependencies,
            status: 'active'
        });

        this.eventBus.emit('plugin:registered', { pluginId: id });
        console.log(`✅ پلاگین "${name}" v${version} ثبت شد`);

        return pluginInstance;
    }

    getPlugin(pluginId) {
        return this.plugins.get(pluginId)?.instance;
    }

    async callPluginMethod(pluginId, methodName, ...args) {
        const plugin = this.plugins.get(pluginId);
        if (!plugin) {
            throw new Error(`پلاگین ${pluginId} یافت نشد`);
        }

        if (typeof plugin.instance[methodName] !== 'function') {
            throw new Error(`متد ${methodName} در پلاگین ${pluginId} وجود ندارد`);
        }

        try {
            return await plugin.instance[methodName](...args);
        } catch (error) {
            console.error(`❌ خطا در اجرای ${methodName} روی ${pluginId}:`, error);
            throw error;
        }
    }

    listPlugins() {
        return Array.from(this.plugins.values()).map(plugin => ({
            id: plugin.id,
            name: plugin.name,
            version: plugin.version,
            status: plugin.status
        }));
    }

    unregisterPlugin(pluginId) {
        const plugin = this.plugins.get(pluginId);
        if (!plugin) {
            throw new Error(`پلاگین با شناسه ${pluginId} یافت نشد`);
        }

        // غیرفعال کردن پلاگین
        if (plugin.instance.deactivate) {
            plugin.instance.deactivate();
        }

        this.plugins.delete(pluginId);
        this.eventBus.emit('plugin:unregistered', { pluginId });

        console.log(`🗑️ پلاگین "${pluginId}" حذف شد`);
    }
}

class EventBus {
    constructor() {
        this.listeners = new Map();
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    }

    off(event, callback) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.delete(callback);
        }
    }

    emit(event, data) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`❌ خطا در اجرای listener برای ${event}:`, error);
                }
            });
        }
    }
}

// ایجاد instance و export
export const pluginSystem = new PluginSystem();
export default PluginSystem;
