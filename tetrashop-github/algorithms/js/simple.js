export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  const path = req.url;
  
  if (path.includes('/api/health')) {
    res.end(JSON.stringify({ 
      status: 'healthy',
      service: 'Tetrashop100',
      version: '3.0.0',
      timestamp: new Date().toISOString(),
      message: '🚀 سرور با موفقیت اجرا شد'
    }));
  } 
  else if (path.includes('/api/products')) {
    res.end(JSON.stringify({
      success: true,
      data: {
        products: [
          { id: 1, name: 'لپ‌تاپ گیمینگ', price: 25000000, category: 'الکترونیک' },
          { id: 2, name: 'هدفون بی‌سیم', price: 3500000, category: 'صوتی' },
          { id: 3, name: 'کتاب برنامه‌نویسی', price: 450000, category: 'کتاب' }
        ],
        count: 3
      }
    }));
  }
  else if (path.includes('/api/users')) {
    res.end(JSON.stringify({
      success: true,
      data: {
        users: [
          { id: 1, name: 'رضا محمدی', email: 'reza@example.com' },
          { id: 2, name: 'سارا احمدی', email: 'sara@example.com' }
        ],
        count: 2
      }
    }));
  }
  else {
    res.end(JSON.stringify({ 
      message: '🎯 به Tetrashop100 خوش آمدید',
      version: '3.0.0',
      endpoints: [
        '/api/health',
        '/api/products', 
        '/api/users'
      ],
      documentation: 'https://github.com/tetrashop/tetrashop-projects'
    }));
  }
}
