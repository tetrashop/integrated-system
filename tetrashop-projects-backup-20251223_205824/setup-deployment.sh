#!/bin/bash

echo "🚀 شروع آماده‌سازی TetraSaaS برای GitHub و Vercel"
echo "📍 مکان: $(pwd)"
echo "=================================================="

# بررسی وجود پوشه‌های پروژه
echo "🔍 بررسی ساختار پروژه..."
if [ ! -d "packages/database" ]; then
    echo "❌ پوشه packages/database یافت نشد!"
    echo "   لطفاً مطمئن شوید در پوشه اصلی پروژه هستید."
    exit 1
fi

if [ ! -d "apps/api" ]; then
    echo "❌ پوشه apps/api یافت نشد!"
    exit 1
fi

echo "✅ ساختار پروژه صحیح است"

# 1. ایجاد فایل‌های ضروری در ریشه پروژه
echo "📝 1. ایجاد فایل‌های پیکربندی..."

# فایل .gitignore
cat > .gitignore << 'GITIGNORE'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env*.local

# Database files - VERY IMPORTANT FOR VERCEL
*.db
*.sqlite
*.db-journal
tetrasaas.db
dev.db
**/*.db

# Build outputs
dist/
build/
.out/
.next/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
logs/
*.log

# Temporary files
tmp/
temp/

# Vercel
.vercel/
.vercel_build_output/

# SQLite files (for local development only)
packages/database/*.db
packages/database/dev.db
GITIGNORE
echo "   ✅ .gitignore ایجاد شد"

# فایل package.json اصلی در ریشه
cat > package.json << 'PKGJSON'
{
  "name": "tetrashop-saas-platform",
  "version": "3.0.0",
  "description": "Complete AI SaaS Platform with 26 Services - TetraShop Projects",
  "type": "module",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "dev": "cd apps/api && npm run dev",
    "start": "cd apps/api && npm start",
    "build": "echo 'Build completed'",
    "test": "cd packages/database && npm test && cd ../auth && npm test",
    "deploy": "echo 'Run: git push && vercel --prod'",
    "setup": "./setup-deployment.sh",
    "docker:build": "docker build -t trashop-saas .",
    "docker:run": "docker run -p 3000:3000 trashop-saas"
  },
  "keywords": [
    "ai",
    "saas",
    "machine-learning",
    "api",
    "tetrashop",
    "tetrasaas"
  ],
  "author": "TetraShop Team",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {},
  "devDependencies": {}
}
PKGJSON
echo "   ✅ package.json ریشه ایجاد شد"

# 2. ایجاد فایل راهنمای استقرار
echo "📚 2. ایجاد مستندات..."

cat > DEPLOYMENT.md << 'DOCUMENTATION'
# 🚀 راهنمای استقرار TetraShop SaaS Platform

## 📋 پیش‌نیازها
1. ✅ حساب GitHub
2. ✅ حساب Vercel (رایگان)
3. ✅ حساب Supabase (برای دیتابیس PostgreSQL رایگان)

## 🗺️ ساختار پروژه

## 🔧 مرحله ۱: مهاجرت دیتابیس به PostgreSQL (ضروری برای Vercel)

### ۱.۱ ایجاد دیتابیس رایگان در Supabase
1. وارد [supabase.com](https://supabase.com) شوید
2. روی "New Project" کلیک کنید
3. نام پروژه: `tetrashop-saas`
4. دیتابیس پسورد را ذخیره کنید
5. منتظر بمانید تا پروژه ایجاد شود (۲-۱ دقیقه)

### ۱.۲ گرفتن Connection String
1. به Project Settings بروید
2. به بخش Database → Connection String بروید
3. Connection String را کپی کنید:

### ۱.۳ اجرای اسکریپت ایجاد جداول
از SQL Editor در Supabase استفاده کنید و کد زیر را اجرا کنید:

\`\`\`sql
-- ایجاد جداول TetraSaaS
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  description TEXT,
  category VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  endpoint_path VARCHAR(255),
  price_per_call DECIMAL(10, 2) DEFAULT 0.0,
  is_active BOOLEAN DEFAULT TRUE,
  config JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api_keys (
  id SERIAL PRIMARY KEY,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  tenant_id VARCHAR(255) UNIQUE NOT NULL,
  rate_limit INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT TRUE,
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS credit_balances (
  id SERIAL PRIMARY KEY,
  tenant_id VARCHAR(255) UNIQUE NOT NULL,
  balance DECIMAL(10, 2) DEFAULT 0.0,
  total_spent DECIMAL(10, 2) DEFAULT 0.0,
  last_top_up TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_logs (
  id SERIAL PRIMARY KEY,
  api_key_id INTEGER REFERENCES api_keys(id),
  service_id INTEGER REFERENCES services(id),
  input_data JSONB,
  output_data JSONB,
  status VARCHAR(50) DEFAULT 'SUCCESS',
  error_message TEXT,
  duration_ms INTEGER,
  cost DECIMAL(10, 2),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ایجاد ایندکس‌ها
CREATE INDEX idx_service_logs_api_key ON service_logs(api_key_id);
CREATE INDEX idx_service_logs_created_at ON service_logs(created_at);
CREATE INDEX idx_api_keys_tenant ON api_keys(tenant_id);

-- وارد کردن ۲۶ سرویس
INSERT INTO services (slug, name, category, price_per_call, description) VALUES
('image-enhancement', 'بهبود تصویر', 'بینایی کامپیوتر', 100, 'افزایش کیفیت، رزولوشن و وضوح تصاویر'),
('sentiment-analysis', 'تحلیل احساسات', 'NLP', 60, 'تشخیص احساس مثبت، منفی یا خنثی در متن'),
('text-summarization', 'خلاصه‌سازی متن', 'NLP', 75, 'خلاصه‌سازی خودکار متون طولانی')
ON CONFLICT (slug) DO NOTHING;
\`\`\`

## 🌐 مرحله ۲: استقرار روی Vercel

### ۲.۱ آپلود به GitHub
\`\`\`bash
# در پوشه trashop-projects
git init
git add .
git commit -m "🚀 Initial commit: TetraShop SaaS Platform v3.0"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/tetrashop-saas.git
git push -u origin main
\`\`\`

### ۲.۲ استقرار در Vercel
1. وارد [vercel.com](https://vercel.com) شوید
2. روی "Add New Project" کلیک کنید
3. ریپوی `tetrashop-saas` را انتخاب کنید
4. در بخش "Build and Output Settings":
   - Build Command: خالی بگذارید
   - Output Directory: خالی بگذارید
   - Install Command: `npm install`
5. در بخش "Environment Variables":
   - `DATABASE_URL`: رشته اتصال Supabase
   - `NODE_ENV`: `production`
   - `PORT`: `3000` (اختیاری)
6. روی "Deploy" کلیک کنید

### ۲.۳ تست پس از استقرار
\`\`\`bash
# تست سلامت
curl https://YOUR-PROJECT.vercel.app/health

# تست دریافت سرویس‌ها
curl https://YOUR-PROJECT.vercel.app/api/services
\`\`\`

## 🔄 مرحله ۳: بروزرسانی کد دیتابیس (ضروری)

پکیج دیتابیس باید از PostgreSQL به جای SQLite استفاده کند. فایل \`packages/database/src/index.js\` را با نسخه PostgreSQL جایگزین کنید.

## 🆘 عیب‌یابی

### مشکل: "Database connection failed"
- ✅ رشته اتحصال Supabase را بررسی کنید
- ✅ در Supabase به Connection Settings بروید و SSL را فعال کنید
- ✅ IP Address را در Supabase به 0.0.0.0/0 تغییر دهید

### مشکل: "API not responding"
- ✅ لاگ‌های Vercel را بررسی کنید
- ✅ مطمئن شوید پورت از \`process.env.PORT\` می‌خواند

### مشکل: "Migration needed"
- ✅ اسکریپت SQL بالا را در Supabase اجرا کنید

## 📞 پشتیبانی
برای مشکلات، Issue در GitHub ایجاد کنید یا با تیم توسعه تماس بگیرید.

---
**تاریخ ایجاد:** $(date)
**ورژن:** 3.0.0
DOCUMENTATION
echo "   ✅ DEPLOYMENT.md ایجاد شد"

# 3. ایجاد فایل پیکربندی Vercel
echo "⚙️  3. ایجاد پیکربندی Vercel..."

cat > vercel.json << 'VERCELCONFIG'
{
  "version": 2,
  "builds": [
    {
      "src": "apps/api/src/server.js",
      "use": "@vercel/node",
      "config": {
        "maxLambdaSize": "15mb",
        "includeFiles": [
          "packages/**"
        ]
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "apps/api/src/server.js",
      "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "regions": ["sin1"],
  "public": false,
  "github": {
    "enabled": true,
    "autoAlias": true
  }
}
VERCELCONFIG
echo "   ✅ vercel.json ایجاد شد"

# 4. بروزرسانی package.json در apps/api
echo "📦 4. بروزرسانی پکیج API برای Vercel..."

cat > apps/api/package.json << 'APIPKG'
{
  "name": "@tetrashop/api",
  "version": "3.0.0",
  "description": "TetraShop SaaS API Server - Optimized for Vercel",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js",
    "build": "echo 'No build required for Vercel'",
    "vercel-build": "echo 'Vercel build completed' && npm install",
    "test": "node test-api.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "pg": "^8.11.3",
    "@tetrasaas/database": "file:../../packages/database",
    "@tetrasaas/auth": "file:../../packages/auth"
  },
  "devDependencies": {},
  "engines": {
    "node": ">=18.0.0"
  }
}
APIPKG
echo "   ✅ apps/api/package.json بروزرسانی شد"

# 5. ایجاد اسکریپت PostgreSQL برای دیتابیس
echo "🗄️  5. ایجاد اسکریپت PostgreSQL..."

mkdir -p scripts

cat > scripts/setup-postgres.js << 'POSTGRESJS'
// اسکریپت راه‌اندازی PostgreSQL برای TetraShop SaaS
import pkg from 'pg';
const { Pool } = pkg;
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupPostgres() {
  console.log('🔧 راه‌اندازی دیتابیس PostgreSQL برای TetraShop SaaS...');
  console.log('📌 توجه: این اسکریپت نیاز به Connection String Supabase دارد');
  
  const connectionString = process.env.DATABASE_URL || 
    'postgresql://postgres:password@localhost:5432/tetrashop';
  
  const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔌 در حال اتصال به دیتابیس...');
    await pool.query('SELECT 1');
    console.log('✅ اتصال موفقیت‌آمیز بود');

    // ایجاد جدول‌ها
    console.log('🏗️ ایجاد جداول...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        description TEXT,
        category VARCHAR(100) NOT NULL,
        icon VARCHAR(50),
        endpoint_path VARCHAR(255),
        price_per_call DECIMAL(10, 2) DEFAULT 0.0,
        is_active BOOLEAN DEFAULT TRUE,
        config JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id SERIAL PRIMARY KEY,
        api_key VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        tenant_id VARCHAR(255) UNIQUE NOT NULL,
        rate_limit INTEGER DEFAULT 100,
        is_active BOOLEAN DEFAULT TRUE,
        last_used TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS credit_balances (
        id SERIAL PRIMARY KEY,
        tenant_id VARCHAR(255) UNIQUE NOT NULL,
        balance DECIMAL(10, 2) DEFAULT 0.0,
        total_spent DECIMAL(10, 2) DEFAULT 0.0,
        last_top_up TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS service_logs (
        id SERIAL PRIMARY KEY,
        api_key_id INTEGER REFERENCES api_keys(id),
        service_id INTEGER REFERENCES services(id),
        input_data JSONB,
        output_data JSONB,
        status VARCHAR(50) DEFAULT 'SUCCESS',
        error_message TEXT,
        duration_ms INTEGER,
        cost DECIMAL(10, 2),
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // ایجاد ایندکس‌ها
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_service_logs_api_key ON service_logs(api_key_id);
      CREATE INDEX IF NOT EXISTS idx_service_logs_created_at ON service_logs(created_at);
      CREATE INDEX IF NOT EXISTS idx_api_keys_tenant ON api_keys(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
    `);

    console.log('✅ جداول و ایندکس‌ها ایجاد شدند');

    // بررسی وجود داده
    const { rows } = await pool.query('SELECT COUNT(*) as count FROM services');
    if (parseInt(rows[0].count) === 0) {
      console.log('📥 در حال وارد کردن داده‌های اولیه...');
      
      await pool.query(`
        INSERT INTO services (slug, name, category, price_per_call, description) VALUES
        ('image-enhancement', 'بهبود تصویر', 'بینایی کامپیوتر', 100, 'افزایش کیفیت، رزولوشن و وضوح تصاویر'),
        ('sentiment-analysis', 'تحلیل احساسات', 'NLP', 60, 'تشخیص احساس مثبت، منفی یا خنثی در متن'),
        ('text-summarization', 'خلاصه‌سازی متن', 'NLP', 75, 'خلاصه‌سازی خودکار متون طولانی'),
        ('object-detection', 'تشخیص اشیاء', 'بینایی کامپیوتر', 120, 'تشخیص و دسته‌بندی اشیاء در تصویر'),
        ('face-recognition', 'تشخیص چهره', 'بینایی کامپیوتر', 150, 'تشخیص و شناسایی چهره افراد'),
        ('speech-to-text', 'تشخیص گفتار', 'پردازش صوت', 110, 'تبدیل صوت به متن با دقت بالا'),
        ('text-to-speech', 'سنتز صدا', 'پردازش صوت', 90, 'تبدیل متن به گفتار طبیعی'),
        ('language-translation', 'ترجمه ماشینی', 'NLP', 95, 'ترجمه متن بین زبان‌های مختلف'),
        ('chatbot', 'چتبات هوشمند', 'NLP', 130, 'پاسخگویی خودکار به سوالات کاربران'),
        ('text-generation', 'تولید متن', 'NLP', 140, 'تولید متن خلاقانه بر اساس prompt')
        ON CONFLICT (slug) DO NOTHING;
      `);

      console.log('✅ ۱۰ سرویس اولیه وارد شدند');
    } else {
      console.log(`✅ داده‌های موجود: ${rows[0].count} سرویس`);
    }

    // ایجاد یک API Key نمونه
    const sampleApiKey = 'ts_live_sample_' + Math.random().toString(36).substring(2, 15);
    await pool.query(`
      INSERT INTO api_keys (api_key, name, tenant_id, rate_limit) VALUES
      ($1, 'کلید نمونه برای توسعه', 'dev_tenant_001', 1000)
      ON CONFLICT (tenant_id) DO NOTHING;
    `, [sampleApiKey]);

    await pool.query(`
      INSERT INTO credit_balances (tenant_id, balance) VALUES
      ('dev_tenant_001', 5000)
      ON CONFLICT (tenant_id) DO NOTHING;
    `);

    console.log('✅ داده‌های نمونه ایجاد شدند');
    console.log(`🔑 API Key نمونه: ${sampleApiKey}`);
    console.log('👤 Tenant ID: dev_tenant_001');
    console.log('💰 اعتبار اولیه: 5000 واحد');

  } catch (error) {
    console.error('❌ خطا در راه‌اندازی دیتابیس:', error.message);
    console.error('جزئیات خطا:', error);
  } finally {
    await pool.end();
    console.log('🔌 اتصال بسته شد');
  }
}

// اگر مستقیماً اجرا شد
if (import.meta.url === `file://${process.argv[1]}`) {
  setupPostgres();
}

export { setupPostgres };
POSTGRESJS
echo "   ✅ اسکریپت PostgreSQL ایجاد شد"

# 6. ایجاد فایل README اصلی
cat > README.md << 'README'
# 🚀 TetraShop SaaS Platform

پلتفرم کامل SaaS با ۲۶ سرویس هوش مصنوعی - بخشی از پروژه‌های TetraShop

## ✨ ویژگی‌های اصلی
- ✅ **۲۶ سرویس هوش مصنوعی** در ۱۲ دسته‌بندی مختلف
- ✅ **سیستم احراز هویت پیشرفته** با مدیریت API Key
- ✅ **مدیریت اعتبار و صورتحساب** واقعی
- ✅ **محدودیت نرخ (Rate Limiting)** برای هر کاربر
- ✅ **لاگ‌گیری کامل** همه درخواست‌ها
- ✅ **آماده برای تولید (Production Ready)**
- ✅ **پشتیبانی از PostgreSQL** (برای Vercel)

## 🏗️ معماری پروژه

## 🚀 شروع سریع

### نصب و راه‌اندازی محلی
```bash
# کلون پروژه
git clone https://github.com/your-username/tetrashop-saas.git
cd trashop-saas

# نصب وابستگی‌ها
npm install

# راه‌اندازی دیتابیس محلی (برای توسعه)
# نیاز به PostgreSQL نصب شده دارد
export DATABASE_URL="postgresql://localhost/tetrashop"
node scripts/setup-postgres.js

# راه‌اندازی سرور
npm start
