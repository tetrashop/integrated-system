#!/bin/bash

echo "🚀 راه‌اندازی کامل پروژه Vite + React"

cd /data/data/com.termux/files/home/tetrashop-projects

# 1. بررسی و ایجاد فایل‌های ضروری
echo "📝 ایجاد فایل‌های ضروری..."

# ایجاد index.html اگر وجود ندارد
if [ ! -f "index.html" ]; then
    echo "📄 ایجاد index.html..."
    cat > index.html << 'HTML'
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TetraSaaS Dashboard</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>
HTML
fi

# ایجاد پوشه public
mkdir -p public

# 2. نصب وابستگی‌های ضروری
echo "📦 نصب وابستگی‌ها..."
npm install

# 3. بررسی وجود فایل‌های React
if [ ! -f "src/App.tsx" ]; then
    echo "⚠️ فایل App.tsx وجود ندارد. ایجاد نسخه پایه..."
    cat > src/App.tsx << 'REACT'
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🚀 TetraSaaS Dashboard</h1>
      <p>داشبورد مدیریت سرویس‌های ابری TetraSaaS</p>
      <div style={{ marginTop: '2rem' }}>
        <button 
          onClick={() => setCount((count) => count + 1)}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: '#646cff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          تعداد کلیک‌ها: {count}
        </button>
      </div>
      <p style={{ marginTop: '2rem', color: '#666' }}>
        ✅ پروژه با موفقیت راه‌اندازی شد
      </p>
    </div>
  )
}

export default App
REACT
fi

if [ ! -f "src/main.tsx" ]; then
    echo "⚠️ فایل main.tsx وجود ندارد. ایجاد..."
    cat > src/main.tsx << 'MAIN'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
MAIN
fi

if [ ! -f "src/index.css" ]; then
    echo "⚠️ فایل index.css وجود ندارد. ایجاد..."
    cat > src/index.css << 'CSS'
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: border-color 0.25s;
}
CSS
fi

# 4. ساخت پروژه
echo "🔨 ساخت پروژه..."
npm run build

# 5. بررسی نتیجه
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo ""
    echo "🎉 پروژه با موفقیت ساخته شد!"
    echo "📁 پوشه dist ایجاد شده است."
    echo ""
    echo "📊 خلاصه ساخت:"
    echo "  • فایل‌های اصلی: ✅"
    echo "  • وابستگی‌ها: ✅"
    echo "  • ساخت پروژه: ✅"
    echo "  • فایل index.html: ✅"
    echo ""
    echo "🚀 برای اجرای توسعه:"
    echo "  npm run dev"
    echo ""
    echo "🌐 برای استقرار روی Vercel:"
    echo "  vercel --prod"
else
    echo "❌ خطا در ساخت پروژه"
    echo "لطفاً پیام خطا را بررسی کنید:"
    npm run build 2>&1
fi
