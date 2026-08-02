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
                
                <button class="project-btn" onclick="openProject('${project.path}')">
                    <i class="fas fa-play-circle"></i> اجرای پروژه
                </button>
            </div>
        `;
        
        projectsGrid.appendChild(card);
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

// باز کردن پروژه
function openProject(path) {
    // نمایش پیام در حال بارگذاری
    showLoadingMessage(`در حال بارگذاری پروژه...`);
    
    // شبیه‌سازی تأخیر بارگذاری
    setTimeout(() => {
        // در محیط واقعی، این باید به مسیر واقعی پروژه هدایت شود
        window.location.href = path + '/index.html';
    }, 1000);
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
    
    // اضافه کردن استایل انیمیشن
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -40%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
    `;
    document.head.appendChild(style);
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

// مقداردهی اولیه
function init() {
    createProjectCards();
    updateTotalIncome();
    logProjectInfo();
    
    // نمایش خوشامدگویی
    setTimeout(() => {
        console.log('🚀 پلتفرم تتراشاپ با موفقیت بارگذاری شد!');
        console.log('🎯 تعداد پروژه‌ها:', projects.length);
    }, 1000);
}

// بارگذاری صفحه
window.onload = function() {
    init();
    
    // اضافه کردن استایل برای پیام‌ها
    const style = document.createElement('style');
    style.textContent = `
        .loading-message {
            animation: fadeOut 0.5s ease 2s forwards;
        }
        
        @keyframes fadeOut {
            to {
                opacity: 0;
                visibility: hidden;
            }
        }
    `;
    document.head.appendChild(style);
};

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
    openProject: openProject
};
