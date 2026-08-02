#!/bin/bash

echo "📈 ایجاد گزارش مقایسه بهره‌وری"
echo "==============================="

# یافتن فایل‌های نتایج
RESULTS_FILES=$(ls -t productivity-*.json 2>/dev/null | head -10)

if [ -z "$RESULTS_FILES" ]; then
    echo "❌ هیچ نتیجه‌ای یافت نشد"
    echo "اول تست را اجرا کنید: ./test-prod-fixed.sh"
    exit 1
fi

# محاسبه میانگین
total_health=0
total_response=0
total_score=0
count=0
best_score=0
worst_score=100

echo "📅 تاریخچه نتایج:"
echo "----------------"

for file in $RESULTS_FILES; do
    date_str=$(echo $file | grep -o '[0-9]\{8\}-[0-9]\{6\}' | head -1)
    if [ -n "$date_str" ]; then
        human_date="${date_str:9:2}:${date_str:11:2} ${date_str:6:2}/${date_str:4:2}"
        
        health=$(grep -o '"health_percentage":[0-9]*' "$file" | cut -d: -f2 | head -1 || echo "0")
        response=$(grep -o '"avg_response_time_ms":[0-9]*' "$file" | cut -d: -f2 | head -1 || echo "0")
        score=$(grep -o '"productivity_score":[0-9]*' "$file" | cut -d: -f2 | head -1 || echo "0")
        
        echo "🕒 $human_date | سلامت: ${health}% | پاسخ: ${response}ms | نمره: ${score}"
        
        total_health=$((total_health + health))
        total_response=$((total_response + response))
        total_score=$((total_score + score))
        count=$((count + 1))
        
        if [ $score -gt $best_score ]; then
            best_score=$score
            best_file=$file
        fi
        if [ $score -lt $worst_score ]; then
            worst_score=$score
            worst_file=$file
        fi
    fi
done

if [ $count -gt 0 ]; then
    avg_health=$((total_health / count))
    avg_response=$((total_response / count))
    avg_score=$((total_score / count))
    
    echo ""
    echo "📊 میانگین $count تست اخیر:"
    echo "  • سلامت: ${avg_health}%"
    echo "  • زمان پاسخ: ${avg_response}ms"
    echo "  • نمره: ${avg_score}/100"
    
    # بهترین و بدترین
    if [ -n "$best_file" ] && [ -n "$worst_file" ]; then
        best_date=$(echo $best_file | grep -o '[0-9]\{8\}-[0-9]\{6\}' | head -1)
        worst_date=$(echo $worst_file | grep -o '[0-9]\{8\}-[0-9]\{6\}' | head -1)
        
        best_health=$(grep -o '"health_percentage":[0-9]*' "$best_file" | cut -d: -f2 | head -1 || echo "0")
        worst_health=$(grep -o '"health_percentage":[0-9]*' "$worst_file" | cut -d: -f2 | head -1 || echo "0")
        
        echo ""
        echo "🏆 بهترین عملکرد:"
        echo "  تاریخ: ${best_date:9:2}:${best_date:11:2}"
        echo "  سلامت: ${best_health}%"
        echo "  نمره: ${best_score}/100"
        
        echo ""
        echo "⚠️ بدترین عملکرد:"
        echo "  تاریخ: ${worst_date:9:2}:${worst_date:11:2}"
        echo "  سلامت: ${worst_health}%"
        echo "  نمره: ${worst_score}/100"
        
        improvement=$((best_score - worst_score))
        echo ""
        echo "📈 پتانسیل بهبود: ${improvement} امتیاز"
    fi
fi

# پیشنهادات
echo ""
echo "💡 راهکارهای بهبود:"
echo "=================="

if [ $avg_health -lt 50 ]; then
    echo "🚨 اولویت ۱: راه‌اندازی سرویس‌های غیرفعال"
    echo "  • اجرای ~/tetra-services-manager.sh start"
    echo "  • بررسی پورت‌های ۳۰۰۱-۳۰۲۳"
    echo "  • تست سلامت تک‌تک سرویس‌ها"
elif [ $avg_response -gt 300 ]; then
    echo "⚡ اولویت ۱: بهینه‌سازی زمان پاسخ"
    echo "  • کاهش حجم پردازش"
    echo "  • اضافه کردن کش"
    echo "  • بهینه‌سازی کد"
elif [ $avg_health -lt 80 ]; then
    echo "🔧 اولویت ۱: افزایش پایداری"
    echo "  • سیستم مانیتورینگ"
    echo "  • راه‌اندازی خودکار"
    echo "  • لاگ‌گیری خطاها"
else
    echo "✅ وضعیت خوب - تمرکز بر توسعه:"
    echo "  • اضافه کردن قابلیت‌های جدید"
    echo "  • بهبود UI/UX"
    echo "  • گسترش APIها"
fi

echo ""
echo "📅 برنامه بهبود:"
echo "1. امروز: راه‌اندازی ۵ سرویس اول"
echo "2. فردا: راه‌اندازی ۱۰ سرویس بعدی"
echo "3. پس‌فردا: بهینه‌سازی و تست"
echo "4. هفته آینده: مانیتورینگ و گزارش"

# ایجاد فایل HTML
cat > productivity-comparison-report.html << 'HTML_EOF'
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <title>گزارش مقایسه بهره‌وری TetraSaaS</title>
    <style>
        body { font-family: Tahoma; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }
        .stat-box { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #4f46e5; }
        .positive { color: green; font-weight: bold; }
        .negative { color: red; font-weight: bold; }
        .timeline { margin: 30px 0; }
        .timeline-item { padding: 10px; border-bottom: 1px solid #eee; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 0.9rem; margin-left: 10px; }
        .badge-good { background: #d4edda; color: #155724; }
        .badge-average { background: #fff3cd; color: #856404; }
        .badge-poor { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 گزارش مقایسه بهره‌وری TetraSaaS</h1>
        <p>تاریخ تولید: $(date '+%Y/%m/%d %H:%M')</p>
        
        <div class="stat-box">
            <h3>📈 عملکرد کلی</h3>
            <p><strong>میانگین سلامت سرویس‌ها:</strong> ${avg_health}%</p>
            <p><strong>میانگین زمان پاسخ:</strong> ${avg_response}ms</p>
            <p><strong>میانگین نمره بهره‌وری:</strong> ${avg_score}/100</p>
        </div>
        
        <div class="stat-box">
            <h3>🏆 بهترین و بدترین عملکرد</h3>
            <p><strong>بهترین نمره:</strong> ${best_score}/100 
                <span class="badge badge-good">عالی</span></p>
            <p><strong>بدترین نمره:</strong> ${worst_score}/100 
                <span class="badge badge-poor">نیاز به بهبود</span></p>
            <p><strong>پتانسیل بهبود:</strong> <span class="positive">+$((best_score - worst_score)) امتیاز</span></p>
        </div>
        
        <div class="timeline">
            <h3>📅 تاریخچه تست‌ها</h3>
HTML_EOF

# اضافه کردن تاریخچه
counter=0
for file in $RESULTS_FILES; do
    date_str=$(echo $file | grep -o '[0-9]\{8\}-[0-9]\{6\}' | head -1)
    if [ -n "$date_str" ]; then
        human_date="${date_str:9:2}:${date_str:11:2} ${date_str:6:2}/${date_str:4:2}"
        score=$(grep -o '"productivity_score":[0-9]*' "$file" | cut -d: -f2 | head -1 || echo "0")
        
        if [ $score -ge 70 ]; then
            badge_class="badge-good"
            badge_text="خوب"
        elif [ $score -ge 50 ]; then
            badge_class="badge-average"
            badge_text="متوسط"
        else
            badge_class="badge-poor"
            badge_text="ضعیف"
        fi
        
        cat >> productivity-comparison-report.html << TIMELINE_EOF
            <div class="timeline-item">
                ${human_date} - نمره: ${score}/100 
                <span class="badge ${badge_class}">${badge_text}</span>
            </div>
TIMELINE_EOF
        
        counter=$((counter + 1))
        if [ $counter -ge 5 ]; then
            break
        fi
    fi
done

cat >> productivity-comparison-report.html << 'HTML_FOOTER'
        </div>
        
        <div class="stat-box">
            <h3>💡 راهکارهای بهبود</h3>
            <ul>
HTML_FOOTER

# اضافه کردن راهکارها
if [ $avg_health -lt 50 ]; then
    cat >> productivity-comparison-report.html << 'RECOMMENDATIONS_EOF'
                <li>راه‌اندازی سرویس‌های غیرفعال</li>
                <li>بررسی پورت‌های ۳۰۰۱-۳۰۲۳</li>
                <li>تست سلامت تک‌تک سرویس‌ها</li>
RECOMMENDATIONS_EOF
elif [ $avg_response -gt 300 ]; then
    cat >> productivity-comparison-report.html << 'RECOMMENDATIONS_EOF'
                <li>بهینه‌سازی زمان پاسخ</li>
                <li>اضافه کردن سیستم کش</li>
                <li>کاهش حجم پردازش</li>
RECOMMENDATIONS_EOF
else
    cat >> productivity-comparison-report.html << 'RECOMMENDATIONS_EOF'
                <li>حفظ وضعیت فعلی</li>
                <li>اضافه کردن قابلیت‌های جدید</li>
                <li>بهبود رابط کاربری</li>
RECOMMENDATIONS_EOF
fi

cat >> productivity-comparison-report.html << 'HTML_END'
            </ul>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: #e9ecef; border-radius: 5px;">
            <h4>📞 دستورات مفید</h4>
            <pre style="background: white; padding: 10px; border-radius: 5px;">
# تست سلامت: ./test-prod-fixed.sh
# راه‌اندازی سرویس‌ها: ./start-all-services.sh
# مدیریت سرویس‌ها: ~/tetra-services-manager.sh status
            </pre>
        </div>
        
        <p style="margin-top: 30px; color: #666; text-align: center; font-size: 0.9rem;">
            سیستم مانیتورینگ TetraSaaS | آخرین بروزرسانی: $(date '+%Y/%m/%d %H:%M')
        </p>
    </div>
</body>
</html>
HTML_END

echo ""
echo "📄 گزارش HTML ایجاد شد: productivity-comparison-report.html"
echo "🌐 برای مشاهده:"
echo "   python3 -m http.server 8080"
echo "   سپس: http://localhost:8080/productivity-comparison-report.html"
echo ""
echo "✅ گزارش مقایسه ایجاد شد!"
