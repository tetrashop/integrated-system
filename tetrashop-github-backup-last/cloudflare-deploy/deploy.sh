#!/bin/bash

echo "🚀 استقرار خودکار تتراشاپ در Cloudflare"
echo "=========================================="

# رنگ‌ها
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# توابع
log() { echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"; }
info() { echo -e "${BLUE}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARNING]${NC} $1"; }

# بررسی پیش‌نیازها
check_prerequisites() {
    log "بررسی پیش‌نیازها..."
    
    if ! command -v npm &> /dev/null; then
        error "Node.js/npm یافت نشد. لطفا نصب کنید: https://nodejs.org"
        return 1
    fi
    
    if ! command -v wrangler &> /dev/null; then
        warn "Wrangler یافت نشد. در حال نصب..."
        npm install -g wrangler
    fi
    
    # بررسی لاگین Cloudflare
    if ! wrangler whoami &> /dev/null; then
        warn "لطفا با دستور زیر به Cloudflare لاگین کنید:"
        echo "wrangler login"
        return 1
    fi
    
    return 0
}

# استقرار Pages
deploy_pages() {
    log "استقرار فرانت‌اند در Cloudflare Pages..."
    cd pages
    
    if [ -f "wrangler.toml" ]; then
        info "در حال استقرار Pages..."
        wrangler pages deploy --project-name=tetrashop-pages
        
        if [ $? -eq 0 ]; then
            log "✅ Pages با موفقیت مستقر شد"
        else
            warn "خطا در استقرار Pages"
        fi
    else
        warn "فایل پیکربندی Pages یافت نشد"
    fi
    
    cd ..
}

# استقرار Workers
deploy_workers() {
    log "استقرار بک‌اند در Cloudflare Workers..."
    cd workers
    
    if [ -f "wrangler.toml" ]; then
        info "نصب وابستگی‌ها..."
        npm install
        
        info "در حال استقرار Workers..."
        wrangler deploy
        
        if [ $? -eq 0 ]; then
            log "✅ Workers با موفقیت مستقر شد"
        else
            warn "خطا در استقرار Workers"
        fi
    else
        warn "فایل پیکربندی Workers یافت نشد"
    fi
    
    cd ..
}

# استقرار Worker تخصصی Quantum NLP
deploy_quantum_worker() {
    log "استقرار Worker تخصصی نگار کوانتوم..."
    
    cat > quantum-nlp.toml << 'QUANTUM_TOML'
name = "quantum-nlp"
compatibility_date = "2024-11-06"
main = "src/quantum-nlp.js"

[env.production]
account_id = "YOUR_ACCOUNT_ID"
QUANTUM_TOML

    # استقرار Worker
    wrangler deploy --config quantum-nlp.toml
    
    if [ $? -eq 0 ]; then
        log "✅ Quantum NLP Worker مستقر شد"
    else
        warn "خطا در استقرار Quantum NLP Worker"
    fi
}

# ایجاد دامنه سفارشی (اختیاری)
setup_custom_domain() {
    log "تنظیم دامنه سفارشی (اختیاری)..."
    
    info "برای تنظیم دامنه سفارشی:"
    echo "1. به Cloudflare Dashboard بروید"
    echo "2. Pages → tetrashop-pages → Custom domains"
    echo "3. دامنه مورد نظر را اضافه کنید"
    echo ""
    echo "پیشنهاد دامنه: tetrashop.ir یا tetrashop.dev"
}

# نمایش اطلاعات استقرار
show_deployment_info() {
    log "📊 اطلاعات استقرار:"
    echo ""
    echo "🌐 Pages URL: https://tetrashop-pages.pages.dev"
    echo "⚡ Workers URL: https://tetrashop-api.tetrashop.workers.dev"
    echo "🧠 Quantum NLP: https://quantum-nlp.tetrashop.workers.dev"
    echo ""
    echo "🔧 مدیریت:"
    echo "   https://dash.cloudflare.com"
    echo ""
    echo "📖 مستندات:"
    echo "   https://developers.cloudflare.com/pages/"
    echo "   https://developers.cloudflare.com/workers/"
}

# تابع اصلی
main() {
    echo "☁️  استقرار تتراشاپ در Cloudflare"
    echo "================================"
    
    if check_prerequisites; then
        deploy_pages
        deploy_workers
        deploy_quantum_worker
        setup_custom_domain
        show_deployment_info
        
        log "🎉 استقرار کامل شد!"
    else
        warn "استقرار متوقف شد. لطفا پیش‌نیازها را بررسی کنید."
    fi
}

# اجرا
main
