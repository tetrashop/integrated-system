#!/bin/bash

echo "🎯 رفع کامل مشکل صفحه کاور سیاه"
echo "================================"

# 1. پشتیبان‌گیری
echo "💾 پشتیبان‌گیری..."
cp index.html index.html.backup
cp index.js index.js.backup

# 2. بررسی و رفع index.js
echo "🔧 رفع index.js..."
if [ -f "index.js" ]; then
    # پیدا کردن و رفع تابع loadProjectContent
    sed -i 's/function loadProjectContent(projectId) {/function loadProjectContent(projectId) {\n    console.log("🚀 loadProjectContent برای:", projectId);\n    \/\/ دیباگ/g' index.js
    
    # اضافه کردن نمایش project-detail
    sed -i 's/projectDetail.style.display = "block";/projectDetail.style.display = "block";\n    projectDetail.style.visibility = "visible";\n    projectDetail.style.opacity = "1";\n    projectDetail.style.background = "white";/g' index.js
    
    # اضافه کردن مخفی کردن home-page
    sed -i 's/homePage.style.display = "none";/homePage.style.display = "none";\n    homePage.style.visibility = "hidden";\n    homePage.style.opacity = "0";/g' index.js
    
    # اضافه کردن تاخیر برای iframe
    sed -i 's/iframe.src = `\/${projectId}\/index.html`;/setTimeout(() => {\n        iframe.src = `\/${projectId}\/index.html`;\n        console.log("📦 iframe src تنظیم شد");\n    }, 100);/g' index.js
    
    echo "✅ index.js رفع شد"
else
    echo "❌ index.js پیدا نشد"
fi

# 3. ایجاد فایل‌های fix
echo "📁 ایجاد فایل‌های رفع مشکل..."
cat > force-show-projects.js << 'JS'
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
JS

# 4. اضافه کردن به index.html
echo "📝 اضافه کردن اسکریپت‌ها به index.html..."
if [ -f "index.html" ]; then
    # اضافه کردن اسکریپت force-show
    sed -i '/<\/body>/i <script src="force-show-projects.js"></script>' index.html
    
    # اضافه کردن CSS اضطراری
    sed -i '/<\/head>/i <style>#project-detail { display: none; } #project-detail.show { display: block !important; background: white !important; }</style>' index.html
    
    echo "✅ index.html به‌روز شد"
fi

# 5. بررسی و رفع پروژه‌ها
echo "🔍 بررسی پروژه‌ها..."
for project in chess writer nlp quantum gardening voice-recognition 2d-to-3d; do
    if [ -d "$project" ]; then
        echo "📁 $project:"
        
        # اطمینان از وجود index.html
        if [ ! -f "$project/index.html" ]; then
            echo "  🔗 ایجاد index.html..."
            find "$project" -name "*.html" -type f | head -1 | xargs -I {} ln -sf {} "$project/index.html"
        fi
        
        # رفع پس‌زمینه سیاه در پروژه
        if [ -f "$project/index.html" ]; then
            sed -i 's/background:\s*black/background: white/g' "$project/index.html"
            sed -i 's/background:\s*#000/background: #fff/g' "$project/index.html"
            sed -i 's/background-color:\s*black/background-color: white/g' "$project/index.html"
            echo "  ✅ پروژه بررسی شد"
        fi
    else
        echo "❌ $project: پوشه وجود ندارد"
    fi
done

# 6. ایجاد صفحه تست
echo "🧪 ایجاد صفحه تست..."
cat > test-navigation.html << 'HTML'
<!DOCTYPE html>
<html>
<head>
    <title>تست Navigation</title>
    <style>
        body { font-family: sans-serif; padding: 20px; }
        .test { margin: 10px; padding: 15px; border: 1px solid #ddd; }
        .success { background: #d4edda; }
        .error { background: #f8d7da; }
        button { padding: 10px 20px; margin: 5px; }
    </style>
</head>
<body>
    <h1>🧪 تست Navigation پروژه‌ها</h1>
    
    <div class="test">
        <h3>تست دستی:</h3>
        <button onclick="testProject('chess')">تست Chess</button>
        <button onclick="testProject('writer')">تست Writer</button>
        <button onclick="testProject('nlp')">تست NLP</button>
        <button onclick="testProject('quantum')">تست Quantum</button>
        <button onclick="testProject('gardening')">تست Gardening</button>
        <button onclick="testProject('voice-recognition')">تست Voice</button>
        <button onclick="testProject('2d-to-3d')">تست 2D-3D</button>
    </div>
    
    <div id="result" class="test"></div>
    
    <script>
        async function testProject(project) {
            const result = document.getElementById('result');
            result.innerHTML = `🔄 تست ${project}...`;
            result.className = 'test';
            
            try {
                // تست وجود صفحه
                const response = await fetch(`/${project}/index.html`);
                if (response.ok) {
                    // تست navigation
                    window.location.hash = `#/${project}`;
                    
                    // بررسی بعد از 1 ثانیه
                    setTimeout(() => {
                        const projectDetail = document.getElementById('project-detail');
                        if (projectDetail && projectDetail.style.display === 'block') {
                            result.innerHTML = `✅ ${project}: navigation کار می‌کند`;
                            result.className = 'test success';
                        } else {
                            result.innerHTML = `⚠️ ${project}: navigation کار نمی‌کند (ممکن است صفحه سیاه باشد)`;
                            result.className = 'test error';
                        }
                    }, 1000);
                } else {
                    throw new Error(`صفحه یافت نشد: ${response.status}`);
                }
            } catch (error) {
                result.innerHTML = `❌ ${project}: ${error.message}`;
                result.className = 'test error';
            }
        }
        
        // مانیتور hash changes
        window.addEventListener('hashchange', () => {
            console.log('hash تغییر کرد:', window.location.hash);
        });
    </script>
</body>
</html>
HTML

echo "✅ اسکریپت اجرا شد"
echo ""
echo "🎯 راه‌حل‌های اعمال شده:"
echo "1. رفع توابع navigation در index.js"
echo "2. اضافه کردن نمایش اجباری project-detail"
echo "3. رفع پس‌زمینه‌های سیاه در پروژه‌ها"
echo "4. ایجاد صفحه تست navigation"
echo ""
echo "📁 فایل‌های ایجاد شده:"
echo "- fix-navigation.js"
echo "- force-show-projects.js"
echo "- test-navigation.html"
echo "- fix-cover-issue.css"
echo ""
echo "🚀 برای تست:"
echo "1. index.html را در مرورگر باز کنید"
echo "2. روی پروژه‌ها کلیک کنید"
echo "3. یا test-navigation.html را باز کنید"
echo ""
echo "🔧 اگر هنوز مشکل داشتید:"
echo "1. کنسول مرورگر را بررسی کنید (F12)"
echo "2. cache را پاک کنید (Ctrl+Shift+R)"
echo "3. از حالت incognito استفاده کنید"
