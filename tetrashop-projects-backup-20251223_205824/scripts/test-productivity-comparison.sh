#!/bin/bash

echo "📊 تست مقایسه‌ای بهره‌وری TetraSaaS"
echo "===================================="
echo "تاریخ تست: $(date)"
echo ""

# 1. بررسی سلامت کلی سرویس‌ها
echo "🔍 بررسی سلامت ۲۳ سرویس..."
echo ""

declare -A SERVICES=(
    ["quantum-writer"]="3001"
    ["ai-writer"]="3002"
    ["secret-garden"]="3003"
    ["3d-converter"]="3004"
    ["2d-to-3d"]="3005"
    ["content-analyzer"]="3006"
    ["anti-fragmentation"]="3007"
    ["formula-solver"]="3008"
    ["code-cleaner"]="3009"
    ["graphic-2d"]="3010"
    ["anti-smoke"]="3011"
    ["telescope-design"]="3012"
    ["teleport-system"]="3013"
    ["image-processor"]="3014"
    ["audio-converter"]="3015"
    ["video-editor"]="3016"
    ["data-encryptor"]="3017"
    ["network-scanner"]="3018"
    ["battery-optimizer"]="3019"
    ["file-organizer"]="3020"
    ["password-generator"]="3021"
    ["system-monitor"]="3022"
    ["backup-manager"]="3023"
)

TODAY_RESULTS="productivity-$(date +%Y%m%d).json"
YESTERDAY_RESULTS="productivity-$(date -d "yesterday" +%Y%m%d).json"

# داده‌های امروز
today_data='{"date":"'$(date -Iseconds)'","services":[],"stats":{"total":23,"healthy":0,"avg_response_time":0}}'

# تست هر سرویس
total_response_time=0
healthy_count=0
service_count=0

for name in "${!SERVICES[@]}"; do
    port="${SERVICES[$name]}"
    echo -n "  $name ($port): "
    
    # تست زمان پاسخ
    start_time=$(date +%s%3N)
    if timeout 3 curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
        end_time=$(date +%s%3N)
        response_time=$((end_time - start_time))
        
        if [ $response_time -lt 3000 ]; then
            echo "✅ ${response_time}ms"
            healthy_count=$((healthy_count + 1))
            total_response_time=$((total_response_time + response_time))
        else
            echo "⚠️ ${response_time}ms (کند)"
        fi
    else
        echo "❌ غیرفعال"
    fi
    
    service_count=$((service_count + 1))
    sleep 0.1
done

# محاسبات
avg_response_time=0
if [ $healthy_count -gt 0 ]; then
    avg_response_time=$((total_response_time / healthy_count))
fi

health_percentage=$((healthy_count * 100 / 23))

# ذخیره نتایج امروز
cat > "$TODAY_RESULTS" << JSON_EOF
{
    "test_date": "$(date -Iseconds)",
    "period": "today",
    "stats": {
        "total_services": 23,
        "healthy_services": $healthy_count,
        "health_percentage": $health_percentage,
        "avg_response_time_ms": $avg_response_time,
        "total_response_time_ms": $total_response_time
    },
    "productivity_score": $(( (health_percentage * 60 / 100) + ( (200 - avg_response_time) * 40 / 100 ) )),
    "services_health": $health_percentage,
    "performance_grade": "$($(get_grade $health_percentage $avg_response_time)"
}
JSON_EOF

# تابع تعیین رتبه
get_grade() {
    local health=$1
    local response=$2
    
    if [ $health -ge 90 ] && [ $response -lt 100 ]; then
        echo "A+ 🏆"
    elif [ $health -ge 80 ] && [ $response -lt 150 ]; then
        echo "A ✅"
    elif [ $health -ge 70 ] && [ $response -lt 200 ]; then
        echo "B+ ⭐"
    elif [ $health -ge 60 ] && [ $response -lt 300 ]; then
        echo "B 👍"
    elif [ $health -ge 50 ] && [ $response -lt 500 ]; then
        echo "C ⚠️"
    elif [ $health -ge 30 ] && [ $response -lt 1000 ]; then
        echo "D 🔧"
    else
        echo "F 🚨"
    fi
}

# مقایسه با دیروز (اگر فایل وجود داشته باشد)
comparison_text=""
if [ -f "$YESTERDAY_RESULTS" ]; then
    echo ""
    echo "📈 مقایسه با دیروز:"
    echo "------------------"
    
    # خواندن داده‌های دیروز
    yesterday_health=$(jq '.stats.health_percentage' "$YESTERDAY_RESULTS" 2>/dev/null || echo "0")
    yesterday_response=$(jq '.stats.avg_response_time_ms' "$YESTERDAY_RESULTS" 2>/dev/null || echo "0")
    yesterday_score=$(jq '.productivity_score' "$YESTERDAY_RESULTS" 2>/dev/null || echo "0")
    
    # محاسبه تغییرات
    health_change=$((health_percentage - yesterday_health))
    response_change=$((yesterday_response - avg_response_time))  # مثبت یعنی بهبود
    score_change=$((productivity_score - yesterday_score))
    
    echo "  سلامت سرویس‌ها:"
    echo "    دیروز: ${yesterday_health}%"
    echo "    امروز: ${health_percentage}%"
    echo "    تغییر: $health_change% $(get_arrow $health_change)"
    
    echo ""
    echo "  زمان پاسخ متوسط:"
    echo "    دیروز: ${yesterday_response}ms"
    echo "    امروز: ${avg_response_time}ms"
    echo "    تغییر: $response_changems $(get_arrow $response_change)"
    
    echo ""
    echo "  نمره بهره‌وری:"
    echo "    دیروز: ${yesterday_score}/100"
    echo "    امروز: ${productivity_score}/100"
    echo "    تغییر: $score_change امتیاز $(get_arrow $score_change)"
    
    comparison_text=" (تغییر: $score_change امتیاز)"
else
    echo ""
    echo "⚠️ داده‌ی دیروز یافت نشد. اولین تست ثبت شد."
fi

# نمایش نتایج
echo ""
echo "📊 نتایج تست امروز:"
echo "=================="
echo "تاریخ: $(date '+%Y/%m/%d %H:%M')"
echo ""
echo "📈 آمار کلی:"
echo "  تعداد سرویس‌ها: ۲۳"
echo "  سرویس‌های سالم: $healthy_count"
echo "  درصد سلامت: ${health_percentage}%"
echo "  زمان پاسخ متوسط: ${avg_response_time}ms"
echo ""
echo "🎯 نمره بهره‌وری: $productivity_score/100"

# تعیین وضعیت
if [ $health_percentage -ge 90 ]; then
    echo "🏆 وضعیت: عالی"
elif [ $health_percentage -ge 75 ]; then
    echo "✅ وضعیت: خوب"
elif [ $health_percentage -ge 60 ]; then
    echo "⚠️ وضعیت: متوسط"
elif [ $health_percentage -ge 40 ]; then
    echo "🔧 وضعیت: نیاز به بهبود"
else
    echo "🚨 وضعیت: بحرانی"
fi

# پیشنهادات
echo ""
echo "💡 پیشنهادات:"
if [ $health_percentage -lt 50 ]; then
    echo "  • راه‌اندازی سرویس‌های غیرفعال"
    echo "  • بررسی پورت‌های ۳۰۰۱-۳۰۲۳"
    echo "  • اجرای اسکریپت start-all-services.sh"
elif [ $avg_response_time -gt 500 ]; then
    echo "  • بهینه‌سازی زمان پاسخ"
    echo "  • بررسی مصرف منابع"
    echo "  • کش‌گذاری نتایج"
fi

echo ""
echo "📁 نتایج ذخیره شد در: $TODAY_RESULTS"

# تابع نمایش فلش
get_arrow() {
    if [ $1 -gt 0 ]; then
        echo "📈"
    elif [ $1 -lt 0 ]; then
        echo "📉"
    else
        echo "➡️"
    fi
}

# محاسبه productivity_score
productivity_score=$(calculate_score $health_percentage $avg_response_time)
if [ $productivity_score -gt 100 ]; then
    productivity_score=100
elif [ $productivity_score -lt 0 ]; then
    productivity_score=0
fi

# تابع تعیین رتبه
get_grade() {
    local health=$1
    local response=$2
    
    if [ $health -ge 90 ] && [ $response -lt 100 ]; then
        echo "A+ 🏆"
    elif [ $health -ge 80 ] && [ $response -lt 150 ]; then
        echo "A ✅"
    elif [ $health -ge 70 ] && [ $response -lt 200 ]; then
        echo "B+ ⭐"
    elif [ $health -ge 60 ] && [ $response -lt 300 ]; then
        echo "B 👍"
    elif [ $health -ge 50 ] && [ $response -lt 500 ]; then
        echo "C ⚠️"
    elif [ $health -ge 30 ] && [ $response -lt 1000 ]; then
        echo "D 🔧"
    else
        echo "F 🚨"
    fi
}

# تابع نمایش فلش
get_arrow() {
    if [ $1 -gt 0 ]; then
        echo "📈"
    elif [ $1 -lt 0 ]; then
        echo "📉"
    else
        echo "➡️"
    fi
}

# محاسبه productivity_score
calculate_score() {
    local health=$1
    local response=$2
    local score=$(( (health * 60 / 100) + ( (200 - response) * 40 / 100 ) ))
    
    if [ $score -gt 100 ]; then
        score=100
    elif [ $score -lt 0 ]; then
        score=0
    fi
    echo $score
}
