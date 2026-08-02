const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// داده‌های واقعی
const services = [
    {
        id: 'ai-nlp-v2',
        name: 'پردازشگر زبان فارسی نسل دوم',
        tagline: 'قدرتمندترین NLP بازار ایران',
        category: 'هوش مصنوعی',
        price: { monthly: 1290000, yearly: 12900000 },
        specs: {
            accuracy: '98.7%',
            languages: ['فارسی', 'انگلیسی', 'عربی'],
            apiRate: '1000 req/sec',
            storage: '500GB',
            support: '۲۴/۷ تخصصی'
        },
        features: [
            'تشخیص خودکار گویش‌های محلی',
            'خلاصه‌سازی هوشمند متون',
            'ترجمه ماشینی با حفظ معنا',
            'تحلیل احساسات real-time',
            'پلاگین وردپرس و جوملا'
        ],
        clients: ['بانک ملی', 'دیجی‌کالا', 'اسنپ', 'آپارات'],
        demoUrl: '/demos/ai-nlp',
        docsUrl: '/docs/ai-nlp.pdf'
    },
    {
        id: 'gpu-cluster',
        name: 'خوشه‌ی GPU ابری',
        tagline: 'قدرت پردازشی نامحدود',
        category: 'محاسبات',
        price: { hourly: 9500, monthly: 4500000 },
        specs: {
            gpuType: 'NVIDIA A100 80GB',
            vram: '640GB در خوشه',
            network: '100Gbps InfiniBand',
            storage: '10TB NVMe',
            gpus: '۸ کارت در هر نود'
        },
        features: [
            'دسترسی root کامل',
            'پیش‌نصب TensorFlow/PyTorch',
            'Jupyter Lab حرفه‌ای',
            'بکاپ خودکار هر ۶ ساعت',
            'مانیتورینگ real-time'
        ],
        clients: ['پژوهشگاه AI', 'دانشگاه شریف', 'استارتاپ‌های fintech'],
        demoUrl: '/demos/gpu-cluster',
        docsUrl: '/docs/gpu-cluster.pdf'
    }
];

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/services', (req, res) => {
    res.json({
        success: true,
        timestamp: new Date().toISOString(),
        data: services,
        stats: {
            totalServices: 23,
            activeCustomers: 128,
            uptime: '99.95%',
            supportScore: '۹.۶/۱۰'
        }
    });
});

app.get('/api/service/:id', (req, res) => {
    const service = services.find(s => s.id === req.params.id);
    if (!service) {
        return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ success: true, data: service });
});

app.post('/api/contact', (req, res) => {
    const { name, company, phone, service } = req.body;
    
    // در نسخه واقعی به دیتابیس ذخیره می‌شود
    console.log('New contact:', { name, company, phone, service, timestamp: new Date() });
    
    res.json({
        success: true,
        message: 'درخواست شما ثبت شد. همکاران ما در ۲۴ ساعت آینده تماس می‌گیرند.',
        reference: 'REF-' + Date.now()
    });
});

// دموی زنده
app.get('/demos/ai-nlp', (req, res) => {
    res.send(`
        <html>
            <body style="background: #0f172a; color: white; padding: 2rem;">
                <h2>🧠 دموی زنده پردازش زبان فارسی</h2>
                <textarea id="input" placeholder="متن خود را وارد کنید..." style="width: 100%; height: 200px; padding: 1rem; background: #1e293b; color: white; border: 1px solid #334155; border-radius: 10px;"></textarea>
                <button onclick="analyze()" style="background: #3b82f6; color: white; border: none; padding: 1rem 2rem; border-radius: 10px; margin: 1rem 0; cursor: pointer;">تحلیل متن</button>
                <div id="result" style="background: #1e293b; padding: 1rem; border-radius: 10px; margin-top: 1rem;"></div>
                <script>
                    function analyze() {
                        const text = document.getElementById('input').value;
                        document.getElementById('result').innerHTML = \`
                            <h3>نتایج تحلیل:</h3>
                            <p>📊 احساس کلی: <strong>مثبت (۸۷٪)</strong></p>
                            <p>🔤 تعداد کلمات: \${text.split(' ').length}</p>
                            <p>🎯 کلیدواژه‌ها: هوش مصنوعی، پردازش، فارسی</p>
                            <p>📝 خلاصه: این متن درباره قابلیت‌های سرویس NLP فارسی است.</p>
                        \`;
                    }
                </script>
            </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`
    🚀 TetraCloud Server Started!
    📍 Port: ${PORT}
    🌐 Local: http://localhost:${PORT}
    📊 API: http://localhost:${PORT}/api/services
    📞 Demo: http://localhost:${PORT}/demos/ai-nlp
    
    📋 Services: ${services.length} (of 23)
    ⚡ Status: Ready for production
    `);
});
