// اطلاعات پروژه‌های تتراشاپ
const projects = [
    {
        id: 1,
        name: "شطرنج تعاملی",
        description: "بازی شطرنج با هوش مصنوعی و سیستم درآمدزایی",
        icon: "♔",
        color: "linear-gradient(135deg, #3a2c2c, #5a4444)",
        features: [
            "هوش مصنوعی با ۳ سطح دشواری",
            "ذخیره خودکار بازی‌ها",
            "تحلیل حرکات در حین بازی",
            "سیستم رتبه‌بندی آنلاین"
        ],
        tech: ["JavaScript", "HTML5", "CSS3"],
        path: "/chess",
        income: 228000,
        premium: true,
        stats: {
            users: "۱,۲۳۴",
            games: "۵,۶۷۸",
            rating: "۴.۸ ★"
        }
    },
    {
        id: 2,
        name: "نویسنده هوشمند",
        description: "ویرایشگر متن پیشرفته با قابلیت‌های هوشمند",
        icon: "✍️",
        color: "linear-gradient(135deg, #4776E6, #8E54E9)",
        features: [
            "پیشنهادات هوشمند برای ادامه متن",
            "آمار نوشتن زنده",
            "قالب‌های آماده متعدد",
            "خروجی PDF و Word"
        ],
        tech: ["JavaScript", "Markdown", "LocalStorage"],
        path: "/writer",
        income: 228000,
        premium: true,
        stats: {
            docs: "۴,۵۶۷",
            words: "۲.۱M+",
            users: "۸۹۰"
        }
    },
    {
        id: 3,
        name: "تحلیلگر هوشمند متن",
        description: "پردازش زبان طبیعی با تحلیل پیشرفته",
        icon: "🧠",
        color: "linear-gradient(135deg, #667eea, #764ba2)",
        features: [
            "تحلیل احساسات متن",
            "استخراج کلیدواژه‌ها",
            "خلاصه‌سازی خودکار",
            "پردازش ۲۲۲+ پست"
        ],
        tech: ["NLP", "JavaScript", "Regex"],
        path: "/nlp",
        income: 228000,
        premium: true,
        stats: {
            posts: "۲۲۲",
            accuracy: "۹۸.۲%",
            words: "۱۴,۵۶۷"
        }
    },
    {
        id: 4,
        name: "شبیه‌ساز کوانتومی",
        description: "شبیه‌سازی کامپیوتر کوانتومی با نمایش بصری",
        icon: "⚛️",
        color: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
        features: [
            "گیت‌های کوانتومی کامل",
            "نمایش کره بلوخ",
            "شبیه‌سازی چند کیوبیتی",
            "آموزش مفاهیم کوانتومی"
        ],
        tech: ["Three.js", "Quantum", "WebGL"],
        path: "/quantum",
        income: 228000,
        premium: true,
        stats: {
            qubits: "۵",
            simulations: "۱,۲۳۴",
            accuracy: "۹۵.۷%"
        }
    },
    {
        id: 5,
        name: "باغبانی هوشمند",
        description: "مدیریت هوشمند باغ و گیاهان با سنسورهای مجازی",
        icon: "🌿",
        color: "linear-gradient(135deg, #10b981, #059669)",
        features: [
            "مانیتورینگ سنسورهای مجازی",
            "سیستم آبیاری هوشمند",
            "پیش‌بینی رشد گیاهان",
            "هشدارهای خودکار"
        ],
        tech: ["IoT", "Charts.js", "LocalStorage"],
        path: "/gardening",
        income: 228000,
        premium: true,
        stats: {
            plants: "۱۲",
            sensors: "۴",
            harvests: "۴۵"
        }
    },
    {
        id: 6,
        name: "تشخیص صوت هوشمند",
        description: "تبدیل گفتار به متن با دقت بالا",
        icon: "🎤",
        color: "linear-gradient(135deg, #ec4899, #8b5cf6)",
        features: [
            "تشخیص صوت زنده",
            "پشتیبانی از چند زبان",
            "تاریخچه ذخیره شده",
            "دقت تشخیص ۹۵٪+"
        ],
        tech: ["Web Speech API", "JavaScript", "LocalStorage"],
        path: "/voice-recognition",
        income: 228000,
        premium: true,
        stats: {
            recordings: "۳۴۵",
            accuracy: "۹۲.۵%",
            languages: "۳"
        }
    },
    {
        id: 7,
        name: "تبدیل ۲D به ۳D",
        description: "تبدیل تصاویر دو‌بعدی به مدل‌های سه‌بعدی",
        icon: "🎨",
        color: "linear-gradient(135deg, #6366f1, #7c3aed)",
        features: [
            "تبدیل خودکار عمق",
            "کنترل‌های کامل نورپردازی",
            "خروجی در کیفیت‌های مختلف",
            "پریست‌های آماده"
        ],
        tech: ["Three.js", "WebGL", "Canvas API"],
        path: "/2d-to-3d",
        income: 228000,
        premium: true,
        stats: {
            conversions: "۱۲۳",
            polygons: "۱۲,۸۰۰",
            quality: "HD"
        }
    }
];

// ایجاد کارت‌های پروژه
function createProjectCards() {
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = `project-card ${project.premium ? 'premium' : ''}`;
        
        card.innerHTML = `
            <div class="project-header">
                <div class="project-icon" style="background: ${project.color};">
                    <span>${project.icon}</span>
                </div>
                <div class="project-info">
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                </div>
            </div>
            
            <div class="project-content">
                <ul class="project-features">
                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                
                <div class="tech-stack">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-top: 20px; flex-wrap: wrap; gap: 15px;">
                    ${Object.entries(project.stats).map(([key, value]) => `
                        <div style="text-align: center;">
                            <div style="font-size: 1.2rem; font-weight: bold; color: var(--primary);">${value}</div>
                            <div style="font-size: 0.8rem; color: #94a3b8;">${getStatLabel(key)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="project-footer">
                <div class="project-income">
                    <div class="income-amount">${formatNumber(project.income)}</div>
                    <div class="income-label">درآمد ماهانه</div>
                </div>
                
                <button class="project-btn" data-path="${project.path}">
                    <i class="fas fa-play-circle"></i> اجرای پروژه
                </button>
            </div>
        `;
        
        projectsGrid.appendChild(card);
    });
    
    // اضافه کردن event listener برای دکمه‌ها
    document.querySelectorAll('.project-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const path = this.getAttribute('data-path');
            openProject(path);
        });
    });
}

// فرمت اعداد به فارسی
function formatNumber(num) {
    return num.toLocaleString('fa-IR') + ' تومان';
}

// دریافت برچسب آمار
function getStatLabel(key) {
    const labels = {
        'users': 'کاربران',
        'games': 'بازی‌ها',
        'rating': 'امتیاز',
        'docs': 'اسناد',
        'words': 'کلمات',
        'posts': 'پست‌ها',
        'accuracy': 'دقت',
        'qubits': 'کیوبیت‌ها',
        'simulations': 'شبیه‌سازی',
        'plants': 'گیاهان',
        'sensors': 'سنسورها',
        'harvests': 'برداشت',
        'recordings': 'ضبط‌ها',
        'languages': 'زبان‌ها',
        'conversions': 'تبدیل‌ها',
        'polygons': 'پلیگون‌ها',
        'quality': 'کیفیت'
    };
    
    return labels[key] || key;
}

// اصلاح تابع openProject برای کار با Vercel/GitHub Pages
function openProject(path) {
    // نمایش پیام در حال بارگذاری
    showLoadingMessage(`در حال بارگذاری ${getProjectName(path)}...`);
    
    // چندین روش برای اطمینان از کارکرد لینک‌ها
    const projectPath = path.startsWith('/') ? path : '/' + path;
    
    // روش ۱: استفاده از window.location (برای Vercel)
    setTimeout(() => {
        // حذف index.html اضافی اگر وجود دارد
        const cleanPath = projectPath.replace(/\/index\.html$/, '');
        
        // آزمایش چندین روش
        tryMethod1(cleanPath);
    }, 800);
}

function tryMethod1(path) {
    // روش ۱: هدایت مستقیم
    window.location.href = path;
}

function tryMethod2(path) {
    // روش ۲: استفاده از anchor tag
    const link = document.createElement('a');
    link.href = path;
    link.target = '_self';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function getProjectName(path) {
    const projects = {
        '/chess': 'شطرنج تعاملی',
        '/writer': 'نویسنده هوشمند',
        '/nlp': 'تحلیلگر متن',
        '/quantum': 'شبیه‌ساز کوانتومی',
        '/gardening': 'باغبانی هوشمند',
        '/voice-recognition': 'تشخیص صوت',
        '/2d-to-3d': 'تبدیل ۲D به ۳D'
    };
    return projects[path] || 'پروژه';
}

// نمایش پیام بارگذاری
function showLoadingMessage(message) {
    // حذف پیام قبلی
    const oldMessage = document.querySelector('.loading-message');
    if (oldMessage) {
        oldMessage.remove();
    }
    
    // ایجاد پیام جدید
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'loading-message';
    loadingMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 30px 50px;
        border-radius: 15px;
        z-index: 10000;
        text-align: center;
        border: 2px solid var(--primary);
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        font-family: Vazirmatn;
        animation: fadeIn 0.3s ease;
    `;
    
    loadingMessage.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 20px; color: var(--primary);">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
        <h3 style="margin-bottom: 10px;">${message}</h3>
        <p style="color: #c7d2fe; font-size: 0.9rem;">لطفاً چند لحظه صبر کنید...</p>
    `;
    
    document.body.appendChild(loadingMessage);
    
    // حذف خودکار بعد از 5 ثانیه (اگر پروژه باز نشد)
    setTimeout(() => {
        if (loadingMessage.parentNode) {
            loadingMessage.style.animation = 'fadeOut 0.5s ease forwards';
            setTimeout(() => loadingMessage.remove(), 500);
            
            // اگر پروژه باز نشد، کاربر را مطلع کن
            showNotification('اگر پروژه باز نشد، مستقیماً از نوار آدرس وارد شوید');
        }
    }, 5000);
}

// ایجاد یک صفحه تست برای بررسی لینک‌ها
function createTestPage() {
    const testDiv = document.createElement('div');
    testDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 15px;
        border-radius: 10px;
        z-index: 9999;
        font-family: Vazirmatn;
        font-size: 12px;
        border: 2px solid var(--primary);
        max-width: 300px;
    `;
    
    testDiv.innerHTML = `
        <strong style="color: #8b5cf6;">🔗 تست سریع لینک‌ها:</strong><br>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
            ${Object.entries({
                '♟️': '/chess',
                '✍️': '/writer',
                '🧠': '/nlp',
                '⚛️': '/quantum',
                '🌿': '/gardening',
                '🎤': '/voice-recognition',
                '🎨': '/2d-to-3d'
            }).map(([icon, path]) => `
                <a href="${path}" 
                   style="color: white; background: rgba(139, 92, 246, 0.3); padding: 5px 10px; border-radius: 5px; text-decoration: none; display: inline-block;"
                   onclick="event.preventDefault(); openProject('${path}')">
                   ${icon}
                </a>
            `).join('')}
        </div>
        <div style="margin-top: 10px; font-size: 10px; color: #c7d2fe;">
            در صورت مشکل، URL را مستقیماً وارد کنید
        </div>
    `;
    
    document.body.appendChild(testDiv);
}

// نمایش نوتیفیکیشن
function showNotification(message) {
    // حذف نوتیفیکیشن قبلی
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    // ایجاد نوتیفیکیشن جدید
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        color: var(--dark);
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideDown 0.5s ease;
        border-right: 5px solid var(--primary);
        max-width: 90%;
        font-family: Vazirmatn;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-info-circle" style="color: var(--primary);"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // حذف خودکار
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideUp 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }
    }, 4000);
}

// محاسبه کل درآمد
function calculateTotalIncome() {
    return projects.reduce((total, project) => total + project.income, 0);
}

// به‌روزرسانی کل درآمد
function updateTotalIncome() {
    const totalIncome = calculateTotalIncome();
    const incomeElement = document.querySelector('.total-income .amount');
    if (incomeElement) {
        incomeElement.textContent = totalIncome.toLocaleString('fa-IR') + ' تومان';
    }
}

// نمایش اطلاعات پروژه در کنسول
function logProjectInfo() {
    console.log('📊 اطلاعات پروژه‌های تتراشاپ:');
    projects.forEach((project, index) => {
        console.log(`\n${index + 1}. ${project.name}`);
        console.log(`   📁 مسیر: ${project.path}`);
        console.log(`   💰 درآمد: ${project.income.toLocaleString('fa-IR')} تومان`);
        console.log(`   ⭐ ویژگی‌ها: ${project.features.length} مورد`);
    });
    console.log(`\n💰 کل درآمد ماهانه: ${calculateTotalIncome().toLocaleString('fa-IR')} تومان`);
}

// بررسی دسترسی پروژه‌ها
async function checkProjectAccess() {
    console.log('🔍 بررسی دسترسی پروژه‌ها:');
    
    const projectUrls = projects.map(p => p.path);
    
    for (const path of projectUrls) {
        try {
            const response = await fetch(path, { method: 'HEAD' });
            console.log(`${path}: ${response.ok ? '✅ قابل دسترسی' : '❌ مشکل دارد'}`);
        } catch (error) {
            console.log(`${path}: ❌ خطا - ${error.message}`);
        }
    }
}

// مقداردهی اولیه
function init() {
    createProjectCards();
    updateTotalIncome();
    logProjectInfo();
    
    // بررسی دسترسی (فقط در حالت توسعه)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        checkProjectAccess();
    }
    
    // نمایش خوشامدگویی
    setTimeout(() => {
        console.log('🚀 پلتفرم تتراشاپ با موفقیت بارگذاری شد!');
        console.log('🎯 تعداد پروژه‌ها:', projects.length);
        console.log('🌐 آدرس فعلی:', window.location.href);
    }, 1000);
}

// بارگذاری صفحه
document.addEventListener('DOMContentLoaded', function() {
    // اضافه کردن استایل‌های انیمیشن
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -40%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
        
        @keyframes fadeOut {
            to { opacity: 0; visibility: hidden; }
        }
        
        @keyframes slideDown {
            from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateX(-50%) translateY(0); opacity: 1; }
            to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // اجرای مقداردهی اولیه
    init();
    
    // ایجاد صفحه تست (فقط در حالت توسعه)
    if (!window.location.href.includes('vercel.app') && !window.location.href.includes('github.io')) {
        createTestPage();
    }
});

// API برای دسترسی به اطلاعات پروژه‌ها از بیرون
window.TetrashopProjects = {
    projects: projects,
    getProjectById: function(id) {
        return projects.find(project => project.id === id);
    },
    getProjectByPath: function(path) {
        return projects.find(project => project.path === path);
    },
    getTotalIncome: calculateTotalIncome,
    openProject: openProject,
    refreshProjects: function() {
        createProjectCards();
        updateTotalIncome();
    }
};

// افزودن event listener برای لینک‌ها
document.addEventListener('click', function(e) {
    // اگر کلیک روی دکمه پروژه بود
    if (e.target.closest('.project-btn')) {
        e.preventDefault();
        const btn = e.target.closest('.project-btn');
        const path = btn.getAttribute('data-path') || btn.dataset.path;
        if (path) {
            openProject(path);
        }
    }
});

// راهنمای URL برای کاربران
function showURLAccessGuide() {
    const guide = `
        🧭 راهنمای دسترسی به پروژه‌ها:
        
        ۱. شطرنج: ${window.location.origin}/chess
        ۲. نویسنده: ${window.location.origin}/writer
        ۳. تحلیلگر متن: ${window.location.origin}/nlp
        ۴. شبیه‌ساز کوانتومی: ${window.location.origin}/quantum
        ۵. باغبانی: ${window.location.origin}/gardening
        ۶. تشخیص صوت: ${window.location.origin}/voice-recognition
        ۷. تبدیل ۳D: ${window.location.origin}/2d-to-3d
        
        💡 نکته: اگر دکمه‌ها کار نمی‌کنند، آدرس بالا را مستقیماً در مرورگر وارد کنید.
    `;
    
    console.log(guide);
    
    // نمایش در صفحه برای کاربران
    if (!document.querySelector('.url-guide')) {
        const guideDiv = document.createElement('div');
        guideDiv.className = 'url-guide';
        guideDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.95);
            color: white;
            padding: 30px;
            border-radius: 15px;
            z-index: 10001;
            max-width: 600px;
            border: 3px solid var(--primary);
            font-family: Vazirmatn;
            display: none;
        `;
        
        guideDiv.innerHTML = `
            <h3 style="color: var(--primary); margin-bottom: 20px;">🧭 راهنمای دسترسی</h3>
            <div style="line-height: 2;">
                <div>♟️ شطرنج: <code>${window.location.origin}/chess</code></div>
                <div>✍️ نویسنده: <code>${window.location.origin}/writer</code></div>
                <div>🧠 تحلیلگر: <code>${window.location.origin}/nlp</code></div>
                <div>⚛️ کوانتومی: <code>${window.location.origin}/quantum</code></div>
                <div>🌿 باغبانی: <code>${window.location.origin}/gardening</code></div>
                <div>🎤 تشخیص صوت: <code>${window.location.origin}/voice-recognition</code></div>
                <div>🎨 تبدیل ۳D: <code>${window.location.origin}/2d-to-3d</code></div>
            </div>
            <button onclick="this.parentElement.style.display='none'" 
                    style="margin-top: 20px; padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 5px; cursor: pointer;">
                بستن
            </button>
        `;
        
        document.body.appendChild(guideDiv);
        
        // نمایش راهنما اگر بعد از 10 ثانیه پروژه‌ها کار نکنند
        setTimeout(() => {
            if (!sessionStorage.getItem('guideShown')) {
                guideDiv.style.display = 'block';
                sessionStorage.setItem('guideShown', 'true');
            }
        }, 10000);
    }
}

// بعد از بارگذاری کامل، راهنمای URL را نشان بده
window.addEventListener('load', function() {
    setTimeout(showURLAccessGuide, 3000);
    
    // نمایش وضعیت
    console.log('🌐 وضعیت دسترسی پروژه‌ها:');
    console.log('📍 URL فعلی:', window.location.href);
    console.log('📁 Base URL:', window.location.origin);
    console.log('📂 مسیر:', window.location.pathname);
    
    // ایجاد یک دکمه اضطراری برای دسترسی
    const emergencyBtn = document.createElement('button');
    emergencyBtn.innerHTML = '🚨 راهنمای دسترسی اضطراری';
    emergencyBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b6b, #ee5a52);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        cursor: pointer;
        z-index: 9998;
        font-family: Vazirmatn;
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
    `;
    emergencyBtn.onclick = function() {
        document.querySelector('.url-guide').style.display = 'block';
    };
    document.body.appendChild(emergencyBtn);
});
/* اضافه کردن استایل دینامیک برای رفع نوارهای سفید */
document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    html, body { background: #f8f9fa !important; }
    *::-webkit-scrollbar { width: 8px; }
    *::-webkit-scrollbar-track { background: #f1f1f1; }
    *::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
    *::-webkit-scrollbar-thumb:hover { background: #555; }
  `;
  document.head.appendChild(style);
});
/* اضافه کردن استایل دینامیک برای رفع نوارهای سفید */
document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    html, body { background: #f8f9fa !important; }
    *::-webkit-scrollbar { width: 8px; }
    *::-webkit-scrollbar-track { background: #f1f1f1; }
    *::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
    *::-webkit-scrollbar-thumb:hover { background: #555; }
  `;
  document.head.appendChild(style);
});
