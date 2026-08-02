const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            service: 'secret-garden',
            port: 3003,
            timestamp: new Date().toISOString()
        }));
    } else if (req.url === '/process' || req.url === '/solve' || req.url === '/analyze') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            service: 'secret-garden',
            action: 'processed',
            result: 'Sample result for secret-garden',
            processing_time: '50ms'
        }));
    } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            service: 'secret-garden',
            endpoints: ['/health', '/process'],
            documentation: 'TetraSaaS secret-garden service'
        }));
    }
});

server.listen(3003, '127.0.0.1', () => {
    console.log('✅ secret-garden running on port 3003');
});
