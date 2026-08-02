import { getUserById } from './services/UserService';

(async () => {
    console.log('🧪 تست سیستم مدیریت خطای Tetra\n');
    
    const tests = [
        { id: '123', desc: 'سناریوی موفق' },
        { id: '', desc: 'خطای اعتبارسنجی (خالی)' },
        { id: 'ab', desc: 'خطای اعتبارسنجی (کوتاه)' },
        { id: 'not-found', desc: 'خطای پایگاه داده (پیدا نشد)' },
        { id: 'trigger-db-error', desc: 'خطای بحرانی پایگاه داده' }
    ];
    
    for (const test of tests) {
        console.log(`--- ${test.desc}: ---`);
        const result = await getUserById(test.id);
        if (result.success) console.log('✅ کاربر:', result.data);
        else console.log(`❌ خطا: ${result.error?.code} - ${result.error?.message}`);
    }
    
    console.log('\n✅ تمام تست‌ها اجرا شدند.');
})();
