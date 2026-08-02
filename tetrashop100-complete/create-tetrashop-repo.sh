#!/bin/bash
echo "🚀 ایجاد ریپازیتوری جدید برای Tetrashop100 کامل"

# اطلاعات جدید
NEW_REPO="tetrashop100-complete"
USERNAME="tetrashop"

echo "📦 ایجاد ریپازیتوری جدید: $NEW_REPO"

# تغییر به دایرکتوری اصلی
cd ~/tetrashop-consolidated

# ایجاد دایرکتوری جدید برای ریپازیتوری کامل
mkdir -p $NEW_REPO
cd $NEW_REPO

# کپی تمام محتوا
cp -r ../deploy-ready/* .
cp -r ../organized-projects/* .

# مقداردهی اولیه Git جدید
git init
git add .
git commit -m "🚀 Tetrashop100 Complete System v2.0

✅ سیستم مدیریت مالی کامل
✅ پنل مدیریت رمزارز  
✅ سیستم تبدیل 3D به‌روزرسانی شده
✅ احراز هویت امن
✅ پنل کاربری شخصی
✅ بهینه‌سازی برای استقرار
✅ پیکربندی همه پلتفرم‌ها"

echo "✅ پروژه جدید آماده است"
echo "🌐 برای ایجاد ریپازیتوری:"
echo "1. به https://github.com/new بروید"
echo "2. نام: $NEW_REPO"
echo "3. توضیح: Tetrashop100 Complete System"
echo "4. Public انتخاب کنید"
echo "5. Create repository"
echo ""
echo "سپس دستورات زیر را اجرا کنید:"
echo "git remote add origin https://github.com/$USERNAME/$NEW_REPO.git"
echo "git push -u origin main"
