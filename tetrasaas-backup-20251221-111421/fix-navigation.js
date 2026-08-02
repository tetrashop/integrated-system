// رفع مشکلات navigation و صفحه کاور سیاه

// 1. رفع تابع loadProjectContent
function fixLoadProjectContent() {
    console.log('🔧 رفع تابع loadProjectContent...');
    
    // پیدا کردن تابع اصلی
    const originalLoadProjectContent = window.loadProjectContent;
    
    if (originalLoadProjectContent) {
        // جایگزینی با نسخه اصلاح شده
        window.loadProjectContent = function(projectId) {
            console.log(`🚀 loadProjectContent فراخوانی شد برای: ${projectId}`);
            
            // پیدا کردن پروژه
            const project = projects.find(p => p.id === projectId);
            if (!project) {
                console.error('❌ پروژه پیدا نشد:', projectId);
                return;
            }
            
            // به‌روزرسانی URL hash
            window.location.hash = `#/${projectId}`;
            
            // پیدا کردن عناصر
            const homePage = document.getElementById('home-page');
            const projectDetail = document.getElementById('project-detail');
            const projectFrame = document.getElementById('project-frame');
            const projectTitle = document.getElementById('project-title');
            const projectDescription = document.getElementById('project-description');
            
            if (!homePage || !projectDetail) {
                console.error('❌ عناصر صفحه پیدا نشدند');
                return;
            }
            
            console.log('🏠 home-page قبل:', homePage.style.display);
            console.log('🎯 project-detail قبل:', projectDetail.style.display);
            
            // 1. ابتدا project-detail را نمایش بده
            projectDetail.style.display = 'block';
            projectDetail.style.visibility = 'visible';
            projectDetail.style.opacity = '1';
            projectDetail.style.position = 'relative';
            projectDetail.style.zIndex = '100';
            projectDetail.style.background = 'white'; // جلوگیری از سیاهی
            
            // 2. سپس home-page را مخفی کن
            homePage.style.display = 'none';
            homePage.style.visibility = 'hidden';
            homePage.style.opacity = '0';
            
            console.log('🏠 home-page بعد:', homePage.style.display);
            console.log('🎯 project-detail بعد:', projectDetail.style.display);
            
            // 3. به‌روزرسانی اطلاعات پروژه
            if (projectTitle) projectTitle.textContent = project.name;
            if (projectDescription) projectDescription.textContent = project.description;
            
            // 4. لود کردن iframe
            if (projectFrame) {
                projectFrame.style.display = 'block';
                projectFrame.style.visibility = 'visible';
                projectFrame.style.opacity = '1';
                projectFrame.style.background = 'white';
                
                // تنظیم src با تاخیر برای اطمینان از نمایش
                setTimeout(() => {
                    projectFrame.src = `/${projectId}/index.html`;
                    console.log(`📦 iframe src تنظیم شد: /${projectId}/index.html`);
                }, 100);
            }
            
            // 5. اضافه کردن کلاس به body
            document.body.classList.add('show-project');
            document.body.classList.remove('show-home');
            
            // 6. اسکرول به بالا
            window.scrollTo(0, 0);
            
            console.log('✅ loadProjectContent با موفقیت اجرا شد');
            
            // 7. دیباگ: بررسی وضعیت بعد از ۱ ثانیه
            setTimeout(() => {
                console.log('🔍 بررسی وضعیت بعد از ۱ ثانیه:');
                console.log('- projectDetail display:', projectDetail.style.display);
                console.log('- projectDetail visibility:', projectDetail.style.visibility);
                console.log('- projectDetail opacity:', projectDetail.style.opacity);
                console.log('- body classes:', document.body.className);
            }, 1000);
        };
        
        console.log('✅ تابع loadProjectContent رفع شد');
    } else {
        console.error('❌ تابع loadProjectContent پیدا نشد');
    }
}

// 2. رفع تابع handleRoute
function fixHandleRoute() {
    console.log('🔧 رفع تابع handleRoute...');
    
    const originalHandleRoute = window.handleRoute;
    
    if (originalHandleRoute) {
        window.handleRoute = function() {
            console.log('🔄 handleRoute فراخوانی شد');
            console.log('📍 hash فعلی:', window.location.hash);
            
            // استخراج projectId از hash
            const hash = window.location.hash.substring(1);
            const match = hash.match(/^\/([^\/]+)/);
            
            if (match && match[1]) {
                const projectId = match[1];
                console.log(`🎯 پیدا کردن پروژه: ${projectId}`);
                
                // استفاده از تابع اصلاح شده
                if (window.loadProjectContent) {
                    window.loadProjectContent(projectId);
                } else {
                    console.error('❌ loadProjectContent پیدا نشد');
                }
            } else {
                // نمایش صفحه اصلی
                console.log('🏠 نمایش صفحه اصلی');
                showHomePage();
            }
        };
        
        console.log('✅ تابع handleRoute رفع شد');
    }
}

// 3. تابع نمایش صفحه اصلی
function showHomePage() {
    console.log('🏠 اجرای showHomePage...');
    
    const homePage = document.getElementById('home-page');
    const projectDetail = document.getElementById('project-detail');
    const projectFrame = document.getElementById('project-frame');
    
    if (homePage && projectDetail) {
        // 1. نمایش home-page
        homePage.style.display = 'block';
        homePage.style.visibility = 'visible';
        homePage.style.opacity = '1';
        
        // 2. مخفی کردن project-detail
        projectDetail.style.display = 'none';
        projectDetail.style.visibility = 'hidden';
        projectDetail.style.opacity = '0';
        
        // 3. توقف iframe اگر وجود دارد
        if (projectFrame) {
            projectFrame.src = 'about:blank';
        }
        
        // 4. حذف کلاس‌ها
        document.body.classList.remove('show-project');
        document.body.classList.add('show-home');
        
        // 5. اسکرول به بالا
        window.scrollTo(0, 0);
        
        console.log('✅ صفحه اصلی نمایش داده شد');
    }
}

// 4. تابع بازگشت به صفحه اصلی
function addBackButton() {
    console.log('🔧 اضافه کردن دکمه بازگشت...');
    
    const backButton = document.createElement('button');
    backButton.id = 'fixed-back-button';
    backButton.innerHTML = '← بازگشت به صفحه اصلی';
    backButton.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-family: inherit;
        font-size: 14px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    `;
    
    backButton.addEventListener('click', function() {
        console.log('🔄 کلیک روی دکمه بازگشت');
        showHomePage();
        window.location.hash = '';
    });
    
    document.body.appendChild(backButton);
    
    // فقط در صفحات پروژه نمایش داده شود
    function updateBackButtonVisibility() {
        const projectDetail = document.getElementById('project-detail');
        if (projectDetail && projectDetail.style.display === 'block') {
            backButton.style.display = 'block';
        } else {
            backButton.style.display = 'none';
        }
    }
    
    // مانیتور تغییرات
    setInterval(updateBackButtonVisibility, 500);
    
    console.log('✅ دکمه بازگشت اضافه شد');
}

// 5. راه‌اندازی زمانی که DOM آماده است
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 شروع رفع مشکلات navigation...');
    
    // رفع توابع
    fixLoadProjectContent();
    fixHandleRoute();
    
    // اضافه کردن دکمه بازگشت
    addBackButton();
    
    // مانیتور کلیک‌ها
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.hash && link.hash.startsWith('#/')) {
            e.preventDefault();
            const projectId = link.hash.substring(2);
            console.log(`🖱️ کلیک روی پروژه: ${projectId}`);
            
            if (window.loadProjectContent) {
                window.loadProjectContent(projectId);
            }
        }
    });
    
    // اجرای handleRoute اولیه
    setTimeout(() => {
        if (window.handleRoute) {
            window.handleRoute();
        }
    }, 100);
    
    console.log('✅ مشکلات navigation رفع شدند');
});

// 6. دیباگ helper
window.debugNavigation = function() {
    console.log('🔧 دیباگ navigation:');
    console.log('- hash:', window.location.hash);
    
    const homePage = document.getElementById('home-page');
    const projectDetail = document.getElementById('project-detail');
    
    if (homePage) {
        console.log('- homePage display:', homePage.style.display);
        console.log('- homePage visibility:', homePage.style.visibility);
        console.log('- homePage opacity:', homePage.style.opacity);
    }
    
    if (projectDetail) {
        console.log('- projectDetail display:', projectDetail.style.display);
        console.log('- projectDetail visibility:', projectDetail.style.visibility);
        console.log('- projectDetail opacity:', projectDetail.style.opacity);
    }
    
    console.log('- body classes:', document.body.className);
};

console.log('🎯 فایل fix-navigation.js لود شد');
