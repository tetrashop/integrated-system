#!/bin/bash

echo "🚀 راه‌اندازی کامل سیستم Git برای TetraSaaS"
echo "=========================================="

PROJECT_DIR="/data/data/com.termux/files/home/tetrashop-projects"

# تغییر به دایرکتوری پروژه
cd "$PROJECT_DIR" || {
    echo "❌ خطا: دایرکتوری پروژه یافت نشد"
    exit 1
}

echo "📁 دایرکتوری فعلی: $(pwd)"
echo ""

# 1. ایجاد اسکریپت‌ها
echo "📝 ایجاد اسکریپت‌های مدیریت Git..."

# ایجاد اسکریپت اصلی
cat > git-sync-master.sh << 'MASTER_EOF'
#!/bin/bash
# محتوای کامل اسکریپت git-sync-master.sh اینجا کپی می‌شود
# (همان محتوای بخش اول)
MASTER_EOF

# ایجاد اسکریپت بروزرسانی خودکار
cat > auto-git-update.sh << 'AUTO_EOF'
#!/bin/bash
# محتوای کامل اسکریپت auto-git-update.sh اینجا کپی می‌شود
# (همان محتوای بخش دوم)
AUTO_EOF

# ایجاد اسکریپت تنظیم cron
cat > setup-cron.sh << 'CRON_EOF'
#!/bin/bash
# محتوای کامل اسکریپت setup-cron.sh اینجا کپی می‌شود
# (همان محتوای بخش سوم)
CRON_EOF

echo "✅ اسکریپت‌ها ایجاد شدند"
echo ""

# 2. تنظیم مجوزهای اجرایی
echo "🔧 تنظیم مجوزهای اجرایی..."
chmod +x git-sync-master.sh
chmod +x auto-git-update.sh
chmod +x setup-cron.sh
echo "✅ مجوزها تنظیم شدند"
echo ""

# 3. تنظیم .gitignore
echo "📋 تنظیم فایل .gitignore..."
if [ -f .gitignore ]; then
    echo "⚠️ فایل .gitignore از قبل وجود دارد. اضافه کردن تنظیمات جدید..."
    cat >> .gitignore << 'GITIGNORE_EOF'

# ===========================================
# تنظیمات Git Management System - TetraSaaS
# ===========================================
git-auto-update.log
git-backups/
.conflict-backup/
.stash-backup/
.git-sync-backup-*
sync-backup-*
GITIGNORE_EOF
else
    cat > .gitignore << 'GITIGNORE_NEW'
# محتوای کامل .gitignore اینجا کپی می‌شود
# (همان محتوای بخش چهارم)
GITIGNORE_NEW
fi
echo "✅ .gitignore تنظیم شد"
echo ""

# 4. ایجاد پوشه‌های لازم
echo "📁 ایجاد پوشه‌های سیستم..."
mkdir -p git-backups
mkdir -p .conflict-backup
mkdir -p .stash-backup
echo "✅ پوشه‌ها ایجاد شدند"
echo ""

# 5. راه‌اندازی Git (اگر وجود ندارد)
echo "🔄 راه‌اندازی سیستم Git..."
if [ ! -d ".git" ]; then
    echo "⚙️ در حال initialize کردن Git..."
    git init
    git config user.email "tetrasaas@example.com"
    git config user.name "TetraSaaS Team"
    git branch -M main
    echo "✅ Git initialized شد"
else
    echo "✅ Git از قبل initialized شده"
fi
echo ""

# 6. نمایش دستورات
echo "🎯 دستورات اصلی:"
echo "================="
echo ""
echo "1. تنظیم remote (اولین بار):"
echo "   ./git-sync-master.sh setup-remote https://github.com/YOUR-USERNAME/tetrashop-projects.git"
echo ""
echo "2. همگام‌سازی کامل:"
echo "   ./git-sync-master.sh sync"
echo ""
echo "3. وضعیت تفصیلی:"
echo "   ./git-sync-master.sh status"
echo ""
echo "4. فعال‌سازی بروزرسانی خودکار:"
echo "   ./setup-cron.sh"
echo ""
echo "5. بروزرسانی دستی:"
echo "   ./auto-git-update.sh"
echo ""
echo "6. مشاهده لاگ:"
echo "   tail -f git-auto-update.log"
echo ""

# 7. ایجاد فایل README
cat > README-GIT-MANAGEMENT.md << 'README_EOF'
# 🚀 سیستم مدیریت Git TetraSaaS

## 📋 دستورات سریع

### راه‌اندازی اولیه:
```bash
# 1. تنظیم remote
./git-sync-master.sh setup-remote https://github.com/YOUR-USERNAME/tetrashop-projects.git

# 2. همگام‌سازی اولیه
./git-sync-master.sh sync

# 3. فعال‌سازی بروزرسانی خودکار
./setup-cron.sh
