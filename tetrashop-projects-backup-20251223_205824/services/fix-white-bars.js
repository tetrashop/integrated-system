// فایل JavaScript برای رفع نوارهای سفید و زمینه سیاه
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 در حال رفع نوارهای سفید...');
    
    // 1. رفع پس‌زمینه‌های سیاه
    document.documentElement.style.backgroundColor = '#f8f9fa';
    document.body.style.backgroundColor = '#f8f9fa';
    
    // 2. حذف margin و padding اضافی
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    // 3. تنظیم width و height به 100%
    document.documentElement.style.width = '100%';
    document.documentElement.style.height = '100%';
    document.body.style.width = '100%';
    document.body.style.minHeight = '100vh';
    
    // 4. پیدا و رفع تمام المنت‌هایی که ممکن است باعث مشکل شوند
    const problematicElements = document.querySelectorAll('div, section, article, main');
    problematicElements.forEach(el => {
        const bgColor = window.getComputedStyle(el).backgroundColor;
        const color = window.getComputedStyle(el).color;
        
        // اگر پس‌زمینه سیاه است، تغییر بده
        if (bgColor === 'rgb(0, 0, 0)' || bgColor === 'black') {
            el.style.backgroundColor = '#f8f9fa';
        }
        
        // اگر متن سفید روی زمینه سیاه است، رنگ‌ها را معکوس کن
        if (color === 'rgb(255, 255, 255)' || color === 'white') {
            if (bgColor === 'rgb(0, 0, 0)' || bgColor === 'black') {
                el.style.color = '#333333';
                el.style.backgroundColor = '#ffffff';
            }
        }
    });
    
    // 5. اضافه کردن استایل دینامیک
    const dynamicStyle = document.createElement('style');
    dynamicStyle.textContent = `
        /* رفع نوارهای سفید دینامیک */
        * {
            max-width: 100vw !important;
        }
        
        html {
            overflow-x: hidden !important;
        }
        
        body {
            position: relative !important;
        }
        
        /* رفع نوارهای سفید در اطراف تصاویر */
        img {
            max-width: 100% !important;
            height: auto !important;
        }
        
        /* رفع اسکرول افقی */
        .container, .row, .col {
            overflow-x: hidden !important;
        }
    `;
    document.head.appendChild(dynamicStyle);
    
    console.log('✅ نوارهای سفید رفع شدند');
});

// همچنین هنگام تغییر سایز پنجره
window.addEventListener('resize', function() {
    document.documentElement.style.width = '100%';
    document.body.style.width = '100%';
});
