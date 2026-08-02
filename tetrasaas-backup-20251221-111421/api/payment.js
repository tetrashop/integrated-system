const express = require('express');
const router = express.Router();
const Zarinpal = require('zarinpal-checkout');

const zarinpal = Zarinpal.create('YOUR_MERCHANT_ID', true); // true برای سندباکس

// صفحه پرداخت
router.post('/create-payment', async (req, res) => {
  try {
    const amount = 29000; // 29,000 تومان
    const description = 'اشتراک حرفه‌ای تتراشاپ';
    const email = req.body.email || '';
    const mobile = req.body.mobile || '';
    
    const result = await zarinpal.PaymentRequest({
      Amount: amount,
      CallbackURL: 'https://tetrashop-projects-chi.vercel.app/api/payment/verify',
      Description: description,
      Email: email,
      Mobile: mobile
    });
    
    if (result.status === 100) {
      res.redirect(result.url);
    } else {
      res.send('خطا در اتصال به درگاه پرداخت');
    }
  } catch (error) {
    res.status(500).send('خطای سرور');
  }
});

// تایید پرداخت
router.get('/payment/verify', async (req, res) => {
  try {
    const { Authority, Status } = req.query;
    
    if (Status === 'OK') {
      const result = await zarinpal.PaymentVerification({
        Amount: 29000,
        Authority: Authority
      });
      
      if (result.status === 100 || result.status === 101) {
        // پرداخت موفق
        res.redirect('/api/payment/success?RefID=' + result.RefID);
      } else {
        res.send('پرداخت ناموفق بود');
      }
    } else {
      res.send('پرداخت لغو شد');
    }
  } catch (error) {
    res.status(500).send('خطای تایید پرداخت');
  }
});

module.exports = router;
