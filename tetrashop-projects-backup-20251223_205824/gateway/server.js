const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// ==================== تنظیمات سرویس‌ها ====================
const TETRA_SERVICES = {
  // سرویس‌های اصلی (نمونه‌ای از ۲۳ سرویس)
  'content-analyze': {
    name: 'تحلیلگر محتوا (NLP)',
    endpoint: '/api/content/analyze',
    description: 'پردازش متن فارسی با 243 پست آموزشی',
    requires: ['text']
  },
  'formula-solve': {
    name: 'حل کننده فرمول',
    endpoint: '/api/formula/solve',
    description: 'محاسبه فرمول‌های ریاضی پیچیده',
    requires: ['formula']
  },
  'ai-write': {
    name: 'نویسنده هوشمند',
    endpoint: '/api/ai/write',
    description: 'تولید محتوای خودکار با هوش مصنوعی',
    requires: ['prompt', 'length']
  },
  '3d-convert': {
    name: 'مبدل سه‌بعدی',
    endpoint: '/api/3d/convert',
    description: 'تبدیل مدل‌های 2D به 3D',
    requires: ['model', 'format']
  },
  'security-encrypt': {
    name: 'رمزگذار داده',
    endpoint: '/api/security/encrypt',
    description: 'امنیت پیشرفته برای داده‌های حساس',
    requires: ['data', 'algorithm']
  },
  'image-process': {
    name: 'پردازشگر تصویر',
    endpoint: '/api/image/process',
    description: 'پردازش و آنالیز تصاویر',
    requires: ['image_url', 'operation']
  },
  'audio-convert': {
    name: 'مبدل صوت',
    endpoint: '/api/audio/convert',
    description: 'تبدیل و پردازش فایل‌های صوتی',
    requires: ['audio_url', 'target_format']
  },
  'network-scan': {
    name: 'اسکنر شبکه',
    endpoint: '/api/network/scan',
    description: 'بررسی امنیت و وضعیت شبکه',
    requires: ['target', 'scan_type']
  },
  'system-battery': {
    name: 'بهینه‌ساز باتری',
    endpoint: '/api/system/battery',
    description: 'مدیریت مصرف انرژی سیستم',
    requires: ['device_info', 'optimization_level']
  },
  'file-organize': {
    name: 'سازماندهی فایل',
    endpoint: '/api/file/organize',
    description: 'مدیریت خودکار فایل‌ها و پوشه‌ها',
    requires: ['path', 'organization_rules']
  },
  'security-password': {
    name: 'تولیدکننده رمز',
    endpoint: '/api/security/password',
    description: 'ایجاد رمزهای عبور امن',
    requires: ['length', 'complexity']
  },
  'system-monitor': {
    name: 'مانیتور سیستم',
    endpoint: '/api/system/monitor',
    description: 'نظارت بر عملکرد سرور و منابع',
    requires: ['metrics', 'duration']
  },
  'ai-quantum-write': {
    name: 'نویسنده کوانتومی',
    endpoint: '/api/ai/quantum-write',
    description: 'پردازش کوانتومی متن',
    requires: ['text', 'quantum_level']
  },
  '3d-2d-to-3d': {
    name: 'تبدیل 2D به 3D',
    endpoint: '/api/3d/2d-to-3d',
    description: 'تبدیل پیشرفته گرافیک',
    requires: ['image_2d', 'depth_map']
  },
  'graphic-2d': {
    name: 'گرافیک دو بعدی',
    endpoint: '/api/graphic/2d',
    description: 'ایجاد و ویرایش گرافیک 2D',
    requires: ['elements', 'style']
  },
  'science-telescope': {
    name: 'طراحی تلسکوپ',
    endpoint: '/api/science/telescope',
    description: 'شبیه‌سازی و طراحی اپتیک',
    requires: ['parameters', 'simulation_type']
  },
  'network-teleport': {
    name: 'سیستم تله‌پورت',
    endpoint: '/api/network/teleport',
    description: 'انتقال داده‌های امن',
    requires: ['data_payload', 'destination']
  },
  'video-edit': {
    name: 'ویرایشگر ویدیو',
    endpoint: '/api/video/edit',
    description: 'پردازش ویدیو با هوش مصنوعی',
    requires: ['video_url', 'edit_operations']
  },
  'code-clean': {
    name: 'تمیز کننده کد',
    endpoint: '/api/code/clean',
    description: 'بهینه‌سازی و استانداردسازی کد',
    requires: ['code', 'language']
  },
  'backup-manage': {
    name: 'مدیر پشتیبان',
    endpoint: '/api/backup/manage',
    description: 'مدیریت خودکار backup سیستم',
    requires: ['source', 'backup_strategy']
  },
  'system-anti-fragmentation': {
    name: 'سامانه ضد چندپارگی',
    endpoint: '/api/system/anti-fragmentation',
    description: 'بهینه‌سازی حافظه و منابع',
    requires: ['system_report', 'optimization_goal']
  },
  'system-anti-smoke': {
    name: 'سامانه ضد سیگار',
    endpoint: '/api/system/anti-smoke',
    description: 'مدیریت سلامت سیستم',
    requires: ['sensor_data', 'alert_level']
  },
  'security-secret-garden': {
    name: 'باغ راز آلود',
    endpoint: '/api/security/secret-garden',
    description: 'سیستم امنیتی پیشرفته',
    requires: ['data', 'encryption_level']
  }
};

// ==================== Middleware ها ====================
app.use(cors());
app.use(helmet());
app.use(express.json());

// محدودیت نرخ درخواست
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقیقه
  max: 100 // هر IP 100 درخواست
});
app.use('/api/', limiter);

// لاگر
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// ==================== Route ها ====================

// ۱. صفحه اصلی - اطلاعات Gateway
app.get('/', (req, res) => {
  res.json({
    project: '🚀 TetraSaaS API Gateway',
    version: '2.0.0',
    status: 'active',
    services: Object.keys(TETRA_SERVICES).length,
    uptime: process.uptime(),
    endpoints: {
      docs: '/docs',
      health: '/health',
      services: '/services',
      dashboard: 'http://localhost:5173'
    },
    message: 'خوش آمدید به پلتفرم ۲۳ سرویس ابری TetraSaaS!'
  });
});

// ۲. لیست سرویس‌ها
app.get('/services', (req, res) => {
  res.json({
    count: Object.keys(TETRA_SERVICES).length,
    services: Object.values(TETRA_SERVICES).map(s => ({
      name: s.name,
      endpoint: s.endpoint,
      description: s.description,
      status: 'active'
    }))
  });
});

// ۳. سلامت Gateway
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    gateway: 'online',
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    services_status: 'all_active'
  });
});

// ۴. مستندات HTML زیبا
app.get('/docs', (req, res) => {
  const servicesHTML = Object.values(TETRA_SERVICES).map(service => `
    <div class="service-card">
      <h3>${service.name}</h3>
      <p>${service.description}</p>
      <code>POST ${service.endpoint}</code>
      <p><strong>پارامترهای مورد نیاز:</strong> ${service.requires.join(', ')}</p>
    </div>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>📚 مستندات TetraSaaS API</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #333;
          line-height: 1.6;
          min-height: 100vh;
          padding: 20px;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          overflow: hidden;
        }
        header {
          background: linear-gradient(90deg, #1a2980, #26d0ce);
          color: white;
          padding: 40px;
          text-align: center;
        }
        header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }
        header p {
          opacity: 0.9;
          font-size: 1.1rem;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 25px;
          padding: 40px;
        }
        .service-card {
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 15px;
          padding: 25px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
          border-color: #667eea;
        }
        .service-card h3 {
          color: #1a2980;
          margin-bottom: 15px;
          font-size: 1.4rem;
        }
        .service-card p {
          color: #555;
          margin-bottom: 15px;
          font-size: 0.95rem;
        }
        .service-card code {
          background: #1a2980;
          color: white;
          padding: 8px 15px;
          border-radius: 8px;
          display: inline-block;
          font-size: 0.9rem;
          margin: 10px 0;
        }
        .badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: #4CAF50;
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
        }
        .quick-links {
          display: flex;
          justify-content: center;
          gap: 20px;
          padding: 30px;
          background: #f1f3f9;
          flex-wrap: wrap;
        }
        .btn {
          padding: 12px 30px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: bold;
          transition: all 0.3s;
        }
        .btn-primary {
          background: #1a2980;
          color: white;
        }
        .btn-secondary {
          background: white;
          color: #1a2980;
          border: 2px solid #1a2980;
        }
        .btn:hover {
          transform: scale(1.05);
        }
        footer {
          text-align: center;
          padding: 25px;
          background: #1a2980;
          color: white;
          font-size: 0.9rem;
        }
        .api-key-demo {
          background: #fff3cd;
          border: 2px dashed #ffc107;
          border-radius: 10px;
          padding: 20px;
          margin: 30px;
          text-align: center;
        }
        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr;
            padding: 20px;
          }
          header {
            padding: 25px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>🚀 TetraSaaS API Gateway</h1>
          <p>مستندات کامل ۲۳ سرویس ابری - نسخه ۲.۰</p>
        </header>
        
        <div class="api-key-demo">
          <h3>🔑 API Key رایگان برای تست</h3>
          <code style="font-size: 1.2rem; background: transparent; color: #333;">
            apikey_user_free_123
          </code>
          <p style="margin-top: 10px;">برای استفاده در Header درخواست: <code>X-API-Key: apikey_user_free_123</code></p>
        </div>
        
        <div class="quick-links">
          <a href="/" class="btn btn-primary">🏠 صفحه اصلی API</a>
          <a href="/health" class="btn btn-secondary">❤️ بررسی سلامت</a>
          <a href="/services" class="btn btn-secondary">📊 لیست سرویس‌ها</a>
          <a href="http://localhost:5173" class="btn btn-primary" target="_blank">📱 داشبورد مدیریت</a>
        </div>
        
        <div class="services-grid">
          ${servicesHTML}
        </div>
        
        <div class="quick-links">
          <a href="#usage" class="btn btn-secondary">📖 راهنمای استفاده</a>
          <a href="#examples" class="btn btn-secondary">💡 مثال‌های کد</a>
        </div>
        
        <div style="padding: 40px;">
          <h2 id="usage" style="color: #1a2980; margin-bottom: 20px;">📖 راهنمای استفاده</h2>
          <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
            <h3>۱. احراز هویت</h3>
            <p>API Key خود را در Header درخواست قرار دهید:</p>
            <code>X-API-Key: your_api_key_here</code>
            
            <h3 style="margin-top: 25px;">۲. ارسال درخواست</h3>
            <p>تمام درخواست‌ها به صورت POST ارسال می‌شوند:</p>
            <pre style="background: #1a2980; color: white; padding: 15px; border-radius: 8px; overflow-x: auto;">
POST /api/content/analyze
Headers: {
  "X-API-Key": "apikey_user_free_123",
  "Content-Type": "application/json"
}
Body: {
  "text": "متن نمونه برای تحلیل"
}</pre>
            
            <h3 style="margin-top: 25px;">۳. دریافت پاسخ</h3>
            <p>پاسخ‌ها در قالب JSON و با ساختار یکسان بازمی‌گردند.</p>
          </div>
          
          <h2 id="examples" style="color: #1a2980; margin-bottom: 20px;">💡 مثال‌های کد</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <div style="background: #e3f2fd; padding: 20px; border-radius: 10px;">
              <h4>JavaScript (Fetch)</h4>
              <pre style="background: #1565c0; color: white; padding: 15px; border-radius: 8px; font-size: 0.9rem;">
async function analyzeText(text) {
  const response = await fetch('http://localhost:3000/api/content/analyze', {
    method: 'POST',
    headers: {
      'X-API-Key': 'apikey_user_free_123',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });
  return response.json();
}</pre>
            </div>
            
            <div style="background: #f3e5f5; padding: 20px; border-radius: 10px;">
              <h4>Python (Requests)</h4>
              <pre style="background: #7b1fa2; color: white; padding: 15px; border-radius: 8px; font-size: 0.9rem;">
import requests

def analyze_text(text):
    url = "http://localhost:3000/api/content/analyze"
    headers = {
        "X-API-Key": "apikey_user_free_123",
        "Content-Type": "application/json"
    }
    data = {"text": text}
    response = requests.post(url, json=data, headers=headers)
    return response.json()</pre>
            </div>
            
            <div style="background: #e8f5e9; padding: 20px; border-radius: 10px;">
              <h4>cURL</h4>
              <pre style="background: #2e7d32; color: white; padding: 15px; border-radius: 8px; font-size: 0.9rem;">
curl -X POST http://localhost:3000/api/content/analyze \\
  -H "X-API-Key: apikey_user_free_123" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "متن نمونه برای تحلیل"}'</pre>
            </div>
          </div>
        </div>
        
        <footer>
          <p>© 2024 TetraSaaS Platform - تمامی حقوق محفوظ است</p>
          <p>نسخه Gateway: 2.0.0 | سرویس‌ها: ۲۳ مورد | وضعیت: فعال</p>
        </footer>
      </div>
    </body>
    </html>
  `);
});

// ۵. Route اصلی برای تمام سرویس‌ها
app.post('/api/:service/:action', async (req, res) => {
  const startTime = Date.now();
  const requestId = uuidv4();
  const { service, action } = req.params;
  const apiKey = req.headers['x-api-key'];
  
  // لاگ درخواست ورودی
  logger.info({
    requestId,
    service: `${service}/${action}`,
    apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'missing',
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  
  // اعتبارسنجی API Key
  if (!apiKey || !validateApiKey(apiKey)) {
    logger.warn({ requestId, error: 'Invalid API Key' });
    return res.status(401).json({
      error: 'API Key نامعتبر',
      requestId,
      docs: '/docs'
    });
  }
  
  // پیدا کردن سرویس
  const serviceKey = `${service}-${action}`;
  const serviceConfig = TETRA_SERVICES[serviceKey];
  
  if (!serviceConfig) {
    logger.warn({ requestId, error: 'Service not found', serviceKey });
    return res.status(404).json({
      error: 'سرویس یافت نشد',
      available_services: Object.keys(TETRA_SERVICES).map(k => TETRA_SERVICES[k].endpoint),
      requestId
    });
  }
  
  // اعتبارسنجی پارامترهای ورودی
  const missingParams = serviceConfig.requires.filter(param => !req.body[param]);
  if (missingParams.length > 0) {
    logger.warn({ requestId, error: 'Missing parameters', missingParams });
    return res.status(400).json({
      error: 'پارامترهای ضروری ارسال نشده',
      missing: missingParams,
      required: serviceConfig.requires,
      requestId
    });
  }
  
  try {
    // شبیه‌سازی پردازش سرویس
    const result = await simulateServiceProcessing(serviceConfig, req.body);
    const processingTime = Date.now() - startTime;
    
    // لاگ پاسخ موفق
    logger.info({
      requestId,
      service: serviceConfig.name,
      processingTime: `${processingTime}ms`,
      status: 'success'
    });
    
    // پاسخ به کاربر
    res.json({
      success: true,
      service: serviceConfig.name,
      requestId,
      processingTime: `${processingTime}ms`,
      result: result,
      credits_used: calculateCredits(apiKey, serviceKey),
      remaining_credits: getRemainingCredits(apiKey),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error({
      requestId,
      service: serviceConfig.name,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      error: 'خطای داخلی سرویس',
      requestId,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ==================== توابع کمکی ====================
function validateApiKey(apiKey) {
  // در نسخه واقعی، اینجا از دیتابیس چک می‌شود
  const validKeys = ['apikey_user_free_123', 'apikey_pro_456', 'apikey_enterprise_789'];
  return validKeys.includes(apiKey);
}

async function simulateServiceProcessing(serviceConfig, data) {
  // شبیه‌سازی تأخیر پردازش
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));
  
  // پاسخ‌های شبیه‌سازی شده برای هر سرویس
  const mockResponses = {
    'content-analyze': {
      analysis: {
        sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
        keywords: ['کلیدواژه ۱', 'کلیدواژه ۲', 'کلیدواژه ۳'],
        entities: [{ type: 'PERSON', value: 'اشخاص' }],
        summary: 'خلاصه تحلیل متن'
      },
      metadata: {
        language: 'fa',
        text_length: data.text ? data.text.length : 0,
        processed_posts: 243
      }
    },
    'formula-solve': {
      solution: 'حل مسأله با موفقیت انجام شد',
      steps: ['مرحله ۱: تجزیه', 'مرحله ۲: محاسبه', 'مرحله ۳: اعتبارسنجی'],
      result: Math.random() * 100
    },
    // ... می‌توانید برای بقیه سرویس‌ها نیز پاسخ mock اضافه کنید
  };
  
  const responseKey = `${serviceConfig.name.split(' ')[0].toLowerCase()}-${serviceConfig.endpoint.split('/').pop()}`;
  return mockResponses[responseKey] || { 
    status: 'processed',
    message: `سرویس ${serviceConfig.name} با موفقیت اجرا شد`,
    input_received: Object.keys(data)
  };
}

function calculateCredits(apiKey, serviceKey) {
  const creditMap = {
    'apikey_user_free_123': 1,
    'apikey_pro_456': 0.5,
    'apikey_enterprise_789': 0.1
  };
  return creditMap[apiKey] || 1;
}

function getRemainingCredits(apiKey) {
  // در نسخه واقعی از دیتابیس خوانده می‌شود
  const credits = {
    'apikey_user_free_123': 95,
    'apikey_pro_456': 495,
    'apikey_enterprise_789': 9999
  };
  return credits[apiKey] || 0;
}

// ==================== راه‌اندازی سرور ====================
app.listen(PORT, () => {
  console.log(`
  🚀 TetraSaaS Gateway v2.0
  ========================================
  ✅ Gateway فعال شد!
  📍 پورت: ${PORT}
  
  🌐 آدرس‌های مهم:
     📖 مستندات:   http://localhost:${PORT}/docs
     ❤️  سلامت:    http://localhost:${PORT}/health
     📊 سرویس‌ها:  http://localhost:${PORT}/services
     🏠 صفحه اصلی: http://localhost:${PORT}/
  
  📱 داشبورد مدیریت: http://localhost:5173/
  
  🔑 کلیدهای تست:
     - رایگان: apikey_user_free_123
     - حرفه‌ای: apikey_pro_456
     - سازمانی: apikey_enterprise_789
  
  ⏰ زمان راه‌اندازی: ${new Date().toLocaleTimeString('fa-IR')}
  ========================================
  `);
  
  logger.info(`Gateway started on port ${PORT}`);
});
