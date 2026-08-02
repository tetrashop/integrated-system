const TetraSaaS = require('../tetra-sdk');

async function main() {
  console.log('🚀 شروع تست TetraSaaS SDK\n');
  
  // ایجاد نمونه SDK
  const tetra = new TetraSaaS('apikey_user_free_123');
  
  // ۱. تست اتصال
  console.log('۱. 🔍 تست اتصال به Gateway...');
  try {
    const pingResult = await tetra.ping();
    console.log(`   ✅ Gateway پاسخ داد! تأخیر: ${pingResult.latency}\n`);
  } catch (error) {
    console.log('   ❌ Gateway در دسترس نیست\n');
    return;
  }
  
  // ۲. دریافت لیست سرویس‌ها
  console.log('۲. 📊 دریافت لیست سرویس‌ها...');
  try {
    const services = await tetra.listServices();
    console.log(`   ✅ ${services.count} سرویس فعال:\n`);
    services.services.slice(0, 3).forEach(service => {
      console.log(`   • ${service.name}`);
    });
    console.log('   ...\n');
  } catch (error) {
    console.log('   ❌ خطا در دریافت لیست سرویس‌ها\n');
  }
  
  // ۳. تست سرویس تحلیل متن
  console.log('۳. 📝 تست سرویس تحلیل متن (NLP)...');
  try {
    const analysis = await tetra.analyzeText('ایران کشوری با تمدن کهن و فرهنگی غنی است.');
    console.log(`   ✅ تحلیل موفقیت‌آمیز بود!`);
    console.log(`   📊 احساس متن: ${analysis.result?.analysis?.sentiment || 'N/A'}`);
    if (analysis.result?.analysis?.keywords) {
      console.log(`   🔑 کلمات کلیدی: ${analysis.result.analysis.keywords.slice(0, 3).join(', ')}...\n`);
    }
  } catch (error) {
    console.log(`   ❌ خطا در تحلیل متن: ${error.message}\n`);
  }
  
  // ۴. تست سرویس حل فرمول
  console.log('۴. 🧮 تست سرویس حل فرمول...');
  try {
    const solution = await tetra.solveFormula('a + b * 2', { a: 5, b: 3 });
    console.log(`   ✅ فرمول حل شد!`);
    console.log(`   📝 فرمول: a + b * 2 (a=5, b=3)`);
    console.log(`   🎯 نتیجه: ${solution.result?.result || 'N/A'}\n`);
  } catch (error) {
    console.log(`   ❌ خطا در حل فرمول: ${error.message}\n`);
  }
  
  console.log('✨ تست SDK با موفقیت تکمیل شد!');
  console.log('\n📚 برای اطلاعات بیشتر:');
  console.log('   - مستندات: http://localhost:3000/docs');
  console.log('   - داشبورد: http://localhost:5173');
  console.log('   - Gateway: http://localhost:3000');
}

// اجرای تست
if (require.main === module) {
  main().catch(console.error);
}
