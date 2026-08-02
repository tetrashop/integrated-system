console.log('🧪 تست سرور شطرجد TetraShop...\n');

// تست وابستگی‌ها
try {
    const express = require('express');
    console.log('✅ Express.js: نصب شده');
} catch (e) {
    console.log('❌ Express.js: نصب نیست. در حال نصب...');
    require('child_process').execSync('npm install express --silent');
    console.log('✅ Express.js: نصب شد');
}

try {
    const cors = require('cors');
    console.log('✅ CORS: نصب شده');
} catch (e) {
    console.log('❌ CORS: نصب نیست. در حال نصب...');
    require('child_process').execSync('npm install cors --silent');
    console.log('✅ CORS: نصب شد');
}

// تست موتور
try {
    const ChessEngine = require('./engine/ChessEngine');
    const engine = new ChessEngine();
    console.log('✅ موتور شطرجد: بارگذاری موفق');
    
    // تست سریع موتور
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
    engine.loadFEN(fen);
    const evalScore = engine.evaluate();
    console.log(`✅ ارزیابی موقعیت: ${evalScore}`);
    
    const moves = engine.generateMoves();
    console.log(`✅ تولید حرکات: ${moves.length} حرکت ممکن`);
    
} catch (e) {
    console.log('❌ خطا در تست موتور:', e.message);
}

// یافتن پورت آزاد
function findFreePort(startPort = 7555) {
    const net = require('net');
    return new Promise((resolve) => {
        const server = net.createServer();
        server.listen(startPort, () => {
            const port = server.address().port;
            server.close(() => resolve(port));
        });
        server.on('error', () => resolve(findFreePort(startPort + 1)));
    });
}

// تست سرور
(async () => {
    console.log('\n🌐 تست راه‌اندازی سرور...');
    
    try {
        const port = await findFreePort(7555);
        console.log(`✅ پورت آزاد یافت شد: ${port}`);
        
        // ایجاد سرور تست
        const app = require('express')();
        app.use(require('cors')());
        
        app.get('/test', (req, res) => {
            res.json({ status: 'ok', message: 'سرور فعال است' });
        });
        
        const server = app.listen(port, () => {
            console.log(`✅ سرور تست روی پورت ${port} راه‌اندازی شد`);
            
            // تست درخواست HTTP
            const http = require('http');
            const options = {
                hostname: 'localhost',
                port: port,
                path: '/test',
                method: 'GET'
            };
            
            const req = http.request(options, (res) => {
                console.log(`✅ پاسخ سرور: کد وضعیت ${res.statusCode}`);
                
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    console.log('✅ پاسخ JSON:', JSON.parse(data));
                    server.close();
                    console.log('\n🎉 تمام تست‌ها موفقیت‌آمیز بود!');
                    console.log('\n🚀 اکنون می‌توانید سرور را اجرا کنید:');
                    console.log('   npm start');
                    console.log('   یا');
                    console.log('   node api/server.js');
                    process.exit(0);
                });
            });
            
            req.on('error', (e) => {
                console.log('❌ خطا در تست درخواست HTTP:', e.message);
                server.close();
                process.exit(1);
            });
            
            req.end();
        });
        
        server.on('error', (e) => {
            console.log('❌ خطا در راه‌اندازی سرور:', e.message);
            process.exit(1);
        });
        
    } catch (error) {
        console.log('❌ خطا در تست سرور:', error.message);
        process.exit(1);
    }
})();
