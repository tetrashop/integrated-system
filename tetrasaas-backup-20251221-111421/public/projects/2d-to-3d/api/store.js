const express = require('express');
const router = express.Router();

const PRODUCTS = [
  {
    id: 'chess-source',
    name: 'کد کامل شطرنج',
    price: 49000,
    description: 'سورس کامل بازی شطرنج با هوش مصنوعی',
    features: ['React + TypeScript', 'موتور شطرنج Stockfish', 'قابلیت آنلاین', 'سیستم ریتینگ']
  },
  {
    id: 'writer-source',
    name: 'نویسنده هوشمند',
    price: 69000,
    description: 'ویرایشگر پیشرفته با قابلیت‌های هوشمند',
    features: ['React + Draft.js', 'پیشنهادات هوشمند', 'خروجی PDF', 'ذخیره ابری']
  },
  {
    id: 'quantum-source',
    name: 'شبیه‌ساز کوانتومی',
    price: 89000,
    description: 'شبیه‌سازی مفاهیم کوانتومی با Three.js',
    features: ['Three.js + WebGL', '۱۰ آزمایش کوانتومی', 'انیمیشن‌های تعاملی', 'گزارش‌گیری']
  },
  {
    id: 'all-projects',
    name: 'تمام ۵ پروژه',
    price: 199000,
    description: 'سورس کامل همه پروژه‌ها با پشتیبانی',
    features: ['همه سورس کدها', 'دیتابیس MongoDB', 'API کامل', 'پشتیبانی ۶ ماهه']
  }
];

router.get('/store', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <title>فروشگاه کدهای منبع | تتراشاپ</title>
      <style>
        body { font-family: 'Vazirmatn'; background: #f8f9fa; padding: 30px; }
        .store-header { text-align: center; margin-bottom: 50px; }
        .products { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 1300px; margin: 0 auto; }
        .product-card { background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: all 0.3s; }
        .product-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
        .product-badge { background: #ff6b00; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; margin-bottom: 15px; }
        .product-price { font-size: 36px; color: #333; margin: 20px 0; }
        .btn-buy { background: linear-gradient(45deg, #0070f3, #0056cc); color: white; padding: 15px 40px; border: none; border-radius: 10px; font-size: 18px; cursor: pointer; width: 100%; margin-top: 20px; }
        .features { text-align: right; margin: 25px 0; }
        .features li { padding: 8px 0; border-bottom: 1px solid #eee; }
        .testimonials { max-width: 800px; margin: 60px auto; background: white; padding: 40px; border-radius: 15px; }
      </style>
    </head>
    <body>
      <div class="store-header">
        <h1>💻 فروشگاه کدهای منبع تتراشاپ</h1>
        <p>کدهای کاملاً تمیز، مستند و آماده استفاده</p>
      </div>
      
      <div class="products">
        ${PRODUCTS.map(product => `
          <div class="product-card">
            <div class="product-badge">فروش ویژه</div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">${product.price.toLocaleString()} تومان</div>
            
            <ul class="features">
              ${product.features.map(feat => `<li>✓ ${feat}</li>`).join('')}
            </ul>
            
            <button onclick="buyProduct('${product.id}')" class="btn-buy">خرید و دانلود فوری</button>
            <p style="text-align: center; margin-top: 10px; color: #666;">تحویل آنی پس از پرداخت</p>
          </div>
        `).join('')}
      </div>
      
      <div class="testimonials">
        <h2>📝 نظرات خریداران</h2>
        <div style="margin-top: 30px;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 15px 0;">
            <p>"کد شطرنج عالی بود. در کمتر از ۱ ساعت روی سرور نصب شد."</p>
            <p><strong>👨‍💻 علی محمدی - توسعه‌دهنده</strong></p>
          </div>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 15px 0;">
            <p>"پروژه کوانتومی برای تدریس دانشگاه عالی بود. دانشجوها عاشقش شدن!"</p>
            <p><strong>👨‍🏫 دکتر رضایی - استاد دانشگاه</strong></p>
          </div>
        </div>
      </div>
      
      <div style="max-width: 800px; margin: 50px auto; text-align: center;">
        <h3>❓ سوالات متداول</h3>
        <div style="text-align: right; margin-top: 20px;">
          <p><strong>آیا کدها ریسپانسیو هستند؟</strong> بله، تمام پروژه‌ها برای موبایل و تبلت بهینه شده‌اند.</p>
          <p><strong>پشتیبانی چگونه است؟</strong> ۶ ماه پشتیبانی رایگان از طریق تلگرام و ایمیل.</p>
          <p><strong>آیا می‌توانم کدها را تغییر دهم؟</strong> بله، کدها کاملاً مالکیتی هستند و می‌توانید تغییر دهید.</p>
        </div>
      </div>
      
      <script>
        function buyProduct(productId) {
          const product = ${JSON.stringify(PRODUCTS)}.find(p => p.id === productId);
          if(confirm(\`آیا می‌خواهید \${product.name} را به مبلغ \${product.price.toLocaleString()} تومان خریداری کنید؟\`)) {
            window.open(\`https://zarinp.al/\${productId}\`, '_blank');
          }
        }
      </script>
    </body>
    </html>
  `);
});

module.exports = router;
