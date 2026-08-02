/**
 * 🛠️ سرور توسعه برای اجرای محلی
 */

import { createServer } from 'http';

export function start(port = 3000) {
  const server = createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // هندل درخواست‌های OPTIONS برای CORS
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    // استفاده از هندلر اصلی
    const handler = (await import('./main.js')).default;
    handler(req, res);
  });
  
  server.listen(port, () => {
    console.log(`🚀 سرور توسعه Tetrashop در حال اجرا در پورت ${port}`);
    console.log(`📊 معماری بهینه فعال است`);
    console.log(`🔗 آدرس: http://localhost:${port}`);
    console.log(`🌐 سلامت: http://localhost:${port}/api/health`);
  });
  
  return server;
}
