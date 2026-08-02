/**
 * سیستم مدیریت خطای متمرکز
 */
export class ErrorHandler {
  static handle(error, context = 'general') {
    console.error(`[${context}] Error:`, error);
    
    // ثبت خطا در سرویس لاگینگ (در محیط واقعی)
    if (typeof window !== 'undefined') {
      // ارسال به سرویس مانیتورینگ
      this.logToService(error, context);
    }
    
    // بازگرداندن پیام مناسب به کاربر
    return this.getUserMessage(error);
  }
  
  static getUserMessage(error) {
    if (error.response) {
      switch (error.response.status) {
        case 400: return 'درخواست نامعتبر است';
        case 401: return 'لطفاً وارد شوید';
        case 403: return 'دسترسی غیرمجاز';
        case 404: return 'منبع مورد نظر یافت نشد';
        case 500: return 'خطای داخلی سرور';
        default: return 'خطایی رخ داده است';
      }
    }
    
    return error.message || 'خطای ناشناخته';
  }
  
  static logToService(error, context) {
    // در محیط واقعی، به سرویس‌هایی مثل Sentry ارسال می‌شود
    const logData = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    // ذخیره موقت در localStorage برای دیباگ
    const logs = JSON.parse(localStorage.getItem('error_logs') || '[]');
    logs.push(logData);
    localStorage.setItem('error_logs', JSON.stringify(logs.slice(-50))); // نگهداری ۵۰ خطای آخر
  }
}
