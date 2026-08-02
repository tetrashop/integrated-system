import { createServer } from 'http';

const sampleProducts = [
  {
    _id: '1',
    name: 'لپ‌تاپ گیمینگ ASUS',
    description: 'لپ‌تاپ گیمینگ با کارایی بالا',
    price: 25000000,
    category: 'الکترونیک',
    stock: 15,
    featured: true
  },
  {
    _id: '2', 
    name: 'هدفون بی‌سیم Sony',
    description: 'هدفون با کیفیت صدای عالی',
    price: 3500000,
    category: 'صوتی',
    stock: 30,
    featured: true
  }
];

const server = createServer(async (req, res) => {
  // تنظیم headers برای CORS
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // مدیریت CORS preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  try {
    // سلامت سرویس
    if (pathname === '/api/health') {
      res.statusCode = 200;
      return res.end(JSON.stringify({
        status: 'healthy',
        service: 'Tetrashop100',
        version: '3.0.0',
        timestamp: new Date().toISOString(),
        database: 'in-memory'
      }));
    }

    // محصولات
    else if (pathname === '/api/products') {
      res.statusCode = 200;
      return res.end(JSON.stringify({
        success: true,
        data: {
          products: sampleProducts,
          count: sampleProducts.length
        }
      }));
    }

    // صفحه اصلی
    else if (pathname === '/' || pathname === '/api') {
      res.statusCode = 200;
      return res.end(JSON.stringify({
        success: true,
        message: '🎯 به Tetrashop100 خوش آمدید',
        version: '3.0.0'
      }));
    }

    // مسیر یافت نشد
    else {
      res.statusCode = 404;
      return res.end(JSON.stringify({
        success: false,
        error: 'Endpoint یافت نشد'
      }));
    }

  } catch (error) {
    res.statusCode = 500;
    return res.end(JSON.stringify({
      success: false,
      error: 'خطای سرور داخلی'
    }));
  }
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 سرور محلی Tetrashop100 اجرا شد روی پورت ${PORT}`);
  console.log(`📡 آدرس: http://localhost:${PORT}`);
  console.log(`🔧 سلامت: http://localhost:${PORT}/api/health`);
  console.log(`🛒 محصولات: http://localhost:${PORT}/api/products`);
});
