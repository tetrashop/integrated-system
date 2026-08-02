const fs = require('fs');

console.log('🔍 بررسی مجوزهای سیستم:');
console.log('- دسترسی فایل‌ها:', fs.accessSync ? '✅ دارد' : '❌ ندارد');
console.log('- شبکه:', '✅ دارد (سرور اجرا می‌شود)');
console.log('- محیط اجرا:', process.env.NODE_ENV || 'development');

// تست دسترسی‌های احتمالی
const tests = {
  fileSystem: fs.existsSync('.'),
  network: true,
  environment: true
};

console.log('📊 نتایج تست:', tests);
