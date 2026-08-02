#!/bin/bash

echo "🚀 شروع راه‌اندازی کامل پروژه TetraSaaS"
echo "========================================"

# رنگ‌های ترمینال
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# تابع برای نمایش پیام موفقیت
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# تابع برای نمایش پیام خطا
error() {
    echo -e "${RED}❌ $1${NC}"
}

# تابع برای نمایش پیام اطلاعات
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# تابع برای نمایش پیام هشدار
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# بررسی وجود پوشه پروژه
if [ ! -d "/data/data/com.termux/files/home/tetrashop-projects" ]; then
    error "پوشه پروژه یافت نشد!"
    exit 1
fi

cd /data/data/com.termux/files/home/tetrashop-projects

echo ""
info "مرحله ۱: بررسی ساختار پوشه‌ها..."
mkdir -p gateway/{routes,middlewares,services,logs,config}
mkdir -p client-sdk/examples
mkdir -p services/{nlp,formula,ai-writer,3d-converter}
success "ساختار پوشه‌ها ایجاد شد"

echo ""
info "مرحله ۲: نصب وابستگی‌های Gateway..."
cd gateway
if [ ! -f "package.json" ]; then
    error "فایل package.json در Gateway یافت نشد!"
    exit 1
fi
npm install
if [ $? -eq 0 ]; then
    success "وابستگی‌های Gateway نصب شدند"
else
    error "خطا در نصب وابستگی‌های Gateway"
    exit 1
fi

echo ""
info "مرحله ۳: نصب وابستگی‌های داشبورد React..."
cd ..
if [ ! -f "package.json" ]; then
    error "فایل package.json اصلی یافت نشد!"
    exit 1
fi
npm install
if [ $? -eq 0 ]; then
    success "وابستگی‌های React نصب شدند"
else
    error "خطا در نصب وابستگی‌های React"
    exit 1
fi

echo ""
info "مرحله ۴: بررسی فایل‌های اصلی..."
if [ ! -f "gateway/server.js" ]; then
    error "فایل gateway/server.js یافت نشد!"
    exit 1
fi

if [ ! -f "src/App.tsx" ]; then
    error "فایل src/App.tsx یافت نشد!"
    exit 1
fi

if [ ! -f "client-sdk/tetra-sdk.js" ]; then
    error "فایل client-sdk/tetra-sdk.js یافت نشد!"
    exit 1
fi

success "همه فایل‌های اصلی موجود هستند"

echo ""
info "مرحله ۵: ایجاد فایل‌های پیکربندی..."

# ایجاد فایل vite.config.js برای جلوگیری از خطای ELOOP
cat > vite.config.js << 'VITECONFIG'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: [
        '**/intelligent-writer-backup-20251021/**',
        '**/secret-garden/**',
        '**/projects/intelligent-writer-backup-20251021/**',
        '**/node_modules/**',
      ]
    }
  }
})
VITECONFIG

success "فایل‌های پیکربندی ایجاد شدند"

echo ""
warning "📋 خلاصه راه‌اندازی:"
echo "========================================"
echo "۱. Gateway:       http://localhost:3000"
echo "۲. مستندات:       http://localhost:3000/docs"
echo "۳. داشبورد:       http://localhost:5173"
echo "۴. کلید تست:      apikey_user_free_123"
echo "۵. SDK:           در پوشه client-sdk"
echo "========================================"

echo ""
info "🎉 راه‌اندازی با موفقیت کامل شد!"
echo ""
echo "برای شروع کار، این دستورات را در ترمینال‌های جداگانه اجرا کنید:"
echo ""
echo "  🔵 ترمینال ۱ (Gateway):"
echo "      cd /data/data/com.termux/files/home/tetrashop-projects/gateway"
echo "      node server.js"
echo ""
echo "  🟢 ترمینال ۲ (داشبورد):"
echo "      cd /data/data/com.termux/files/home/tetrashop-projects"
echo "      npm run dev"
echo ""
echo "  🟡 ترمینال ۳ (تست SDK):"
echo "      cd /data/data/com.termux/files/home/tetrashop-projects/client-sdk"
echo "      node examples/basic.js"
echo ""
echo "📚 مستندات کامل در: http://localhost:3000/docs"
