/**
 * 🧪 تست یکپارچگی و بهره‌وری سیستم
 * 📊 بررسی عملکرد کلی معماری بهینه
 */

import { connectionManager } from '../src/core/ConnectionManager.js';
import { stateManager } from '../src/core/StateManager.js';
import { pluginSystem } from '../src/core/PluginSystem.js';

// تست‌های یکپارچگی
describe('🔗 تست یکپارچگی سیستم معماری بهینه', () => {
    beforeEach(() => {
        // پاکسازی قبل از هر تست
        localStorage.clear();
        connectionManager.cache.clear();
        connectionManager.offlineQueue = [];
    });

    test('یکپارچگی ConnectionManager و StateManager', async () => {
        const testData = { test: 'integration', value: 123 };
        
        // ذخیره در state manager
        await stateManager.set('integration.test', testData);
        
        // بازیابی از state manager
        const retrieved = stateManager.get('integration.test');
        
        expect(retrieved).toEqual(testData);
    });

    test('عملکرد کش هوشمند', async () => {
        const endpoint = '/api/test-cache';
        
        // شبیه‌سازی fetch
        global.fetch = jest.fn()
            .mockImplementationOnce(() => 
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: 'first' })
                })
            )
            .mockImplementationOnce(() => 
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: 'second' })
                })
            );

        // اولین درخواست
        const firstResult = await connectionManager.smartFetch(endpoint);
        
        // دومین درخواست (باید از کش استفاده کند)
        const secondResult = await connectionManager.smartFetch(endpoint);
        
        // باید فقط یک بار fetch شده باشد
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(firstResult).toEqual(secondResult);
    });

    test('سیستم پلاگین - ثبت و استفاده', async () => {
        const testPlugin = {
            id: 'test-plugin',
            name: 'Test Plugin',
            version: '1.0.0',
            dependencies: [],
            factory: () => ({
                processData: (data) => data * 2,
                getInfo: () => 'Test Plugin Info'
            })
        };

        await pluginSystem.registerPlugin(testPlugin);
        const plugin = pluginSystem.getPlugin('test-plugin');
        
        expect(plugin.processData(5)).toBe(10);
        expect(plugin.getInfo()).toBe('Test Plugin Info');
    });

    test('مدیریت حالت آفلاین', async () => {
        // شبیه‌سازی حالت آفلاین
        Object.defineProperty(navigator, 'onLine', {
            get: () => false,
            configurable: true
        });

        const offlineResult = await connectionManager.smartFetch('/api/products');
        
        expect(offlineResult.offline).toBe(true);
        expect(offlineResult.products).toBeDefined();
    });

    test('همگام‌سازی پس از آنلاین شدن', async () => {
        // شبیه‌سازی تغییر وضعیت آنلاین
        Object.defineProperty(navigator, 'onLine', {
            get: () => true,
            configurable: true
        });

        // اضافه کردن آیتم به صف آفلاین
        connectionManager.offlineQueue.push({
            endpoint: '/api/test',
            options: { method: 'POST' },
            timestamp: Date.now(),
            id: 'test-request'
        });

        await connectionManager._handleOnline();
        
        // صف باید خالی شود
        expect(connectionManager.offlineQueue.length).toBe(0);
    });
});

// تست‌های عملکرد
describe('⚡ تست عملکرد سیستم', () => {
    test('زمان پاسخگویی ConnectionManager', async () => {
        const startTime = performance.now();
        
        global.fetch = jest.fn(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true })
            })
        );

        await connectionManager.smartFetch('/api/test');
        const endTime = performance.now();
        const responseTime = endTime - startTime;

        expect(responseTime).toBeLessThan(1000); // کمتر از 1 ثانیه
    });

    test('مصرف حافظه StateManager', () => {
        const initialMemory = process.memoryUsage?.().heapUsed || 0;
        
        // اضافه کردن داده‌های تست
        for (let i = 0; i < 1000; i++) {
            stateManager.set(`test.data.${i}`, {
                id: i,
                name: `Item ${i}`,
                value: Math.random()
            });
        }

        const finalMemory = process.memoryUsage?.().heapUsed || 0;
        const memoryIncrease = finalMemory - initialMemory;

        // مصرف حافظه باید معقول باشد
        expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // کمتر از 10MB
    });

    test('مقیاس‌پذیری سیستم پلاگین', async () => {
        const plugins = [];
        
        // ثبت 50 پلاگین تست
        for (let i = 0; i < 50; i++) {
            const plugin = {
                id: `test-plugin-${i}`,
                name: `Test Plugin ${i}`,
                version: '1.0.0',
                dependencies: [],
                factory: () => ({
                    process: (x) => x + i
                })
            };
            plugins.push(plugin);
        }

        // ثبت همه پلاگین‌ها
        const registrationPromises = plugins.map(plugin => 
            pluginSystem.registerPlugin(plugin)
        );

        await Promise.all(registrationPromises);
        
        // همه پلاگین‌ها باید ثبت شده باشند
        expect(pluginSystem.plugins.size).toBe(50);
    });
});

// تست‌های قابلیت اطمینان
describe('🛡️ تست قابلیت اطمینان سیستم', () => {
    test('تحمل خطا در ConnectionManager', async () => {
        global.fetch = jest.fn()
            .mockRejectedValueOnce(new Error('Network error'))
            .mockRejectedValueOnce(new Error('Network error'))
            .mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

        const result = await connectionManager.smartFetch('/api/test');
        
        // سیستم باید پس از خطا بازیابی شود
        expect(result.success).toBe(true);
        expect(global.fetch).toHaveBeenCalledTimes(3); // 2 بار خطا + 1 بار موفق
    });

    test('یکپارچگی داده‌ها در StateManager', async () => {
        const testData = { important: 'data', timestamp: Date.now() };
        
        await stateManager.set('critical.data', testData);
        
        // شبیه‌سازی restart برنامه
        const newStateManager = new UnifiedStateManager();
        await newStateManager._init();
        
        const recoveredData = newStateManager.get('critical.data');
        expect(recoveredData).toEqual(testData);
    });

    test('ایزوله بودن پلاگین‌ها', async () => {
        const plugin1 = {
            id: 'plugin-1',
            name: 'Plugin 1',
            version: '1.0.0',
            dependencies: [],
            factory: () => ({
                data: 'private data 1',
                getData: () => 'private data 1'
            })
        };

        const plugin2 = {
            id: 'plugin-2', 
            name: 'Plugin 2',
            version: '1.0.0',
            dependencies: [],
            factory: () => ({
                data: 'private data 2',
                getData: () => 'private data 2'
            })
        };

        await pluginSystem.registerPlugin(plugin1);
        await pluginSystem.registerPlugin(plugin2);

        const p1 = pluginSystem.getPlugin('plugin-1');
        const p2 = pluginSystem.getPlugin('plugin-2');

        // پلاگین‌ها باید از هم ایزوله باشند
        expect(p1.getData()).toBe('private data 1');
        expect(p2.getData()).toBe('private data 2');
        expect(p1.data).not.toBe(p2.data);
    });
});
