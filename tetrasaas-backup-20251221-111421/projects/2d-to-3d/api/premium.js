const express = require('express');
const router = express.Router();

// جدول قیمت‌گذاری
const PRICING = {
  BASIC: { price: 0, features: ['۳ پروژه ابتدایی', 'استفاده محدود'] },
  PRO: { price: 29000, features: ['تمام ۵ پروژه', 'قابلیت ذخیره', 'پشتیبانی'] },
  ENTERPRISE: { price: 99000, features: ['همه قابلیت‌ها', 'API اختصاصی', 'لاگین سازمانی'] }
};

// صفحه خرید
router.get('/pricing', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <title>خرید اشتراک | تتراشاپ</title>
      <style>
        body { font-family: 'Vazirmatn'; padding: 30px; background: #f5f5f5; }
        .pricing-table { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin: 40px auto; max-width: 1200px; }
        .plan { background: white; border-radius: 20px; padding: 30px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s; }
        .plan:hover { transform: translateY(-10px); }
        .plan h3 { font-size: 24px; color: #333; }
        .price { font-size: 48px; color: #0070f3; margin: 20px 0; }
        .btn-buy { background: #0070f3; color: white; padding: 15px 40px; border: none; border-radius: 10px; font-size: 18px; cursor: pointer; margin-top: 20px; }
        .features { text-align: right; margin: 30px 0; }
        .features li { padding: 10px 0; border-bottom: 1px solid #eee; }
      </style>
    </head>
    <body>
      <h1 style="text-align: center;">🎯 طرح‌های اشتراک تتراشاپ</h1>
      
      <div class="pricing-table">
        <div class="plan">
          <h3>🥉 رایگان</h3>
          <div class="price">رایگان</div>
          <ul class="features">
            <li>✓ دسترسی به ۳ پروژه اول</li>
            <li>✓ استفاده روزانه ۱ ساعته</li>
            <li>✗ بدون قابلیت ذخیره</li>
            <li>✗ بدون پشتیبانی</li>
          </ul>
          <a href="/"><button class="btn-buy">شروع رایگان</button></a>
        </div>
        
        <div class="plan" style="border: 3px solid #0070f3;">
          <h3>🥈 حرفه‌ای</h3>
          <div class="price">۲۹,۰۰۰ تومان<small>/ماه</small></div>
          <ul class="features">
            <li>✓ دسترسی به تمام ۵ پروژه</li>
            <li>✓ استفاده نامحدود</li>
            <li>✓ قابلیت ذخیره و دانلود</li>
            <li>✓ پشتیبانی ۲۴ ساعته</li>
            <li>✓ API اختصاصی</li>
          </ul>
          <a href="https://zarinp.al/123456" target="_blank">
            <button class="btn-buy" style="background: #ff6b00;">خرید اشتراک</button>
          </a>
          <p style="color: #666; margin-top: 15px;">💳 پرداخت از طریق درگاه زرین‌پال</p>
        </div>
        
        <div class="plan">
          <h3>🏢 سازمانی</h3>
          <div class="price">۹۹,۰۰۰ تومان<small>/ماه</small></div>
          <ul class="features">
            <li>✓ همه قابلیت‌های حرفه‌ای</li>
            <li>✓ لاگین سازمانی</li>
            <li>✓ دامنه اختصاصی</li>
            <li>✓ گزارش‌گیری پیشرفته</li>
            <li>✓ پشتیبانی اختصاصی</li>
          </ul>
          <a href="mailto:sales@tetrashop.ir?subject=درخواست اشتراک سازمانی">
            <button class="btn-buy" style="background: #333;">تماس با فروش</button>
          </a>
        </div>
      </div>
      
      <div style="max-width: 800px; margin: 50px auto; background: white; padding: 30px; border-radius: 15px;">
        <h2>💰 راه‌های پرداخت:</h2>
        <div style="display: flex; gap: 20px; margin-top: 20px;">
          <div style="flex: 1; text-align: center;">
            <img src="https://static.zarinpal.com/static/images/logo.svg" width="100">
            <p>زرین‌پال</p>
          </div>
          <div style="flex: 1; text-align: center;">
            <div style="font-size: 40px;">💳</div>
            <p>کارت‌های بانکی</p>
          </div>
          <div style="flex: 1; text-align: center;">
            <div style="font-size: 40px;">🤝</div>
            <p>پرداخت حضوری (تهران)</p>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 40px;">
        <a href="/" style="color: #0070f3; text-decoration: none;">← بازگشت به صفحه اصلی</a>
      </div>
    </body>
    </html>
  `);
});

// صفحه موفقیت پرداخت
router.get('/payment/success', (req, res) => {
  res.send(`
    <div style="text-align: center; padding: 100px; font-family: 'Vazirmatn';">
      <h1 style="color: #4CAF50;">✅ پرداخت موفق</h1>
      <p>اشتراک حرفه‌ای شما فعال شد!</p>
      <p>کد فعالسازی: TETRA-${Date.now().toString(36).toUpperCase()}</p>
      <a href="/" style="display: inline-block; margin-top: 30px; padding: 15px 30px; background: #0070f3; color: white; text-decoration: none; border-radius: 10px;">شروع استفاده از پروژه‌ها</a>
    </div>
  `);
});

module.exports = router;
