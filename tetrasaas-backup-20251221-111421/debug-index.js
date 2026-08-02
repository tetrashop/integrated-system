// دیباگ navigation
console.log('🔧 دیباگ navigation فعال شد');

// ذخیره نسخه اصلی توابع
const originalNavigateTo = window.navigateTo;
const originalLoadProjectContent = window.loadProjectContent;

// مانیتور کلیک‌ها
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && link.href.includes('#')) {
        console.log('🖱️ کلیک روی لینک:', link.href);
        console.log('📍 hash target:', link.hash);
        
        // بررسی اینکه آیا navigation اتفاق می‌افتد
        setTimeout(() => {
            console.log('📌 hash فعلی پس از کلیک:', window.location.hash);
            console.log('📌 آیا صفحه تغییر کرد؟', document.visibilityState);
        }, 100);
    }
});

// مانیتور hash changes
window.addEventListener('hashchange', function() {
    console.log('🔄 hashchange event triggered');
    console.log('🔗 hash جدید:', window.location.hash);
    console.log('📄 URL کامل:', window.location.href);
    
    // بررسی عناصر صفحه
    const homePage = document.getElementById('home-page');
    const projectDetail = document.getElementById('project-detail');
    
    console.log('🏠 home-page display:', homePage ? homePage.style.display : 'not found');
    console.log('🎯 project-detail display:', projectDetail ? projectDetail.style.display : 'not found');
});

// مانیتور load events
window.addEventListener('load', function() {
    console.log('📦 صفحه کامل لود شد');
    console.log('🔗 hash اولیه:', window.location.hash);
    
    // تست navigation خودکار اگر hash وجود دارد
    if (window.location.hash) {
        console.log('⚡ hash اولیه موجود، اجرای navigation...');
        setTimeout(() => {
            if (typeof handleRoute === 'function') {
                handleRoute();
            }
        }, 500);
    }
});

// اضافه کردن info panel برای دیباگ
const debugPanel = document.createElement('div');
debugPanel.id = 'debug-panel';
debugPanel.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    z-index: 9999;
    font-family: monospace;
    font-size: 12px;
    max-width: 300px;
    max-height: 200px;
    overflow: auto;
`;
document.body.appendChild(debugPanel);

function updateDebugPanel(info) {
    debugPanel.innerHTML = `<div>${info}</div>`;
}

// مانیتور تغییرات DOM
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const target = mutation.target;
            if (target.id === 'home-page' || target.id === 'project-detail') {
                updateDebugPanel(`${target.id}: ${target.style.display}`);
            }
        }
    });
});

// شروع مشاهده
observer.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ['style']
});

console.log('✅ دیباگ navigation نصب شد');
