#!/data/data/com.termux/files/usr/bin/bash

# ================================================================
#  استخراج آخرین دیپلوی پروژه‌های معتبر با تأیید صحت عملکرد
# ================================================================

set -e

cd ~/integrated_system_final
git checkout integrated-platform

# ================================================================
#  مرحله ۱: آماده‌سازی لیست آدرس‌ها
# ================================================================

if [ ! -f urls.txt ]; then
    echo "❌ فایل urls.txt یافت نشد. لطفاً لیست آدرس‌ها را در این فایل قرار دهید."
    exit 1
fi

echo "📋 خواندن لیست آدرس‌ها از urls.txt ..."

# ================================================================
#  مرحله ۲: استخراج آخرین دیپلوی هر پروژه
# ================================================================

declare -A last_url
declare -A project_names

while read -r url; do
    # حذف فضاهای خالی
    url=$(echo "$url" | xargs)
    [ -z "$url" ] && continue

    # استخراج نام پروژه (قسمت قبل از اولین خط تیره)
    project=$(echo "$url" | sed -E 's/^([a-z-]+)-.*/\1/')
    # ذخیره آخرین آدرس (آخرین در لیست = جدیدترین)
    last_url["$project"]="$url"
done < urls.txt

echo "🔍 ${#last_url[@]} پروژه‌ی منحصربه‌فرد شناسایی شد."

# ================================================================
#  مرحله ۳: تأیید صحت عملکرد هر پروژه
# ================================================================

declare -A valid_projects
declare -A valid_urls

for project in "${!last_url[@]}"; do
    url="https://${last_url[$project]}"
    echo -n "⏳ بررسی $project ... "
    
    # تست با curl (فقط status code، timeout 5 ثانیه)
    status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$url" 2>/dev/null)
    
    if [ "$status" = "200" ]; then
        echo "✅ فعال (HTTP $status)"
        valid_projects["$project"]="online"
        valid_urls["$project"]="$url"
    else
        echo "⚠️ غیرفعال یا خطا (HTTP $status) - رد شد"
        valid_projects["$project"]="offline"
    fi
done

online_count=$(printf '%s\n' "${!valid_projects[@]}" | grep -v "offline" | wc -l)
echo "✅ $online_count پروژه‌ی معتبر برای نمایش در داشبورد انتخاب شد."

# ================================================================
#  مرحله ۴: تولید فایل config.js
# ================================================================

cat > frontend/config.js << 'EOF'
// ================================================================
//  تنظیمات پلتفرم یکپارچه - فقط پروژه‌های معتبر
//  (تولید شده به‌صورت خودکار در تاریخ $(date '+%Y-%m-%d %H:%M:%S'))
// ================================================================

const SERVICES_CONFIG = [
EOF

for project in "${!valid_projects[@]}"; do
    status="${valid_projects[$project]}"
    # فقط پروژه‌های online را به config اضافه کن
    if [ "$status" = "online" ]; then
        url="${valid_urls[$project]}"
        
        # تنظیم نام و توضیحات بر اساس پروژه
        case "$project" in
            "refrigitz")
                name="🎨 تبدیل 2D به 3D"
                desc="تبدیل تصاویر به مدل‌های سه‌بعدی با کیفیت بالا"
                ;;
            "natiq-ultimate")
                name="🧠 پردازش زبان طبیعی"
                desc="تحلیل متن، خلاصه‌سازی و پاسخ‌گویی هوشمند"
                ;;
            "chess-engine")
                name="♟️ موتور شطرنج"
                desc="بازی شطرنج با هوش مصنوعی پیشرفته"
                ;;
            "probability-mach")
                name="📈 ابزارهای احتمالات"
                desc="محاسبات آماری و احتمالاتی دقیق"
                ;;
            "tetrashop-projects")
                name="🛍️ فروشگاه"
                desc="مدیریت محصولات، سبد خرید و پرداخت"
                ;;
            "integrated-system")
                name="🏠 داشبورد اصلی"
                desc="صفحه‌ی اصلی پلتفرم یکپارچه"
                ;;
            "tetra")
                name="🧩 سرویس Tetra"
                desc="سرویس‌های پیشرفته"
                ;;
            "olympic")
                name="🏅 بازی‌های المپیک"
                desc="بازی‌های تعاملی المپیکی"
                ;;
            "shop")
                name="🛒 فروشگاه"
                desc="فروشگاه آنلاین"
                ;;
            *)
                name="$project"
                desc="سرویس $project"
                ;;
        esac
        
        echo "    { id: '$project', name: '$name', desc: '$desc', url: '$url', status: 'online' }," >> frontend/config.js
    fi
done

echo "];" >> frontend/config.js

# ================================================================
#  مرحله ۵: commit و push به GitHub
# ================================================================

echo "📤 ارسال تغییرات به GitHub..."

git add frontend/config.js
git commit -m "🔧 به‌روزرسانی خودکار: ${online_count} سرویس معتبر از آخرین دیپلوی‌ها" || echo "⚠️ هیچ تغییری برای commit وجود ندارد."
git push -u origin integrated-platform --force

# ================================================================
#  نتیجه نهایی
# ================================================================

echo ""
echo "============================================================"
echo "✅ پلتفرم یکپارچه با ${online_count} سرویس معتبر به‌روز شد."
echo "📊 پروژه‌های فعال:"
for project in "${!valid_projects[@]}"; do
    if [ "${valid_projects[$project]}" = "online" ]; then
        echo "   ✅ $project: ${valid_urls[$project]}"
    fi
done
echo "============================================================"
echo "🌐 اکنون در Vercel، پروژه‌ی integrated-platform را Redeploy کنید."
