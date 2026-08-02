// Service Worker برای کش کردن فایل‌ها و کار آفلاین
const CACHE_NAME = '2d-to-3d-v3';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js'
];

// نصب Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('✅ کش کردن فایل‌ها...');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// فعال‌سازی
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🧹 حذف کش قدیمی:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// پاسخ به درخواست‌ها
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // اگر فایل در کش بود، از کش برمی‌گردانیم
                if (response) {
                    return response;
                }
                
                // در غیر این صورت از شبکه می‌گیریم
                return fetch(event.request)
                    .then(response => {
                        // بررسی که پاسخ معتبر است
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // کش کردن پاسخ
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // اگر آفلاین هستیم و فایل در کش نیست
                        if (event.request.mode === 'navigate') {
                            return caches.match('./index.html');
                        }
                    });
            })
    );
});
