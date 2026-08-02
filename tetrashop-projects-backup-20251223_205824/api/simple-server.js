const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// صفحه اصلی - داشبرد
app.get('/', (req, res) => {
    res.json({
        project: "TetraShop Dashboard",
        status: "RUNNING",
        timestamp: new Date().toISOString(),
        modules: {
            payment: true,
            premium: true,
            store: true,
            ads: true,
            gateway: true
        },
        endpoints: [
            { path: "/api/payment/checkout", method: "POST", description: "پرداخت" },
            { path: "/api/premium/subscribe", method: "POST", description: "عضویت ویژه" },
            { path: "/api/store/products", method: "GET", description: "محصولات" },
            { path: "/api/ads", method: "GET", description: "تبلیغات" },
            { path: "/health", method: "GET", description: "سلامت سرویس" }
        ]
    });
});

// سلامت سرویس
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'TetraShop Simple Server' });
});

// تست endpointهای اصلی
app.get('/api/store/products', (req, res) => {
    res.json([{ id: 1, name: "سرویس پردازش متن", price: 100000 }]);
});

app.post('/api/payment/checkout', (req, res) => {
    res.json({ 
        success: true, 
        message: "پرداخت تستی موفق", 
        transaction_id: "TEST_" + Date.now() 
    });
});

app.listen(PORT, () => {
    console.log(`✅ سرور ساده TetraShop روی پورت ${PORT} راه‌اندازی شد`);
    console.log(`📊 داشبرد: http://localhost:${PORT}`);
    console.log(`🏥 سلامت: http://localhost:${PORT}/health`);
});
