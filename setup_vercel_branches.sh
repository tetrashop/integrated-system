#!/data/data/com.termux/files/usr/bin/bash

# ============================================================
#  ایجاد بسته‌ها و وابستگی‌های لازم برای استقرار در Vercel
# ============================================================

set -e

cd ~/integrated_system_final

# دریافت لیست شاخه‌های محلی (به جز main)
branches=$(git branch --format='%(refname:short)' | grep -v '^main$')

for branch in $branches; do
    echo "=========================================="
    echo "🔹 پردازش شاخه: $branch"
    git checkout "$branch"

    # ---------- تشخیص نوع پروژه ----------
    if [ -f "package.json" ]; then
        echo "✅ package.json وجود دارد."
    else
        echo "📦 ایجاد package.json ..."
        cat > package.json << 'EOF'
{
  "name": "integrated-project",
  "version": "1.0.0",
  "description": "پروژه یکپارچه برای استقرار در Vercel",
  "main": "index.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {},
  "keywords": [],
  "author": "",
  "license": "ISC"
}
EOF
    fi

    # ---------- نصب وابستگی‌ها ----------
    if [ -f "package.json" ]; then
        echo "📦 نصب وابستگی‌ها..."
        npm install --production --no-audit --no-fund || npm install
    fi

    # ---------- ایجاد vercel.json (در صورت نبود) ----------
    if [ ! -f "vercel.json" ]; then
        echo "📄 ایجاد vercel.json ..."
        cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    { "src": "*.html", "use": "@vercel/static" },
    { "src": "*.js", "use": "@vercel/node" },
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/", "dest": "server.js" },
    { "src": "/(.*)", "dest": "server.js" }
  ]
}
EOF
    fi

    # ---------- ایجاد فایل‌های مخصوص Vercel برای پروژه‌های خاص ----------
    case "$branch" in
        "ai-project-manager-light")
            echo "⚙️ تنظیمات ویژه برای ai-project-manager-light ..."
            # اطمینان از وجود backend/app.py و frontend
            if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
                echo "⚠️ ساختار پروژه کامل نیست. لطفاً بررسی کنید."
            fi
            # ایجاد vercel.json مناسب برای این پروژه
            cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    { "src": "frontend/*", "use": "@vercel/static" },
    { "src": "backend/app.py", "use": "@vercel/python" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "backend/app.py" },
    { "src": "/", "dest": "frontend/index.html" },
    { "src": "/(.*)", "dest": "frontend/$1" }
  ]
}
EOF
            ;;

        "integrated-platform")
            echo "⚙️ تنظیمات ویژه برای integrated-platform ..."
            # ایجاد vercel.json برای gateway
            cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    { "src": "gateway/server.js", "use": "@vercel/node" },
    { "src": "frontend/*", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/", "dest": "frontend/index.html" },
    { "src": "/api/(.*)", "dest": "gateway/server.js" },
    { "src": "/(.*)", "dest": "frontend/$1" }
  ]
}
EOF
            ;;
    esac

    # ---------- commit و push ----------
    git add package.json package-lock.json vercel.json 2>/dev/null || true
    git commit -m "🔧 افزودن تنظیمات Vercel و وابستگی‌ها برای شاخه‌ی $branch" || echo "⚠️ هیچ تغییری برای commit وجود ندارد."
    git push -u origin "$branch" --force

    echo "✅ شاخه‌ی $branch برای استقرار در Vercel آماده شد."
    echo ""
done

git checkout main
echo "=========================================="
echo "🎯 همه‌ی شاخه‌ها با موفقیت برای Vercel آماده شدند."
