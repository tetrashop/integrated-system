const http = require('http');
const fs = require('fs');
const path = require('path');

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
                    body { font-family: Tahoma; padding: 40px; background: #f0f0f0; }
                    .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
                    .service { padding: 15px; margin: 10px 0; background: #e8f4fd; border-radius: 5px; }
                    .success { background: #d4edda; }
                    .error { background: #f8d7da; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🎯 تست سریع Tetrashop</h1>
                    <p>این یک صفحه تست سریع است. سرویس‌های اصلی در حال راه‌اندازی هستند...</p>
                    
                    <div class="service">
                        <h3>🧪 تست API سلامت</h3>
                        <button onclick="testHealth()">تست سلامت</button>
                        <div id="health-result"></div>
                    </div>
                    
                    <div class="service">
                        <h3>🛒 تست محصولات</h3>
                        <button onclick="testProducts()">دریافت محصولات</button>
                        <div id="products-result"></div>
                    </div>
                    
                    <div class="service">
                        <h3>🌐 آدرس‌های سرویس</h3>
                        <ul>
                            <li><a href="http://localhost:3000" target="_blank">Tetrashop اصلی</a></li>
                            <li><a href="http://localhost:8000" target="_blank">Backend API</a></li>
                            <li><a href="http://localhost:3002" target="_blank">Intelligent Writer</a></li>
                            <li><a href="http://localhost:9002/chess_ui.html" target="_blank">Chess Engine</a></li>
                        </ul>
                    </div>
                </div>
                
                <script>
                    async function testHealth() {
                        try {
                            const response = await fetch('http://localhost:3000/api/health');
                            const data = await response.json();
                            document.getElementById('health-result').innerHTML = 
                                '<div class="success">✅ سلامت: ' + data.status + '</div>';
                        } catch (error) {
                            document.getElementById('health-result').innerHTML = 
                                '<div class="error">❌ خطا: سرویس در حال راه‌اندازی است</div>';
                        }
                    }
                    
                    async function testProducts() {
                        try {
                            const response = await fetch('http://localhost:3000/api/products');
                            const data = await response.json();
                            document.getElementById('products-result').innerHTML = 
                                '<div class="success">✅ تعداد محصولات: ' + data.count + '</div>';
                        } catch (error) {
                            document.getElementById('products-result').innerHTML = 
                                '<div class="error">❌ خطا: سرویس در حال راه‌اندازی است</div>';
                        }
                    }
                </script>
            </body>
            </html>
        `);
    } else if (req.url === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            service: 'Tetrashop Test Server',
            timestamp: new Date().toISOString()
        }));
    } else if (req.url === '/api/products') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            products: [
                { id: 1, name: 'لپ‌تاپ تست', price: 15000000, category: 'الکترونیک' },
                { id: 2, name: 'هدفون تست', price: 2500000, category: 'صوتی' }
            ],
            count: 2
        }));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 سرور تست Tetrashop در حال اجرا در پورت ${PORT}`);
    console.log(`🌐 آدرس: http://localhost:${PORT}`);
});

// graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 توقف سرور...');
    process.exit(0);
});
