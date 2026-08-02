#!/bin/bash

echo "📈 تحلیل روند بهره‌وری TetraSaaS"
echo "================================"
echo ""

# پیدا کردن فایل‌های نتایج قبلی
RESULTS_FILES=$(ls -t productivity-*.json 2>/dev/null | head -5)

if [ -z "$RESULTS_FILES" ]; then
    echo "⚠️ هیچ داده‌ای از قبل ثبت نشده است."
    echo "لطفاً ابتدا تست را اجرا کنید:"
    echo "./test-productivity-comparison.sh"
    exit 1
fi

echo "📅 آخرین نتایج ثبت شده:"
echo "----------------------"

# خواندن و نمایش نتایج
for file in $RESULTS_FILES; do
    date_str=$(echo $file | grep -o '[0-9]\{8\}')
    if [ -n "$date_str" ]; then
        human_date="${date_str:6:2}/${date_str:4:2}/${date_str:0:4}"
        
        health=$(jq '.stats.health_percentage' "$file" 2>/dev/null || echo "0")
        response=$(jq '.stats.avg_response_time_ms' "$file" 2>/dev/null || echo "0")
        score=$(jq '.productivity_score' "$file" 2>/dev/null || echo "0")
        
        echo "📌 $human_date:"
        echo "   سلامت: ${health}%"
        echo "   زمان پاسخ: ${response}ms"
        echo "   نمره: ${score}/100"
        echo ""
    fi
done

# تحلیل روند
echo "📊 تحلیل روند:"
echo "--------------"

# محاسبه میانگین
total_health=0
total_response=0
total_score=0
count=0

for file in $RESULTS_FILES; do
    health=$(jq '.stats.health_percentage' "$file" 2>/dev/null || echo "0")
    response=$(jq '.stats.avg_response_time_ms' "$file" 2>/dev/null || echo "0")
    score=$(jq '.productivity_score' "$file" 2>/dev/null || echo "0")
    
    total_health=$((total_health + health))
    total_response=$((total_response + response))
    total_score=$((total_score + score))
    count=$((count + 1))
done

if [ $count -gt 0 ]; then
    avg_health=$((total_health / count))
    avg_response=$((total_response / count))
    avg_score=$((total_score / count))
    
    echo "📈 میانگین ${count} روز اخیر:"
    echo "  • سلامت: ${avg_health}%"
    echo "  • زمان پاسخ: ${avg_response}ms"
    echo "  • نمره: ${avg_score}/100"
    echo ""
fi

# مقایسه اولین و آخرین
first_file=$(ls -tr productivity-*.json 2>/dev/null | head -1)
last_file=$(ls -tr productivity-*.json 2>/dev/null | tail -1)

if [ -n "$first_file" ] && [ -n "$last_file" ] && [ "$first_file" != "$last_file" ]; then
    first_health=$(jq '.stats.health_percentage' "$first_file" 2>/dev/null || echo "0")
    first_score=$(jq '.productivity_score' "$first_file" 2>/dev/null || echo "0")
    
    last_health=$(jq '.stats.health_percentage' "$last_file" 2>/dev/null || echo "0")
    last_score=$(jq '.productivity_score' "$last_file" 2>/dev/null || echo "0")
    
    health_change=$((last_health - first_health))
    score_change=$((last_score - first_score))
    
    echo "📅 مقایسه اولین و آخرین تست:"
    echo "  اولین تست ($first_file):"
    echo "    سلامت: ${first_health}% - نمره: ${first_score}/100"
    echo "  آخرین تست ($last_file):"
    echo "    سلامت: ${last_health}% - نمره: ${last_score}/100"
    echo ""
    echo "  تغییر کلی:"
    if [ $health_change -gt 0 ]; then
        echo "    ✅ سلامت: +${health_change}% بهبود"
    elif [ $health_change -lt 0 ]; then
        echo "    ❌ سلامت: ${health_change}% کاهش"
    else
        echo "    ➡️ سلامت: بدون تغییر"
    fi
    
    if [ $score_change -gt 0 ]; then
        echo "    ✅ نمره: +${score_change} بهبود"
    elif [ $score_change -lt 0 ]; then
        echo "    ❌ نمره: ${score_change} کاهش"
    else
        echo "    ➡️ نمره: بدون تغییر"
    fi
fi

# پیش‌بینی
echo ""
echo "🔮 پیش‌بینی آینده:"
current_score=$(jq '.productivity_score' "$last_file" 2>/dev/null || echo "0")

if [ $current_score -ge 85 ]; then
    echo "  وضعیت عالی 🏆 - احتمالاً ثابت باقی می‌ماند"
elif [ $current_score -ge 70 ]; then
    echo "  وضعیت خوب ✅ - امکان بهبود جزئی وجود دارد"
elif [ $current_score -ge 50 ]; then
    echo "  وضعیت متوسط ⚠️ - نیاز به اقدامات بهینه‌سازی"
else
    echo "  وضعیت نیازمند توجه 🚨 - نیاز به بررسی فوری"
fi

# ایجاد گزارش HTML
cat > productivity-report.html << 'HTML_EOF'
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <title>گزارش بهره‌وری TetraSaaS</title>
    <style>
        body { font-family: Tahoma; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        h1 { color: #333; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }
        .stat { margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 5px; }
        .positive { color: green; }
        .negative { color: red; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 گزارش تحلیل بهره‌وری TetraSaaS</h1>
        <p>تاریخ تولید: $(date '+%Y/%m/%d %H:%M')</p>
        
        <h2>📈 خلاصه عملکرد</h2>
        <div class="stat">
            <strong>میانگین سلامت سرویس‌ها:</strong> ${avg_health}%
        </div>
        <div class="stat">
            <strong>میانگین زمان پاسخ:</strong> ${avg_response}ms
        </div>
        <div class="stat">
            <strong>میانگین نمره بهره‌وری:</strong> ${avg_score}/100
        </div>
        
        <h2>📅 روند تغییرات</h2>
        <div class="stat">
            <strong>تغییر سلامت از ابتدا:</strong> 
            <span class="$( [ $health_change -gt 0 ] && echo 'positive' || echo 'negative' )">
                ${health_change}%
            </span>
        </div>
        <div class="stat">
            <strong>تغییر نمره از ابتدا:</strong> 
            <span class="$( [ $score_change -gt 0 ] && echo 'positive' || echo 'negative' )">
                ${score_change} امتیاز
            </span>
        </div>
        
        <h2>💡 توصیه‌ها</h2>
        <ul>
HTML_EOF

# اضافه کردن توصیه‌ها بر اساس وضعیت
if [ $avg_score -lt 60 ]; then
    echo "<li>نیاز به بهبود اساسی در سرویس‌ها</li>" >> productivity-report.html
    echo "<li>بررسی سرویس‌های غیرفعال</li>" >> productivity-report.html
    echo "<li>بهینه‌سازی زمان پاسخ</li>" >> productivity-report.html
elif [ $avg_score -lt 75 ]; then
    echo "<li>بهینه‌سازی سرویس‌های کند</li>" >> productivity-report.html
    echo "<li>افزایش پایداری سرویس‌ها</li>" >> productivity-report.html
    echo "<li>مانیتورینگ مداوم</li>" >> productivity-report.html
else
    echo "<li>حفظ وضعیت فعلی</li>" >> productivity-report.html
    echo "<li>افزایش ظرفیت سرویس‌های پراستفاده</li>" >> productivity-report.html
    echo "<li>اضافه کردن قابلیت‌های جدید</li>" >> productivity-report.html
fi

cat >> productivity-report.html << 'HTML_EOF'
        </ul>
        
        <h2>📞 تماس</h2>
        <p>برای اطلاعات بیشتر، تست‌های روزانه را ادامه دهید.</p>
        
        <p style="margin-top: 30px; color: #666; text-align: center;">
            ایجاد شده توسط سیستم مانیتورینگ TetraSaaS
        </p>
    </div>
</body>
</html>
HTML_EOF

echo ""
echo "📄 گزارش HTML ایجاد شد: productivity-report.html"
echo "🌐 برای مشاهده:"
echo "   - در ترمینال: python3 -m http.server 8080"
echo "   - سپس: http://localhost:8080/productivity-report.html"
echo ""
echo "✅ تحلیل کامل انجام شد!"
