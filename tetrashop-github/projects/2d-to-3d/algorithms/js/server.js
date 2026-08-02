const http = require('http');

const products = [
  {
    id: 1,
    name: 'لپ‌تاپ گیمینگ ASUS ROG',
    description: 'لپ‌تاپ گیمینگ با پردازنده Core i7',
    price: 38500000,
    category: 'الکترونیک',
    stock: 8
  },
  {
    id: 2,
    name: 'هدفون بی‌سیم Sony',
    description: 'هدفون با نویزکنسلی پیشرفته', 
    price: 12500000,
    category: 'صوتی',
    stock: 15
  }
];

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/api/health' && req.method === 'GET') {
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'Tetrashop API',
      version: '1.0.0'
    }));
    return;
  }
  
  if (req.url === '/api/products' && req.method === 'GET') {
    res.end(JSON.stringify({
      success: true,
      data: { products: products, count: products.length }
    }));
    return;
  }
  
  res.end(JSON.stringify({ message: 'Tetrashop API' }));
});

const PORT = 4000;
server.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 سرور محلی اجرا شد: http://localhost:' + PORT);
  console.log('🔧 سلامت: http://localhost:' + PORT + '/api/health');
  console.log('🛒 محصولات: http://localhost:' + PORT + '/api/products');
});
