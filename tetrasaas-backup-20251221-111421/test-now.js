const http = require('http');

const server = http.createServer((req, res) => {
    console.log(`درخواست دریافت شد: ${req.url}`);
    
    if (req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(`
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <title>تست TetraShop</title>
                <style>
                    body { font-family: 'Vazirmatn'; background: #0f172a; color: white; padding: 20px; }
                    h1 { color: #0ea5e9; }
                    .success { background: #10b981; padding: 10px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>✅ سرور TetraShop کار می‌کند!</h1>
                <div class="success">
                    <p>پورت: 3000</p>
                    <p>زمان: ${new Date().toLocaleString('fa-IR')}</p>
                </div>
                <p><a href="/chess" style="color: #f59e0b;">برو به شطرجد</a></p>
            </body>
            </html>
        `);
    }
    else if (req.url === '/chess') {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(`
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <title>شطرجد TetraShop</title>
                <style>
                    body { font-family: 'Vazirmatn'; background: #1a1a2e; color: white; padding: 20px; }
                    h1 { color: #10b981; }
                    .board { display: grid; grid-template-columns: repeat(8, 50px); margin: 20px auto; width: 400px; }
                    .square { width: 50px; height: 50px; }
                    .light { background: #f0d9b5; }
                    .dark { background: #b58863; }
                </style>
            </head>
            <body>
                <h1>♟️ شطرجد TetraShop</h1>
                <p>✅ صفحه شطرجد با موفقیت بارگذاری شد</p>
                <div class="board" id="board"></div>
                <script>
                    // ایجاد تخته شطرجد
                    const board = document.getElementById('board');
                    for(let i=0; i<64; i++) {
                        const square = document.createElement('div');
                        square.className = 'square ' + (Math.floor(i/8) + i) % 2 === 0 ? 'dark' : 'light';
                        board.appendChild(square);
                    }
                </script>
            </body>
            </html>
        `);
    }
    else {
        res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end('صفحه یافت نشد');
    }
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log('=========================================');
    console.log('🚀 سرور تست TetraShop');
    console.log('=========================================');
    console.log(`✅ سرور روی پورت ${PORT} راه‌اندازی شد`);
    console.log(`🌐 آدرس‌ها:`);
    console.log(`   📍 http://localhost:${PORT}`);
    console.log(`   📍 http://127.0.0.1:${PORT}`);
    console.log(`   ♟️ http://localhost:${PORT}/chess`);
    console.log('=========================================');
    console.log('📢 مرورگر خود را باز کنید و آدرس بالا را وارد کنید');
    console.log('=========================================');
});
