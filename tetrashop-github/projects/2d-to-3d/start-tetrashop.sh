#!/bin/bash
echo "🔍 راه‌اندازی خودکار تتراشاپ"
echo "============================"

# پورت‌های مجاز را امتحان می‌کنیم
PORTS=(3000 3001 3002 8080 8081 8000 5000)

for PORT in "${PORTS[@]}"; do
    echo "🔍 بررسی پورت $PORT..."
    
    # بررسی اینکه پورت آزاد است
    if ! lsof -i :$PORT > /dev/null 2>&1; then
        echo "✅ پورت $PORT آزاد است"
        
        # ایجاد فایل با پورت مناسب
        cat > tetrashop-$PORT.js << APP_EOF
const express = require('express');
const app = express();
const PORT = $PORT;

app.get('/', (req, res) => {
    res.send(\`
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>تتراشاپ - پورت \${PORT}</title>
            <style>
                body {
                    font-family: 'Vazirmatn', sans-serif;
                    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                    color: white;
                    margin: 0;
                    padding: 40px;
                    direction: rtl;
                    text-align: center;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .projects {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin: 30px 0;
                }
                .project {
                    background: rgba(255,255,255,0.1);
                    padding: 20px;
                    border-radius: 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎯 تتراشاپ - راه‌اندازی موفق</h1>
                <p>سیستم روی پورت \${PORT} فعال شد</p>
                
                <div class="projects">
                    <div class="project">
                        <h3>♔ شطرنج</h3>
                        <p>هوش مصنوعی سطح GM</p>
                    </div>
                    <div class="project">
                        <h3>✍️ نویسنده</h3>
                        <p>تولید محتوای هوشمند</p>
                    </div>
                    <div class="project">
                        <h3>⚛️ کوانتومی</h3>
                        <p>الگوریتم‌های کوانتومی</p>
                    </div>
                    <div class="project">
                        <h3>🔐 امنیت</h3>
                        <p>سیستم امنیتی پیشرفته</p>
                    </div>
                    <div class="project">
                        <h3>🎤 گفتار</h3>
                        <p>تشخیص گفتار فارسی</p>
                    </div>
                </div>
                
                <div style="margin-top: 30px;">
                    <h3>🔧 تست API</h3>
                    <a href="/api/status" style="color: #4cc9f0; margin: 0 10px;">آمار</a>
                    <a href="/api/projects" style="color: #4cc9f0; margin: 0 10px;">پروژه‌ها</a>
                    <a href="/api/test" style="color: #4cc9f0; margin: 0 10px;">تست</a>
                </div>
            </div>
        </body>
        </html>
    \`);
});

// APIها
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        message: 'سیستم تتراشاپ فعال است',
        port: PORT,
        projects: [
            'شطرنج پیشرفته',
            'نویسنده هوشمند', 
            'نویسنده کوانتومی',
            'باغ امن',
            'تشخیص گفتار'
        ],
        revenue_models: [
            'فروش اشتراک ماهانه',
            'فروش پکیج محدود',
            'API سازمانی',
            'خدمات سفارشی'
        ]
    });
});

app.get('/api/projects', (req, res) => {
    res.json({
        chess: { name: 'شطرنج پیشرفته', price: 99000 },
        writer: { name: 'نویسنده هوشمند', price: 149000 },
        quantum: { name: 'نویسنده کوانتومی', price: 199000 },
        security: { name: 'باغ امن', price: 299000 },
        speech: { name: 'تشخیص گفتار', price: 99000 }
    });
});

app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        timestamp: new Date().toISOString(),
        system: 'Tetrashop Platform',
        version: '3.0.0'
    });
});

app.listen(PORT, () => {
    console.log(\`
    🎉 تتراشاپ روی پورت \${PORT} راه‌اندازی شد!
    
    🌐 آدرس: http://localhost:\${PORT}
    
    📊 پروژه‌ها:
       1. ♔ شطرنج پیشرفته
       2. ✍️ نویسنده هوشمند  
       3. ⚛️ نویسنده کوانتومی
       4. 🔐 باغ امن
       5. 🎤 تشخیص گفتار
    
    💰 مدل درآمدزایی:
       • اشتراک ماهانه: از ۹۹,۰۰۰ ریال
       • پکیج محدود: از ۱۹۹,۰۰۰ ریال
       • API سازمانی: از ۴۹۹,۰۰۰ ریال
    
    ⚡ برای توقف: Ctrl+C
    \`);
});
APP_EOF
        
        # اجرای سرور
        echo "🚀 راه‌اندازی سرور روی پورت $PORT..."
        node tetrashop-$PORT.js &
        SERVER_PID=$!
        
        # کمی صبر کن
        sleep 3
        
        # بررسی اینکه سرور کار می‌کند
        if curl -s http://localhost:$PORT > /dev/null 2>&1; then
            echo ""
            echo "✅ موفقیت! سرور فعال شد"
            echo "🌐 آدرس: http://localhost:$PORT"
            echo "🆔 PID: $SERVER_PID"
            echo ""
            echo "📋 برای تست:"
            echo "   curl http://localhost:$PORT/api/status"
            echo ""
            echo "💰 برای شروع درآمدزایی، محصولات خود را تعریف کنید"
            exit 0
        else
            echo "⚠️  سرور روی پورت $PORT شروع نشد"
            kill $SERVER_PID 2>/dev/null || true
        fi
    else
        echo "⛔ پورت $PORT در حال استفاده"
    fi
done

echo "❌ هیچ پورت آزادی پیدا نشد!"
echo "لطفاً یکی از فرآیندهای زیر را متوقف کنید:"
lsof -i :3000,3001,3002,8080,8081,8000,5000 2>/dev/null || echo "هیچ فرآیندی پیدا نشد"
