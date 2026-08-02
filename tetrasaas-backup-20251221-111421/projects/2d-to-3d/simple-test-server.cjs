const http = require('http');

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>🚀 Tetrashop - تست سریع</title>
                <style>
                    body { font-family: Tahoma; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; }
                    .container { max-width: 900px; margin: 0 auto; background: rgba(255,255,255,0.95); padding: 40px; border-radius: 15px; color: #333; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
                    .service { padding: 20px; margin: 15px 0; background: #f8f9fa; border-radius: 10px; border-left: 5px solid #007bff; }
                    .success { border-left-color: #28a745; background: #d4edda; }
                    .error { border-left-color: #dc3545; background: #f8d7da; }
                    button { padding: 12px 24px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; margin: 5px; }
                    button:hover { background: #0056b3; }
                    .status { display: inline-block; padding: 5px 15px; border-radius: 20px; margin-left: 10px; font-size: 0.9em; }
                    .online { background: #28a745; color: white; }
                    .offline { background: #dc3545; color: white; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🎯 تست سریع Tetrashop Suite</h1>
                    <p>این یک صفحه تست سریع است. وضعیت سرویس‌های اصلی را بررسی کنید:</p>
                    
                    <div class="service">
                        <h3>🛒 Tetrashop اصلی <span id="status-3000" class="status offline">آفلاین</span></h3>
                        <button onclick="testService(3000, 'Tetrashop اصلی')">تست سلامت</button>
                        <button onclick="window.open('http://localhost:3000', '_blank')">باز کردن</button>
                        <div id="result-3000"></div>
                    </div>
                    
                    <div class="service">
                        <h3>🔧 Backend API <span id="status-8000" class="status offline">آفلاین</span></h3>
                        <button onclick="testService(8000, 'Backend API')">تست سلامت</button>
                        <button onclick="window.open('http://localhost:8000/docs', '_blank')">مستندات</button>
                        <div id="result-8000"></div>
                    </div>
                    
                    <div class="service">
                        <h3>📝 Intelligent Writer <span id="status-3002" class="status offline">آفلاین</span></h3>
                        <button onclick="testService(3002, 'Intelligent Writer')">تست سلامت</button>
                        <button onclick="testGenerateContent()">تست تولید محتوا</button>
                        <div id="result-3002"></div>
                    </div>
                    
                    <div class="service">
                        <h3>♟️ Chess Engine <span id="status-9002" class="status offline">آفلاین</span></h3>
                        <button onclick="testService(9002, 'Chess Engine')">تست سلامت</button>
                        <button onclick="window.open('http://localhost:9002/chess_ui.html', '_blank')">بازی شطرنج</button>
                        <div id="result-9002"></div>
                    </div>
                    
                    <div class="service">
                        <h3>🚀 راه‌اندازی سریع</h3>
                        <button onclick="startAllServices()">راه‌اندازی همه سرویس‌ها</button>
                        <button onclick="checkAllServices()">بررسی همه سرویس‌ها</button>
                        <div id="startup-result"></div>
                    </div>
                </div>
                
                <script>
                    async function testService(port, serviceName) {
                        const resultEl = document.getElementById('result-' + port);
                        const statusEl = document.getElementById('status-' + port);
                        
                        try {
                            resultEl.innerHTML = '⏳ در حال تست...';
                            const response = await fetch('http://localhost:' + port + '/api/health');
                            const data = await response.json();
                            
                            resultEl.innerHTML = '<div class="success">✅ ' + serviceName + ' فعال<br>وضعیت: ' + data.status + '<br>سرویس: ' + (data.service || 'Unknown') + '</div>';
                            statusEl.textContent = 'آنلاین';
                            statusEl.className = 'status online';
                            
                        } catch (error) {
                            resultEl.innerHTML = '<div class="error">❌ ' + serviceName + ' آفلاین<br>خطا: ' + error.message + '</div>';
                            statusEl.textContent = 'آفلاین';
                            statusEl.className = 'status offline';
                        }
                    }
                    
                    async function testGenerateContent() {
                        try {
                            const response = await fetch('http://localhost:3002/api/generate', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    prompt: 'تست سیستم Tetrashop',
                                    model: 'creative'
                                })
                            });
                            const data = await response.json();
                            document.getElementById('result-3002').innerHTML = 
                                '<div class="success">✅ محتوا تولید شد:<br>' + data.content + '</div>';
                        } catch (error) {
                            document.getElementById('result-3002').innerHTML = 
                                '<div class="error">❌ خطا در تولید محتوا: ' + error.message + '</div>';
                        }
                    }
                    
                    async function checkAllServices() {
                        const services = [
                            {port: 3000, name: 'Tetrashop اصلی'},
                            {port: 8000, name: 'Backend API'},
                            {port: 3002, name: 'Intelligent Writer'},
                            {port: 9002, name: 'Chess Engine'}
                        ];
                        
                        for (const service of services) {
                            await testService(service.port, service.name);
                            await new Promise(resolve => setTimeout(resolve, 500)); // تاخیر بین تست‌ها
                        }
                    }
                    
                    function startAllServices() {
                        const resultEl = document.getElementById('startup-result');
                        resultEl.innerHTML = '🚀 در حال راه‌اندازی سرویس‌ها...<br>لطفا ترمینال را بررسی کنید.';
                        
                        // این فقط یک پیام است - راه‌اندازی واقعی باید از ترمینال انجام شود
                        setTimeout(() => {
                            resultEl.innerHTML += '<br>💡 برای راه‌اندازی واقعی، در ترمینال اجرا کنید:<br><code>./emergency-repair-30min.sh</code>';
                        }, 2000);
                    }
                    
                    // بررسی خودکار هنگام لود صفحه
                    window.addEventListener('load', function() {
                        setTimeout(checkAllServices, 1000);
                    });
                </script>
            </body>
            </html>
        `);
    } else if (req.url === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            service: 'Tetrashop Test Server',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        }));
    } else if (req.url === '/api/products') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            products: [
                { 
                    id: 1, 
                    name: 'لپ‌تاپ گیمینگ پیشرفته', 
                    price: 25000000, 
                    category: 'الکترونیک',
                    description: 'پردازنده Core i7، کارت گرافیک RTX 4060، 16GB RAM'
                },
                { 
                    id: 2, 
                    name: 'هدفون بی‌سیم نویز کنسلینگ', 
                    price: 3500000, 
                    category: 'صوتی',
                    description: 'باتری 30 ساعته، بلوتوث 5.3، کیفیت صدای عالی'
                },
                { 
                    id: 3, 
                    name: 'کتاب برنامه‌نویسی پیشرفته', 
                    price: 450000, 
                    category: 'کتاب',
                    description: 'آموزش React، Node.js، و معماری نرم‌افزار'
                }
            ],
            count: 3
        }));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log('🚀 سرور تست Tetrashop در حال اجرا در پورت 3000');
    console.log('🌐 آدرس: http://localhost:3000');
    console.log('');
    console.log('🎯 این سرور تست برای بررسی وضعیت سرویس‌های اصلی است.');
    console.log('📊 می‌توانید وضعیت تمام سرویس‌ها را از این صفحه بررسی کنید.');
    console.log('');
    console.log('🛠️ برای راه‌اندازی سرویس‌های اصلی:');
    console.log('   ./emergency-repair-30min.sh');
    console.log('   یا');
    console.log('   node unified-manager.js');
});

// graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 توقف سرور تست...');
    process.exit(0);
});
