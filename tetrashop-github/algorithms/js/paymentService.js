/**
 * سرویس مدیریت پرداخت‌ها
 */

const PAYMENT_CONFIG = {
  gateway: 'zarinpal', // یا 'idpay', 'parsian'
  currency: 'IRT',
  callbackUrl: process.env.PAYMENT_CALLBACK_URL || 'https://tetrashop100.vercel.app/api/payments/verify'
};

/**
 * ایجاد درگاه پرداخت
 */
export const createPayment = async (amount, description, callbackUrl) => {
  try {
    // شبیه‌سازی ایجاد درگاه پرداخت
    const paymentData = {
      success: true,
      paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: amount,
      description: description,
      gatewayUrl: 'https://sandbox.zarinpal.com/pg/StartPay/' + Math.random().toString(36).substr(2, 16),
      authority: Math.random().toString(36).substr(2, 32).toUpperCase(),
      callbackUrl: callbackUrl || PAYMENT_CONFIG.callbackUrl,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    // ذخیره اطلاعات پرداخت (در حالت واقعی در دیتابیس ذخیره می‌شود)
    console.log('💰 پرداخت ایجاد شد:', paymentData.paymentId);

    return paymentData;

  } catch (error) {
    console.error('❌ خطا در ایجاد پرداخت:', error);
    return {
      success: false,
      error: 'خطا در ایجاد درگاه پرداخت'
    };
  }
};

/**
 * تأیید پرداخت
 */
export const verifyPayment = async (authority, amount) => {
  try {
    // شبیه‌سازی تأیید پرداخت
    const isSuccessful = Math.random() > 0.2; // 80% موفقیت
    
    if (isSuccessful) {
      return {
        success: true,
        refId: Math.random().toString(36).substr(2, 16).toUpperCase(),
        amount: amount,
        status: 'verified',
        verifiedAt: new Date().toISOString(),
        cardNumber: '6219-86**-****-1234'
      };
    } else {
      return {
        success: false,
        error: 'پرداخت ناموفق بود',
        status: 'failed'
      };
    }

  } catch (error) {
    console.error('❌ خطا در تأیید پرداخت:', error);
    return {
      success: false,
      error: 'خطا در تأیید پرداخت'
    };
  }
};

/**
 * دریافت وضعیت پرداخت
 */
export const getPaymentStatus = async (paymentId) => {
  const statuses = ['pending', 'verified', 'failed', 'canceled'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    paymentId: paymentId,
    status: randomStatus,
    checkedAt: new Date().toISOString()
  };
};

/**
 * استرداد پرداخت
 */
export const refundPayment = async (paymentId, amount) => {
  try {
    // شبیه‌سازی استرداد
    const isSuccessful = Math.random() > 0.1; // 90% موفقیت
    
    if (isSuccessful) {
      return {
        success: true,
        refundId: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: amount,
        status: 'refunded',
        refundedAt: new Date().toISOString()
      };
    } else {
      return {
        success: false,
        error: 'استرداد ناموفق بود'
      };
    }

  } catch (error) {
    console.error('❌ خطا در استرداد پرداخت:', error);
    return {
      success: false,
      error: 'خطا در فرآیند استرداد'
    };
  }
};

export const paymentService = {
  createPayment,
  verifyPayment,
  getPaymentStatus,
  refundPayment
};
