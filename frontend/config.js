// =============================================
//  تنظیمات سرویس‌های پلتفرم یکپارچه
//  آدرس هر سرویس را در اینجا وارد کنید
// =============================================

const SERVICES_CONFIG = [
    {
        id: '3d',
        name: '🎨 تبدیل 2D به 3D',
        desc: 'تبدیل تصاویر به مدل‌های سه‌بعدی',
        url: 'https://3d-conversion.vercel.app',  // ← آدرس واقعی سرویس 3D
        status: 'online' // 'online' | 'offline' | 'pending'
    },
    {
        id: 'nlp',
        name: '🧠 پردازش زبان طبیعی',
        desc: 'تحلیل متن، خلاصه‌سازی و پاسخ‌گویی',
        url: 'https://nlp-engine.vercel.app',     // ← آدرس واقعی سرویس NLP
        status: 'online'
    },
    {
        id: 'shop',
        name: '🛍️ فروشگاه',
        desc: 'مدیریت محصولات، سبد خرید و پرداخت',
        url: 'https://tetrashop-shop.vercel.app', // ← آدرس واقعی فروشگاه
        status: 'pending'
    },
    {
        id: 'admin',
        name: '📊 داشبورد مدیریت',
        desc: 'نظارت بر عملکرد و مدیریت کاربران',
        url: 'https://tetrashop-admin.vercel.app',// ← آدرس واقعی داشبورد
        status: 'pending'
    },
    {
        id: 'chess',
        name: '♟️ موتور شطرنج',
        desc: 'بازی شطرنج با هوش مصنوعی',
        url: 'https://tetrashop-chess.vercel.app',// ← آدرس واقعی شطرنج
        status: 'pending'
    },
    {
        id: 'olympic',
        name: '🏅 بازی‌های المپیک',
        desc: 'بازی‌های تعاملی المپیکی',
        url: 'https://tetrashop-olympic.vercel.app', // ← آدرس واقعی المپیک
        status: 'pending'
    },
    {
        id: 'ai-manager',
        name: '🤖 مدیریت پروژه با AI',
        desc: 'پیش‌بینی و اولویت‌بندی پروژه‌ها',
        url: 'https://ai-project-manager-light.vercel.app', // ← آدرس واقعی AI Manager
        status: 'online'
    },
    {
        id: 'probability',
        name: '📈 ابزارهای احتمالات',
        desc: 'محاسبات آماری و احتمالاتی',
        url: 'https://tetrashop-probability.vercel.app', // ← آدرس واقعی احتمالات
        status: 'pending'
    }
];

// =============================================
//  در صورت مستقر نبودن سرویس، می‌توانید:
//  1. status را به 'offline' تغییر دهید
//  2. url را به '#' یا '' تنظیم کنید
// =============================================
