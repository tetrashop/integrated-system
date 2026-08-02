// ==============================================
// TetraSaaS Gateway Server - مدیریت دسترسی و پلن
// نسخه: 1.0.0
// پورت: 3000
// ==============================================

const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// شبیه‌سازی دیتابیس کاربران و پلن‌ها
const usersDB = {
  'apikey_user_free_123': {
    userId: 'user_001',
    name: 'کاربر آزمایشی رایگان',
    plan: 'free',
    requestsThisMonth: 95,
    monthlyLimit: 100,
    allowedServices: ['/api/health', '/api/formula/solve', '/api/content/analyze', '/api/nlp/enhanced'],
    createdAt: '2024-01-01',
    status: 'active'
  },
  'apikey_user_pro_456': {
    userId: 'user_002',
    name: 'کاربر حرفه‌ای',
    plan: 'pro',
    requestsThisMonth: 450,
    monthlyLimit: 10000,
    allowedServices: 'ALL',
    createdAt: '2024-01-01',
    status: 'active'
  },
  'apikey_enterprise_789': {
    userId: 'user_003',
    name: 'سازمان بزرگ',
    plan: 'enterprise',
    requestsThisMonth: 12000,
    monthlyLimit: 50000,
    allowedServices: 'ALL',
    createdAt: '2024-01-01',
    status: 'active'
  }
};

// میدلور اصلی برای احراز هویت و اعتبارسنجی
app.use('/api/*', (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  const user = usersDB[apiKey];
  const requestedPath = req.path;
  
  console.log(`🔐 درخواست: ${requestedPath} | کلید: ${apiKey?.substring(0, 10)}...`);

  // ۱. بررسی وجود کلید API
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'API Key نامعتبر است',
      hint: 'لطفا از هدر x-api-key یا پارامتر api_key استفاده کنید'
    });
  }

  // ۲. بررسی وضعیت فعال بودن کاربر
  if (user.status !== 'active') {
    return res.status(403).json({
      success: false,
      error: 'حساب شما غیرفعال است',
      plan: user.plan
    });
  }

  // ۳. بررسی محدودیت درخواست ماهانه
  if (user.requestsThisMonth >= user.monthlyLimit) {
    return res.status(429).json({
      success: false,
      error: 'محدودیت درخواست ماهانه شما به پایان رسیده است',
      limit: user.monthlyLimit,
      used: user.requestsThisMonth,
      remaining: 0,
      upgrade_url: '/gateway/upgrade'
    });
  }

  // ۴. بررسی دسترسی به سرویس درخواستی
  if (user.allowedServices !== 'ALL') {
    if (!user.allowedServices.includes(requestedPath)) {
      const allowedServicesList = user.allowedServices.join(', ');
      return res.status(403).json({
        success: false,
        error: 'دسترسی به این سرویس در پلن فعلی شما مجاز نیست',
        plan: user.plan,
        allowed_services: user.allowedServices
      });
    }
  }

  // ۵. افزایش شمارنده و ذخیره اطلاعات کاربر
  user.requestsThisMonth++;
  req.userInfo = user;
  
  console.log(`✅ دسترسی مجاز: ${user.name} | پلن: ${user.plan} | درخواست: ${user.requestsThisMonth}/${user.monthlyLimit}`);
  next();
});

// مسیریابی به سرور اصلی TetraSaaS (پورت 5000)
app.all('/api/*', async (req, res) => {
  try {
    const startTime = Date.now();
    
    // ساخت URL برای سرور اصلی
    const targetUrl = `http://localhost:5000${req.originalUrl}`;
    
    console.log(`🔄 ارسال درخواست به: ${targetUrl}`);
    
    // ارسال درخواست به سرور اصلی
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      params: req.query,
      headers: {
        ...req.headers,
        'host': 'localhost:5000',
        'x-forwarded-for': req.ip,
        'x-user-id': req.userInfo.userId
      },
      timeout: 30000 // 30 ثانیه تایم‌اوت
    });

    const responseTime = Date.now() - startTime;
    
    // پاسخ موفقیت‌آمیز
    res.json({
      success: true,
      data: response.data,
      metadata: {
        response_time: `${responseTime}ms`,
        gateway: 'TetraSaaS Gateway v1.0',
        user: {
          plan: req.userInfo.plan,
          requests_used: req.userInfo.requestsThisMonth,
          monthly_limit: req.userInfo.monthlyLimit,
          remaining: req.userInfo.monthlyLimit - req.userInfo.requestsThisMonth
        }
      }
    });
    
  } catch (error) {
    console.error('❌ خطا در Gateway:', error.message);
    
    // مدیریت خطاهای مختلف
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'سرویس اصلی در دسترس نیست',
        detail: 'لطفا از فعال بودن سرور TetraSaaS روی پورت 5000 اطمینان حاصل کنید'
      });
    }
    
    if (error.response) {
      // خطا از سمت سرور اصلی
      return res.status(error.response.status).json({
        success: false,
        error: 'خطا از سمت سرویس اصلی',
        detail: error.response.data
      });
    }
    
    // خطای عمومی
    res.status(500).json({
      success: false,
      error: 'خطایی در Gateway رخ داد',
      detail: error.message
    });
  }
});

// ========== endpoints مدیریتی Gateway ==========

// بررسی وضعیت پلن کاربر
app.get('/gateway/my-plan', (req, res) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  const user = usersDB[apiKey];
  
  if (!user) {
    return res.status(401).json({ error: 'API Key نامعتبر است' });
  }
  
  res.json({
    success: true,
    user: {
      id: user.userId,
      name: user.name,
      plan: user.plan,
      status: user.status,
      created_at: user.createdAt
    },
    usage: {
      requests_used: user.requestsThisMonth,
      monthly_limit: user.monthlyLimit,
      remaining: user.monthlyLimit - user.requestsThisMonth,
      percentage: ((user.requestsThisMonth / user.monthlyLimit) * 100).toFixed(1) + '%'
    },
    limits: {
      max_requests: user.monthlyLimit,
      allowed_services: user.allowedServices === 'ALL' ? 'تمام سرویس‌ها' : user.allowedServices
    }
  });
});

// اطلاعات پلن‌های موجود
app.get('/gateway/plans', (req, res) => {
  const plans = {
    free: {
      name: 'رایگان',
      monthly_price: 0,
      features: [
        '۱۰۰ درخواست در ماه',
        'دسترسی به ۴ سرویس اصلی',
        'پشتیبانی ایمیلی',
        'آپ‌تایم ۹۵٪'
      ],
      limits: {
        requests: 100,
        services: ['health', 'formula', 'content', 'nlp']
      }
    },
    pro: {
      name: 'حرفه‌ای',
      monthly_price: 29.99,
      features: [
        '۱۰٬۰۰۰ درخواست در ماه',
        'دسترسی به تمام ۲۳ سرویس',
        'پشتیبانی تلفنی',
        'آپ‌تایم ۹۹٪',
        'API اختصاصی'
      ],
      limits: {
        requests: 10000,
        services: 'ALL'
      }
    },
    enterprise: {
      name: 'سازمانی',
      monthly_price: 199.99,
      features: [
        '۵۰٬۰۰۰ درخواست در ماه',
        'دسترسی به تمام سرویس‌ها',
        'پشتیبانی ۲۴/۷',
        'آپ‌تایم ۹۹٫۹٪',
        'API اختصاصی',
        'دیتابیس خصوصی'
      ],
      limits: {
        requests: 50000,
        services: 'ALL'
      }
    }
  };
  
  res.json({
    success: true,
    plans: plans,
    currency: 'USD'
  });
});

// تست سلامت Gateway
app.get('/gateway/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'TetraSaaS Gateway',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    users_count: Object.keys(usersDB).length
  });
});

// راهنمای استفاده
app.get('/gateway', (req, res) => {
  res.json({
    message: 'به Gateway TetraSaaS خوش آمدید',
    endpoints: {
      api_access: 'ارسال درخواست با هدر x-api-key به /api/*',
      check_plan: 'GET /gateway/my-plan',
      available_plans: 'GET /gateway/plans',
      health_check: 'GET /gateway/health'
    },
    example_curl: "curl -H 'x-api-key: apikey_user_free_123' http://localhost:3000/api/health"
  });
});

// شروع سرور
const PORT = 3000;
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 TetraSaaS Gateway راه‌اندازی شد!');
  console.log('📡 پورت: ' + PORT);
  console.log('🔗 آدرس: http://localhost:' + PORT);
  console.log('='.repeat(50));
  console.log('\n📋 کلیدهای API موجود برای تست:');
  console.log('   📌 رایگان:    apikey_user_free_123');
  console.log('   📌 حرفه‌ای:   apikey_user_pro_456');
  console.log('   📌 سازمانی:  apikey_enterprise_789');
  console.log('\n🔧 امکانات Gateway:');
  console.log('   • احراز هویت با API Key');
  console.log('   • محدودیت درخواست ماهانه');
  console.log('   • مدیریت پلن‌های مختلف');
  console.log('   • ردیابی مصرف');
  console.log('   • لاگ‌گیری کامل');
  console.log('\n✅ آماده دریافت درخواست...');
});
