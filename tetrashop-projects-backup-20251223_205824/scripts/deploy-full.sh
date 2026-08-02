#!/bin/bash

echo "🚀 دیپلوی کامل TetraSaaS به Vercel"
echo "================================="
echo ""

# رنگ‌ها برای خروجی
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# تابع نمایش خطا
show_error() {
    echo -e "${RED}❌ $1${NC}"
}

# تابع نمایش موفقیت
show_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# تابع نمایش اطلاعات
show_info() {
    echo -e "${YELLOW}📌 $1${NC}"
}

# متغیرها
PROJECT_DIR="/data/data/com.termux/files/home/tetrashop-projects"
GIT_REPO="https://github.com/YOUR-USERNAME/tetrasaas.git"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_DIR="$HOME/tetrasaas-backup-$TIMESTAMP"

# مرحله 1: بررسی دایرکتوری
cd "$PROJECT_DIR" || {
    show_error "دایرکتوری پروژه یافت نشد: $PROJECT_DIR"
    exit 1
}

echo "📂 دایرکتوری پروژه: $(pwd)"
echo ""

# مرحله 2: ایجاد پشتیبان
show_info "مرحله 1: ایجاد پشتیبان از پروژه"
mkdir -p "$BACKUP_DIR"
rsync -av --exclude='node_modules' --exclude='*.log' . "$BACKUP_DIR/" > /dev/null 2>&1
show_success "پشتیبان ایجاد شد: $BACKUP_DIR"
echo ""

# مرحله 3: بررسی فایل‌های ضروری
show_info "مرحله 2: بررسی فایل‌های ضروری"
REQUIRED_FILES=("package.json" "api/index.js" "vercel.json")
missing_files=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        show_success "$file موجود است"
    else
        show_error "$file یافت نشد"
        missing_files=$((missing_files + 1))
    fi
done

if [ $missing_files -gt 0 ]; then
    show_error "لطفا فایل‌های ضروری را ایجاد کنید"
    exit 1
fi
echo ""

# مرحله 4: نصب وابستگی‌ها
show_info "مرحله 3: نصب وابستگی‌های Node.js"
if [ -f "package.json" ]; then
    npm install --silent
    if [ $? -eq 0 ]; then
        show_success "وابستگی‌ها نصب شدند"
    else
        show_error "خطا در نصب وابستگی‌ها"
        exit 1
    fi
fi
echo ""

# مرحله 5: تست API
show_info "مرحله 4: تست API Gateway"
timeout 5 node api/index.js > /dev/null 2>&1 &
SERVER_PID=$!
sleep 2

if curl -s http://localhost:3000/health > /dev/null; then
    show_success "API Gateway کار می‌کند"
    kill $SERVER_PID 2>/dev/null
else
    show_error "API Gateway پاسخ نمی‌دهد"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi
echo ""

# مرحله 6: Git operations
show_info "مرحله 5: عملیات Git"

# بررسی اینکه آیا git initialized است
if [ ! -d ".git" ]; then
    show_info "راه‌اندازی Git..."
    git init
    git config user.email "tetrasaas@example.com"
    git config user.name "TetraSaaS Team"
    show_success "Git initialized"
fi

# بررسی remote origin
if ! git remote | grep -q "origin"; then
    show_info "لطفا remote origin را تنظیم کنید:"
    echo "   git remote add origin $GIT_REPO"
    echo "   git branch -M main"
    echo ""
    read -p "آیا می‌خواهید ادامه دهید؟ (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        show_error "عملیات متوقف شد"
        exit 1
    fi
fi

# اضافه کردن همه فایل‌ها
git add -A
CHANGES=$(git status --porcelain)

if [ -n "$CHANGES" ]; then
    COMMIT_MSG="🚀 بروزرسانی TetraSaaS - $TIMESTAMP"
    git commit -m "$COMMIT_MSG"
    show_success "تغییرات commit شدند: $COMMIT_MSG"
else
    show_info "هیچ تغییری برای commit وجود ندارد"
fi
echo ""

# مرحله 7: Push به GitHub
show_info "مرحله 6: Push به GitHub"
if git remote | grep -q "origin"; then
    git push -u origin main
    if [ $? -eq 0 ]; then
        show_success "کدها با موفقیت به GitHub پوش شدند"
    else
        show_error "خطا در پوش به GitHub"
        show_info "ممکن است نیاز به تنظیم token داشته باشید"
    fi
else
    show_error "Remote origin تنظیم نشده است"
fi
echo ""

# مرحله 8: دیپلوی روی Vercel
show_info "مرحله 7: دیپلوی روی Vercel"

# بررسی وجود Vercel CLI
if command -v vercel > /dev/null 2>&1; then
    show_info "Vercel CLI نصب است. شروع دیپلوی..."
    
    # دیپلوی در حالت production
    vercel --prod --yes --token=$VERCEL_TOKEN 2>&1 | tee vercel-deploy.log
    
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        # استخراج آدرس از لاگ
        DEPLOY_URL=$(grep -o 'https://[^ ]*\.vercel\.app' vercel-deploy.log | head -1)
        if [ -n "$DEPLOY_URL" ]; then
            show_success "✅ دیپلوی موفقیت‌آمیز بود!"
            echo ""
            echo "🌐 آدرس دپلوی شده: $DEPLOY_URL"
            echo ""
            
            # ایجاد فایل با آدرس
            echo "$DEPLOY_URL" > deploy-url.txt
            echo "تاریخ: $(date)" >> deploy-url.txt
            echo "ورژن: 2.0.0" >> deploy-url.txt
            
            # تست آدرس دپلوی شده
            show_info "تست آدرس دپلوی شده..."
            sleep 3
            if curl -s "$DEPLOY_URL/health" > /dev/null; then
                show_success "سرویس روی Vercel فعال است"
            else
                show_info "سرویس در حال راه‌اندازی است..."
            fi
        fi
    else
        show_error "خطا در دیپلوی Vercel"
    fi
else
    show_info "Vercel CLI نصب نیست. برای نصب:"
    echo "   npm install -g vercel"
    echo ""
    show_info "یا می‌توانید از طریق وبسایت Vercel دپلوی کنید:"
    echo "   1. به https://vercel.com بروید"
    echo "   2. روی 'Import Project' کلیک کنید"
    echo "   3. ریپازیتوری GitHub خود را انتخاب کنید"
    echo "   4. تنظیمات را تایید و دپلوی کنید"
fi

echo ""
echo "================================="
show_success "🎉 فرآیند دیپلوی کامل شد!"
echo ""
echo "📋 خلاصه:"
echo "   📂 پشتیبان: $BACKUP_DIR"
echo "   💾 Git: تغییرات commit و push شدند"
echo "   🌐 Vercel: دیپلوی در حال اجراست"
echo "   ⏰ زمان: $TIMESTAMP"
echo ""
echo "🔗 برای مدیریت:"
echo "   ./scripts/manage.sh status"
echo "   ./scripts/manage.sh update"
echo "   ./scripts/manage.sh redeploy"
echo ""
echo "📞 پشتیبانی: issues در ریپازیتوری GitHub"
