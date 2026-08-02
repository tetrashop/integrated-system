#!/bin/bash

echo "🧪 تست سریع سیستم مدیریت خطای Tetra"
echo "==================================="

cd /data/data/com.termux/files/home/tetrashop-projects/tetra-error-system

# ۱. کامپایل
echo "🔨 کامپایل کدها..."
npx tsc --noEmit 2>&1 | grep -A5 -B5 "error" || echo "✅ بدون خطای کامپایل"

# ۲. اجرای تست اصلی
echo "🚀 اجرای تست اصلی..."
node -e "
const { getUserById } = require('./dist/services/UserService');

async function runTests() {
    console.log('\\n🎯 شروع تست‌های سیستم...');
    
    const testCases = [
        { id: '123', desc: 'کاربر معتبر' },
        { id: '', desc: 'کاربر خالی' },
        { id: 'ab', desc: 'کاربر کوتاه' },
        { id: 'not-found', desc: 'کاربر ناموجود' },
        { id: 'trigger-db-error', desc: 'خطای دیتابیس' }
    ];
    
    for (const test of testCases) {
        console.log('\\n--- ' + test.desc + ' ---');
        try {
            const result = await getUserById(test.id);
            if (result.success) {
                console.log('✅ موفق: ' + JSON.stringify(result.data));
            } else {
                console.log('❌ خطا: ' + result.error?.code + ' - ' + result.error?.message);
                if (result.metrics) {
                    console.log('📊 متریک‌ها: امتیاز ' + result.metrics.impactScore + 
                              ', MTTR تخمینی: ' + result.metrics.estimatedMTTR + ' دقیقه');
                }
            }
        } catch (e) {
            console.log('💥 خطای غیرمنتظره: ' + e.message);
        }
    }
    
    console.log('\\n🎉 تست‌ها کامل شد!');
}

runTests().catch(console.error);
"

# ۳. بررسی فایل‌ها
echo ""
echo "📁 بررسی ساختار فایل‌ها..."
find src -name "*.ts" -type f | wc -l | xargs echo "تعداد فایل‌های TypeScript:"
find dist -name "*.js" -type f 2>/dev/null | wc -l | xargs echo "تعداد فایل‌های کامپایل شده:"

echo ""
echo "✅ تست سریع کامل شد!"
