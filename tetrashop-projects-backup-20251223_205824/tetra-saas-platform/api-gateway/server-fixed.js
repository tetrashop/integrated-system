const http = require('http');
const url = require('url');

// تنظیمات سرویس‌ها
const services = {
    'quantum-writer': { port: 3001, host: 'localhost', name: 'نویسنده کوانتومی' },
    'ai-writer': { port: 3002, host: 'localhost', name: 'نویسنده هوشمند' },
    'secret-garden': { port: 3003, host: 'localhost', name: 'باغ راز آلود' },
    '3d-converter': { port: 3004, host: 'localhost', name: 'مبدل سه‌بعدی' },
    '2d-to-3d': { port: 3005, host: 'localhost', name: 'تبدیل 2D به 3D' },
    'content-analyzer': { port: 3006, host: 'localhost', name: 'تحلیلگر محتوا' },
    'anti-fragmentation': { port: 3007, host: 'localhost', name: 'سامانه ضد چندپارگی' },
    'formula-solver': { port: 3008, host: 'localhost', name: 'حل کننده فرمول' },
    'code-cleaner': { port: 3009, host: 'localhost', name: 'تمیز کننده کد' },
    'graphic-2d': { port: 3010, host: 'localhost', name: 'گرافیکی دو بعدی' },
    'anti-smoke': { port: 3011, host: 'localhost', name: 'سامانه ضد سیگار' },
    'telescope-design': { port: 3012, host: 'localhost', name: 'طراحی تلسکوپ' },
    'teleport-system': { port: 3013, host: 'localhost', name: 'سیستم تله پورت' },
    'image-processor': { port: 3014, host: 'localhost', name: 'پردازشگر تصویر' },
    'audio-converter': { port: 3015, host: 'localhost', name: 'مبدل صوت' },
    'video-editor': { port: 3016, host: 'localhost', name: 'ویرایشگر ویدیو' },
    'data-encryptor': { port: 3017, host: 'localhost', name: 'رمزگذار داده' },
    'network-scanner': { port: 3018, host: 'localhost', name: 'اسکنر شبکه' },
    'battery-optimizer': { port: 3019, host: 'localhost', name: 'بهینه‌ساز باتری' },
    'file-organizer': { port: 3020, host: 'localhost', name: 'سازماندهی فایل' },
    'password-generator': { port: 3021, host: 'localhost', name: 'تولیدکننده رمز' },
    'system-monitor': { port: 3022, host: 'localhost', name: 'مانیتور سیستم' },
    'backup-manager': { port: 3023, host: 'localhost', name: 'مدیر پشتیبان' }
};

// تابع برای ارسال درخواست به سرویس
function proxyToService(req, res, serviceName, path) {
    const service = services[serviceName];
    if (!service) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Service not found', available: Object.keys(services) }));
        return;
    }

    const options = {
        hostname: service.host,
        port: service.port,
        path: path || '/',
        method: req.method,
        headers: req.headers
    };

    console.log(`📡 Proxying to ${serviceName}:${service.port}${path}`);
    
    const proxyReq = http.request(options, (proxyRes) => {
        let data = '';
        proxyRes.on('data', chunk => data += chunk);
        proxyRes.on('end', () => {
            res.writeHead(proxyRes.statusCode, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(data);
        });
    });

    proxyReq.on('error', (err) => {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            error: 'Cannot connect to service', 
            service: serviceName,
            details: err.message 
        }));
    });

    // ارسال بدنه درخواست
    if (req.method === 'POST' || req.method === 'PUT') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            proxyReq.write(body);
            proxyReq.end();
        });
    } else {
        proxyReq.end();
    }
}

// ایجاد سرور HTTP
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathParts = parsedUrl.pathname.split('/').filter(p => p);
    
    // هدرهای CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // هندل کردن OPTIONS
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    console.log(`📥 ${req.method} ${req.url}`);
    
    // مسیریابی
    if (pathParts[0] === 'api' && pathParts.length >= 2) {
        const serviceName = pathParts[1];
        const servicePath = '/' + pathParts.slice(2).join('/') + (parsedUrl.search || '');
        proxyToService(req, res, serviceName, servicePath);
    } 
    else if (parsedUrl.pathname === '/health' || parsedUrl.pathname === '/health/') {
        // صفحه سلامت پیشرفته
        res.writeHead(200, { 'Content-Type': 'application/json' });
        
        const activeServices = Object.keys(services).filter(name => {
            // در نسخه واقعی اینجا باید چک کنیم آیا سرویس پاسخ می‌دهد
            return true;
        });
        
        res.end(JSON.stringify({
            status: 'ok',
            platform: 'TetraSaaS',
            version: '1.0.0',
            gateway: {
                status: 'running',
                port: 8080,
                uptime: process.uptime()
            },
            services: {
                total: Object.keys(services).length,
                active: activeServices.length,
                list: Object.entries(services).map(([id, config]) => ({
                    id,
                    name: config.name,
                    port: config.port,
                    url: `http://localhost:8080/api/${id}/process`
                }))
            },
            timestamp: new Date().toISOString(),
            endpoints: {
                health: '/health',
                api: '/api/:service/*',
                dashboard: '/'
            }
        }, null, 2));
    } 
    else if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/dashboard') {
        // صفحه اصلی (داشبورد)
        res.writeHead(200, { 
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache'
        });
        
        let servicesHtml = '';
        Object.entries(services).forEach(([id, config]) => {
            servicesHtml += `
                <div class="service-card">
                    <h3>${config.name}</h3>
                    <p>ID: <code>${id}</code></p>
                    <p>Port: ${config.port}</p>
                    <p>API: <code>/api/${id}/process</code></p>
                    <a href="/api/${id}/health" target="_blank">Test Health</a>
                </div>
            `;
        });
        
        res.end(`
            <!DOCTYPE html>
            <html dir="rtl" lang="fa">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>TetraSaaS Dashboard</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: Tahoma; 
                        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                        color: white; 
                        min-height: 100vh;
                        padding: 20px;
                    }
                    .container { max-width: 1200px; margin: 0 auto; }
                    .header { 
                        text-align: center; 
                        padding: 40px 0;
                        border-bottom: 2px solid #4f46e5;
                        margin-bottom: 40px;
                    }
                    .header h1 { 
                        font-size: 2.5rem; 
                        margin-bottom: 10px;
                        background: linear-gradient(90deg, #4f46e5, #8b5cf6);
                        -webkit-background-clip: text;
                        background-clip: text;
                        color: transparent;
                    }
                    .stats { 
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 20px;
                        margin-bottom: 40px;
                    }
                    .stat-card {
                        background: rgba(255,255,255,0.05);
                        padding: 20px;
                        border-radius: 10px;
                        text-align: center;
                        border: 1px solid rgba(255,255,255,0.1);
                    }
                    .stat-value {
                        font-size: 2rem;
                        font-weight: bold;
                        color: #60a5fa;
                        margin: 10px 0;
                    }
                    .services-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                        gap: 20px;
                    }
                    .service-card {
                        background: rgba(255,255,255,0.05);
                        padding: 20px;
                        border-radius: 10px;
                        border: 1px solid rgba(255,255,255,0.1);
                        transition: all 0.3s;
                    }
                    .service-card:hover {
                        border-color: #4f46e5;
                        transform: translateY(-5px);
                    }
                    .service-card h3 {
                        color: #93c5fd;
                        margin-bottom: 10px;
                    }
                    .service-card p {
                        color: #cbd5e1;
                        margin: 5px 0;
                        font-size: 0.9rem;
                    }
                    .service-card a {
                        display: inline-block;
                        background: #4f46e5;
                        color: white;
                        padding: 8px 16px;
                        border-radius: 5px;
                        text-decoration: none;
                        margin-top: 10px;
                        font-size: 0.9rem;
                    }
                    .service-card a:hover {
                        background: #4338ca;
                    }
                    .api-test {
                        background: rgba(255,255,255,0.05);
                        padding: 30px;
                        border-radius: 10px;
                        margin-top: 40px;
                        border: 1px solid rgba(255,255,255,0.1);
                    }
                    .code-block {
                        background: #1a202c;
                        padding: 15px;
                        border-radius: 5px;
                        font-family: monospace;
                        margin: 10px 0;
                        overflow-x: auto;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🚀 TetraSaaS Dashboard</h1>
                        <p>پنل مدیریت 23 سرویس TetraShop</p>
                    </div>
                    
                    <div class="stats">
                        <div class="stat-card">
                            <div>کل سرویس‌ها</div>
                            <div class="stat-value">${Object.keys(services).length}</div>
                        </div>
                        <div class="stat-card">
                            <div>API Gateway</div>
                            <div class="stat-value">✅ فعال</div>
                        </div>
                        <div class="stat-card">
                            <div>پورت</div>
                            <div class="stat-value">8080</div>
                        </div>
                    </div>
                    
                    <div class="services-grid">
                        ${servicesHtml}
                    </div>
                    
                    <div class="api-test">
                        <h2>🧪 تست API</h2>
                        <p>تست سرویس حل فرمول:</p>
                        <div class="code-block">
curl -X POST http://localhost:8080/api/formula-solver/process \\<br>
  -H "Content-Type: application/json" \\<br>
  -d '{"expression": "x^2 + 3x + 2"}'
                        </div>
                        
                        <p>تست سلامت:</p>
                        <div class="code-block">
curl http://localhost:8080/health
                        </div>
                        
                        <p>مشاهده لاگ‌ها در ترمینال</p>
                    </div>
                </div>
            </body>
            </html>
        `);
    }
    else {
        // 404 - صفحه پیدا نشد
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            error: 'Not found',
            path: parsedUrl.pathname,
            available: [
                '/health',
                '/dashboard', 
                '/api/:service/*'
            ]
        }));
    }
});

// راه‌اندازی سرور
const PORT = 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 TetraSaaS API Gateway running on port ${PORT}`);
    console.log(`📡 Total services: ${Object.keys(services).length}`);
    console.log(`🌐 Dashboard: http://localhost:${PORT}/`);
    console.log(`🔧 Health check: http://localhost:${PORT}/health`);
    console.log(`📝 Logging requests...`);
});

// هندل کردن خطاها
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.log('Try: kill -9 $(lsof -ti:8080)');
    } else {
        console.error('Server error:', err);
    }
});
