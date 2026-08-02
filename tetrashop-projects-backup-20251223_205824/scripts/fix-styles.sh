#!/bin/bash

echo "🎨 اصلاح استایل‌های صفحه..."

# پشتیبان‌گیری
cp index.html index.html.backup

# اصلاح بخش head در index.html
sed -i '/<head>/a \
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\
    <style>\
        * { margin: 0; padding: 0; box-sizing: border-box; }\
        html, body { width: 100%; height: 100%; overflow-x: hidden; background: #f5f5f5; }\
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }\
    </style>' index.html

# اضافه کردن CSS برای رفع نوارهای سفید
cat > fix-white-bars.css << 'CSS'
/* رفع نوارهای سفید و زمینه سیاه */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

body {
    min-height: 100vh;
    width: 100%;
    background: inherit;
    color: #333;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    overflow-x: hidden;
}

/* حذف هر گونه پس‌زمینه سیاه */
.container, .app, .main-content, #app, #root {
    background: transparent !important;
}

/* رفع نوارهای سفید در اطراف */
.header, .footer, nav, .navbar {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(10px);
}

/* استایل‌های عمومی برای پروژه‌ها */
.project-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease;
}

.project-card:hover {
    transform: translateY(-5px);
}

/* رفع مشکلات رنگ */
a, button {
    color: #667eea;
}

/* رفع خطوط سفید */
hr {
    border-color: rgba(255, 255, 255, 0.2);
}

/* برای موبایل */
@media (max-width: 768px) {
    html, body {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
    }
}
CSS

# اضافه کردن لینک CSS به index.html
sed -i '/<\/head>/i <link rel="stylesheet" href="fix-white-bars.css">' index.html

# همچنین به index.js اضافه کنیم
if [ -f "index.js" ]; then
    echo "/* اضافه کردن استایل دینامیک برای رفع نوارهای سفید */" >> index.js
    echo "document.addEventListener('DOMContentLoaded', function() {" >> index.js
    echo "  const style = document.createElement('style');" >> index.js
    echo "  style.textContent = \`" >> index.js
    echo "    html, body { background: #f8f9fa !important; }" >> index.js
    echo "    *::-webkit-scrollbar { width: 8px; }" >> index.js
    echo "    *::-webkit-scrollbar-track { background: #f1f1f1; }" >> index.js
    echo "    *::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }" >> index.js
    echo "    *::-webkit-scrollbar-thumb:hover { background: #555; }" >> index.js
    echo "  \`;" >> index.js
    echo "  document.head.appendChild(style);" >> index.js
    echo "});" >> index.js
fi

echo "✅ استایل‌ها اصلاح شدند"
