const http = require('http');
const url = require('url');

// تنظیمات سرویس‌ها
const services = {
    'quantum-writer': { port: 3001, host: 'localhost' },
    'ai-writer': { port: 3002, host: 'localhost' },
    'secret-garden': { port: 3003, host: 'localhost' },
    '3d-converter': { port: 3004, host: 'localhost' },
    '2d-to-3d': { port: 3005, host: 'localhost' },
    'content-analyzer': { port: 3006, host: 'localhost' },
    'anti-fragmentation': { port: 3007, host: 'localhost' },
    'formula-solver': { port: 3008, host: 'localhost' },
    'code-cleaner': { port: 3009, host: 'localhost' },
    'graphic-2d': { port: 3010, host: 'localhost' },
    'anti-smoke': { port: 3011, host: 'localhost' },
    'telescope-design': { port: 3012, host: 'localhost' },
    'teleport-system': { port: 3013, host: 'localhost' },
    'image-processor': { port: 3014, host: 'localhost' },
    'audio-converter': { port: 3015, host: 'localhost' },
    'video-editor': { port: 3016, host: 'localhost' },
    'data-encryptor': { port: 3017, host: 'localhost' },
    'network-scanner': { port: 3018, host: 'localhost' },
    'battery-optimizer': { port: 3019, host: 'localhost' },
    'file-organizer': { port: 3020, host: 'localhost' },
    'password-generator': { port: 3021, host: 'localhost' },
    'system-monitor': { port: 3022, host: 'localhost' },
    'backup-manager': { port: 3023, host: 'localhost' }
};

// تابع proxy برای ارسال درخواست به سرویس مناسب
function proxyRequest(req, res, serviceName, path) {
    const service = services[serviceName];
    if (!service) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Service not found' }));
        return;
    }

    const options = {
        hostname: service.host,
        port: service.port,
        path: path || '/',
        method: req.method,
        headers: req.headers
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Cannot connect to service', details: err.message }));
    });

    req.pipe(proxyReq);
}

// ایجاد سرور HTTP
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathParts = parsedUrl.pathname.split('/').filter(p => p);
    
    // تنظیم هدر CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // هندل کردن OPTIONS برای CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // مسیریابی
    if (pathParts[0] === 'api' && pathParts.length >= 2) {
        const serviceName = pathParts[1];
        const servicePath = '/' + pathParts.slice(2).join('/') + (parsedUrl.search || '');
        proxyRequest(req, res, serviceName, servicePath);
    } else if (parsedUrl.pathname === '/health') {
        // صفحه سلامت
        const activeServices = Object.keys(services).filter(name => {
            // در نسخه واقعی اینجا باید وضعیت سرویس چک شود
            return true;
        }).length;
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            gateway: 'running',
            total_services: Object.keys(services).length,
            active_services: activeServices,
            timestamp: new Date().toISOString()
        }));
    } else if (parsedUrl.pathname === '/') {
        // صفحه اصلی
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html dir="rtl" lang="fa">
            <head>
                <meta charset="UTF-8">
                <title>TetraSaaS API Gateway</title>
                <style>
                    body { font-family: Tahoma; background: #0f172a; color: white; padding: 40px; }
                    .container { max-width: 800px; margin: 0 auto; }
                    .header { text-align: center; margin-bottom: 40px; }
                    .service-list { background: #1e293b; padding: 20px; border-radius: 10px; }
                    .service-item { padding: 10px; border-bottom: 1px solid #334155; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🌐 TetraSaaS API Gateway</h1>
                        <p>درگاه یکپارچه برای 23 سرویس TetraShop</p>
                    </div>
                    <div class="service-list">
                        <h3>📡 سرویس‌های موجود:</h3>
                        ${Object.entries(services).map(([name, config]) => `
                            <div class="service-item">
                                <strong>${name}</strong> - پورت: ${config.port}
                                <div style="font-size: 12px; color: #94a3b8;">
                                    آدرس: <code>http://localhost:8080/api/${name}/process</code>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="margin-top: 30px; text-align: center; color: #94a3b8;">
                        برای تست: <code>curl http://localhost:8080/api/formula-solver/health</code>
                    </div>
                </div>
            </body>
            </html>
        `);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found', path: parsedUrl.pathname }));
    }
});

// راه‌اندازی سرور
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`🚀 API Gateway در حال اجرا روی پورت ${PORT}`);
    console.log(`📡 تعداد سرویس‌ها: ${Object.keys(services).length}`);
    console.log(`🌐 آدرس: http://localhost:${PORT}`);
});
