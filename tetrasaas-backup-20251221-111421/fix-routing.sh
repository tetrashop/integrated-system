#!/bin/bash

echo "🔧 تعمیر مسیردهی پروژه‌ها..."

# 1. بررسی ساختار فایل‌ها
echo "📁 بررسی ساختار پروژه..."
if [ ! -d "chess" ] || [ ! -f "chess/index.html" ]; then
    echo "❌ پوشه chess وجود ندارد یا index.html ندارد"
    exit 1
fi

# 2. ایجاد فایل index.html در هر پروژه اگر وجود ندارد
for project in chess writer nlp quantum gardening voice-recognition 2d-to-3d; do
    if [ ! -f "$project/index.html" ]; then
        echo "⚠️  فایل $project/index.html وجود ندارد، در حال ایجاد..."
        echo "<html><body><h1>$project - به زودی</h1></body></html>" > "$project/index.html"
    fi
done

# 3. ایجاد فایل .htaccess برای Apache
cat > .htaccess << 'HTACCESS'
Options +Indexes
DirectoryIndex index.html

# جلوگیری از لیستینگ دایرکتوری
Options -Indexes

# ری‌رایت برای SPA
RewriteEngine On
RewriteBase /

# پروژه‌ها
RewriteRule ^chess/?$ chess/index.html [L]
RewriteRule ^writer/?$ writer/index.html [L]
RewriteRule ^nlp/?$ nlp/index.html [L]
RewriteRule ^quantum/?$ quantum/index.html [L]
RewriteRule ^gardening/?$ gardening/index.html [L]
RewriteRule ^voice-recognition/?$ voice-recognition/index.html [L]
RewriteRule ^2d-to-3d/?$ 2d-to-3d/index.html [L]

# اگر فایل یا دایرکتوری وجود ندارد، به index اصلی برو
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
HTACCESS

# 4. ایجاد فایل 404.html
cat > 404.html << '404HTML'
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <title>صفحه یافت نشد - تتراشاپ</title>
    <style>
        body { 
            font-family: 'Vazirmatn', sans-serif;
            text-align: center;
            padding: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        h1 { font-size: 5rem; margin: 0; }
        p { font-size: 1.5rem; margin: 20px 0; }
        .projects {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin: 30px 0;
            justify-content: center;
        }
        .project-link {
            background: rgba(255,255,255,0.1);
            padding: 15px 25px;
            border-radius: 10px;
            text-decoration: none;
            color: white;
            transition: all 0.3s;
        }
        .project-link:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-5px);
        }
    </style>
</head>
<body>
    <h1>۴۰۴</h1>
    <p>صفحه مورد نظر یافت نشد</p>
    
    <div class="projects">
        <a href="/chess" class="project-link">♟️ شطرنج</a>
        <a href="/writer" class="project-link">✍️ نویسنده</a>
        <a href="/nlp" class="project-link">🧠 تحلیلگر متن</a>
        <a href="/quantum" class="project-link">⚛️ کوانتومی</a>
        <a href="/gardening" class="project-link">🌿 باغبانی</a>
        <a href="/voice-recognition" class="project-link">🎤 تشخیص صوت</a>
        <a href="/2d-to-3d" class="project-link">🎨 تبدیل ۳D</a>
        <a href="/" class="project-link">🏠 صفحه اصلی</a>
    </div>
</body>
</html>
404HTML

echo "✅ تعمیرات انجام شد!"
echo "📋 اقدامات بعدی:"
echo "1. git add ."
echo "2. git commit -m 'fix: routing configuration'"
echo "3. git push origin main"
echo "4. منتظر دپلوی Vercel بمانید"
