#!/bin/bash

echo "🔧 رفع خطاهای اسکریپت تست"
echo "========================"

# 1. رفع اسکریپت test-productivity-comparison.sh
sed -i 's/get_grade $(get_grade/echo " $(get_grade/' test-productivity-comparison.sh
sed -i 's/get_grade \$health_percentage \$avg_response_time)/$(get_grade $health_percentage $avg_response_time)/' test-productivity-comparison.sh

# 2. اضافه کردن توابع از دست رفته
cat >> test-productivity-comparison.sh << 'FUNCTIONS_EOF'

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
FUNCTIONS_EOF

# 3. جایگزینی محاسبه score
sed -i 's/productivity_score=\$(( (health_percentage \* 60 \/ 100) + ( (200 - avg_response_time) \* 40 \/ 100 ) ))/productivity_score=$(calculate_score $health_percentage $avg_response_time)/' test-productivity-comparison.sh

# 4. رفع خطای jq (اگر نصب نیست)
if ! command -v jq &> /dev/null; then
    echo "📦 نصب jq..."
    pkg install -y jq 2>/dev/null || {
        echo "⚠️ نصب jq ناموفق بود. استفاده از جایگزین..."
        # ایجاد تابع جایگزین برای jq
        cat >> test-productivity-comparison.sh << 'JQ_EOF'
# تابع جایگزین jq
simple_jq() {
    local key=$1
    local file=$2
    
    if [ ! -f "$file" ]; then
        echo "0"
        return
    fi
    
    case $key in
        ".stats.health_percentage")
            grep -o '"health_percentage":[0-9]*' "$file" | cut -d: -f2 | head -1 || echo "0"
            ;;
        ".stats.avg_response_time_ms")
            grep -o '"avg_response_time_ms":[0-9]*' "$file" | cut -d: -f2 | head -1 || echo "0"
            ;;
        ".productivity_score")
            grep -o '"productivity_score":[0-9]*' "$file" | cut -d: -f2 | head -1 || echo "0"
            ;;
        *)
            echo "0"
            ;;
    esac
}
JQ_EOF
    
    # جایگزینی jq با simple_jq
    sed -i 's/jq .stats.health_percentage "$YESTERDAY_RESULTS" 2>\/dev\/null || echo "0"/simple_jq ".stats.health_percentage" "$YESTERDAY_RESULTS"/' test-productivity-comparison.sh
    sed -i 's/jq .stats.avg_response_time_ms "$YESTERDAY_RESULTS" 2>\/dev\/null || echo "0"/simple_jq ".stats.avg_response_time_ms" "$YESTERDAY_RESULTS"/' test-productivity-comparison.sh
    sed -i 's/jq .productivity_score "$YESTERDAY_RESULTS" 2>\/dev\/null || echo "0"/simple_jq ".productivity_score" "$YESTERDAY_RESULTS"/' test-productivity-comparison.sh
fi

echo "✅ اسکریپت تست رفع خطا شد"
echo ""
echo "🚀 تست مجدد:"
echo "  ./test-productivity-comparison.sh"
