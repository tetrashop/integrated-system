const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            service: 'system-monitor',
            port: 3022,
            timestamp: new Date().toISOString()
        }));
    } else if (req.url === '/process' || req.url === '/solve' || req.url === '/analyze') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            service: 'system-monitor',
            action: 'processed',
            result: 'Sample result for system-monitor',
            processing_time: '50ms'
        }));
    } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            service: 'system-monitor',
            endpoints: ['/health', '/process'],
            documentation: 'TetraSaaS system-monitor service'
        }));
    }
});

server.listen(3022, '127.0.0.1', () => {
    console.log('✅ system-monitor running on port 3022');
});
