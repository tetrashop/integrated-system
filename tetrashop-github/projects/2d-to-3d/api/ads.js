const express = require('express');
const router = express.Router();

// سیستم تبلیغات
const AD_PLACEMENTS = {
  'sidebar': { price: 50000, duration: 30 }, // 50,000 تومان برای 30 روز
  'banner': { price: 150000, duration: 30 },
  'popup': { price: 300000, duration: 30 },
  'sponsor': { price: 500000, duration: 30 }
};

// صفحه تبلیغات
router.get('/ads', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <title>تبلیغات در تتراشاپ</title>
      <style>
        body { font-family: 'Vazirmatn'; padding: 30px; max-width: 1200px; margin: 0 auto; }
        .ad-types { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; margin: 40px 0; }
        .ad-box { border: 2px solid #ddd; padding: 25px; border-radius: 15px; text-align: center; }
        .ad-box h3 { color: #333; }
        .ad-price { font-size: 32px; color: #d32f2f; margin: 15px 0; }
        .ad-stats { background: #f9f9f9; padding: 20px; border-radius: 10px; margin-top: 40px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 15px; text-align: center; border: 1px solid #ddd; }
        th { background: #f0f0f0; }
      </style>
    </head>
    <body>
      <h1>🎯 تبلیغات در پلتفرم تتراشاپ</h1>
      <p>با بیش از ۱۰,۰۰۰ بازدید ماهانه - مخاطب هدفمند: توسعه‌دهندگان، دانشجویان، علاقه‌مندان به تکنولوژی</p>
      
      <div class="ad-types">
        <div class="ad-box">
          <h3>🏷️ تبلیغ کناره صفحه</h3>
          <div class="ad-price">۵۰,۰۰۰ تومان</div>
          <p>۳۰ روز نمایش</p>
          <p>سایز: ۳۰۰x۶۰۰</p>
          <button onclick="selectAd('sidebar')" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 5px; margin-top: 15px;">انتخاب</button>
        </div>
        
        <div class="ad-box">
          <h3>📢 بنر صفحه اصلی</h3>
          <div class="ad-price">۱۵۰,۰۰۰ تومان</div>
          <p>۳۰ روز نمایش</p>
          <p>سایز: ۷۲۰x۹۰</p>
          <button onclick="selectAd('banner')" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; margin-top: 15px;">انتخاب</button>
        </div>
        
        <div class="ad-box">
          <h3>🌟 اسپانسر ویژه</h3>
          <div class="ad-price">۵۰۰,۰۰۰ تومان</div>
          <p>۳۰ روز نمایش</p>
          <p>لوگو + لینک اختصاصی</p>
          <button onclick="selectAd('sponsor')" style="padding: 10px 20px; background: #FF9800; color: white; border: none; border-radius: 5px; margin-top: 15px;">انتخاب</button>
        </div>
      </div>
      
      <div class="ad-stats">
        <h2>📊 آمار بازدید ماهانه</h2>
        <table>
          <tr>
            <th>پروژه</th>
            <th>بازدید روزانه</th>
            <th>کاربر فعال</th>
            <th>میانگین زمان</th>
          </tr>
          <tr>
            <td>شطرنج</td>
            <td>۱۵۰</td>
            <td>۸۰</td>
            <td>۱۲ دقیقه</td>
          </tr>
          <tr>
            <td>نویسنده</td>
            <td>۲۰۰</td>
            <td>۱۲۰</td>
            <td>۱۸ دقیقه</td>
          </tr>
          <tr>
            <td>کوانتومی</td>
            <td>۱۰۰</td>
            <td>۶۰</td>
            <td>۲۲ دقیقه</td>
          </tr>
          <tr>
            <td>باغ رازآلود</td>
            <td>۱۸۰</td>
            <td>۹۰</td>
            <td>۲۵ دقیقه</td>
          </tr>
          <tr>
            <td>تشخیص گفتار</td>
            <td>۲۵۰</td>
            <td>۱۵۰</td>
            <td>۱۵ دقیقه</td>
          </tr>
          <tr style="background: #e8f5e8;">
            <td><strong>جمع کل</strong></td>
            <td><strong>۸۸۰</strong></td>
            <td><strong>۵۰۰</strong></td>
            <td><strong>۱۸ دقیقه</strong></td>
          </tr>
        </table>
        
        <p style="margin-top: 20px;">📞 برای رزرو تبلیغات: <a href="mailto:ads@tetrashop.ir">ads@tetrashop.ir</a> - تلفن: ۰۹۱۲۳۴۵۶۷۸۹</p>
      </div>
      
      <script>
        function selectAd(type) {
          const ad = {
            'sidebar': { name: 'تبلیغ کناره صفحه', price: 50000 },
            'banner': { name: 'بنر صفحه اصلی', price: 150000 },
            'sponsor': { name: 'اسپانسر ویژه', price: 500000 }
          }[type];
          
          if(confirm(\`آیا می‌خواهید \${ad.name} را به مبلغ \${ad.price.toLocaleString()} تومان رزرو کنید؟\`)) {
            window.location.href = \`/api/ads/book?type=\${type}\`;
          }
        }
      </script>
    </body>
    </html>
  `);
});

router.get('/ads/book', (req, res) => {
  res.send(`
    <div style="font-family: 'Vazirmatn'; padding: 50px; text-align: center;">
      <h1>📋 فرم رزرو تبلیغات</h1>
      <form action="/api/ads/submit" method="post" style="max-width: 500px; margin: 30px auto; text-align: right;">
        <input type="text" name="company" placeholder="نام شرکت/شخص" required style="width: 100%; padding: 10px; margin: 10px 0;"><br>
        <input type="email" name="email" placeholder="ایمیل" required style="width: 100%; padding: 10px; margin: 10px 0;"><br>
        <input type="tel" name="phone" placeholder="تلفن" required style="width: 100%; padding: 10px; margin: 10px 0;"><br>
        <select name="adType" style="width: 100%; padding: 10px; margin: 10px 0;">
          <option value="sidebar">تبلیغ کناره صفحه - ۵۰,۰۰۰ تومان</option>
          <option value="banner">بنر صفحه اصلی - ۱۵۰,۰۰۰ تومان</option>
          <option value="sponsor">اسپانسر ویژه - ۵۰۰,۰۰۰ تومان</option>
        </select><br>
        <textarea name="details" placeholder="توضیحات (سایز، لینک، متن)" rows="4" style="width: 100%; padding: 10px; margin: 10px 0;"></textarea><br>
        <button type="submit" style="background: #4CAF50; color: white; padding: 15px 40px; border: none; border-radius: 10px; font-size: 16px;">ارسال درخواست</button>
      </form>
    </div>
  `);
});

module.exports = router;
