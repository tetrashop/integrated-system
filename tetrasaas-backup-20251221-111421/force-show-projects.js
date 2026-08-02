// اسکریپت اجباری برای نمایش پروژه‌ها
(function() {
    console.log('🎯 فعال کردن نمایش اجباری پروژه‌ها');
    
    // مانیتور hash changes
    window.addEventListener('hashchange', function() {
        console.log('🔄 hash تغییر کرد:', window.location.hash);
        forceShowProjectDetail();
    });
    
    // مانیتور load
    window.addEventListener('load', function() {
        console.log('📦 صفحه لود شد');
        if (window.location.hash.includes('/')) {
            setTimeout(forceShowProjectDetail, 500);
        }
    });
    
    function forceShowProjectDetail() {
        const projectDetail = document.getElementById('project-detail');
        const homePage = document.getElementById('home-page');
        
        if (projectDetail && homePage) {
            console.log('🔧 اعمال نمایش اجباری...');
            
            // قطعاً project-detail را نمایش بده
            projectDetail.style.cssText = `
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: relative !important;
                z-index: 100 !important;
                background: white !important;
                width: 100% !important;
                height: auto !important;
                min-height: 100vh !important;
            `;
            
            // قطعاً home-page را مخفی کن
            homePage.style.cssText = `
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                position: absolute !important;
                z-index: -1 !important;
            `;
            
            // اضافه کردن کلاس به body
            document.body.classList.add('project-view-active');
            document.body.style.background = 'white';
            
            console.log('✅ نمایش اجباری اعمال شد');
        }
    }
    
    // همچنین با کلیک روی لینک‌ها
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href*="#/"]');
        if (link) {
            e.preventDefault();
            const hash = link.getAttribute('href');
            window.location.hash = hash;
            setTimeout(forceShowProjectDetail, 100);
        }
    });
    
    console.log('✅ اسکریپت نمایش اجباری فعال شد');
})();
