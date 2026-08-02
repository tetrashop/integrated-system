#!/bin/bash

echo "📈 گزارش مقایسه بهره‌وری - نسخه اصلاح شده"
echo "========================================"

# تابع استخراج مقدار از JSON
extract_number() {
    local key="$1"
    local file="$2"
    
    if [ ! -f "$file" ]; then
        echo "0"
        return
    fi
    
    # استخراج آخرین occurrence از کلید
    local value=$(grep -o "\"$key\":[0-9]*" "$file" 2>/dev/null | tail -1 | cut -d: -f2)
    
    if [ -z "$value" ] || [ "$value" = "" ]; then
        echo "0"
    else
        echo "$value"
    fi
}

# یافتن فایل‌های نتایج
results_files=$(find . -name "productivity-*.json" -type f | sort -r | head -10)

if [ -z "$results_files" ]; then
    echo "❌ هیچ فایل نتیجه‌ای یافت نشد"
    exit 1
fi

echo "📊 تاریخچه نتایج:"
echo "-----------------"

total_health=0
total_response=0
total_score=0
count=0
best_score=0
worst_score=100
best_file=""
worst_file=""

for file in $results_files; do
    filename=$(basename "$file")
    date_part=$(echo "$filename" | grep -o '[0-9]\{8\}-[0-9]\{6\}' || echo "")
    
    if [ -n "$date_part" ]; then
        year=${date_part:0:4}
        month=${date_part:4:2}
        day=${date_part:6:2}
        hour=${date_part:9:2}
        minute=${date_part:11:2}
        
        human_date="$hour:$minute $day/$month"
        
        # استخراج مقادیر
        health=$(extract_number "health_percentage" "$file")
        response=$(extract_number "avg_response_time_ms" "$file")
        score=$(extract_number "productivity_score" "$file")
        
        # اطمینان از مقادیر عددی
        health=${health:-0}
        response=${response:-0}
        score=${score:-0}
        
        echo "🕒 $human_date | سلامت: ${health}% | پاسخ: ${response}ms | نمره: ${score}"
        
        # جمع‌آوری برای میانگین
        total_health=$((total_health + health))
        total_response=$((total_response + response))
        total_score=$((total_score + score))
        count=$((count + 1))
        
        # بهترین و بدترین
        if [ $score -gt $best_score ]; then
            best_score=$score
            best_file=$filename
        fi
        
        if [ $score -lt $worst_score ]; then
            worst_score=$score
            worst_file=$filename
        fi
    fi
done

if [ $count -gt 0 ]; then
    avg_health=$((total_health / count))
    avg_response=$((total_response / count))
    avg_score=$((total_score / count))
    
    echo ""
    echo "📈 آمار کلی ($count تست اخیر):"
    echo "  • میانگین سلامت: ${avg_health}%"
    echo "  • میانگین زمان پاسخ: ${avg_response}ms"
    echo "  • میانگین نمره: ${avg_score}/100"
    echo ""
    echo "🏆 بهترین عملکرد: ${best_score}/100 (${best_file})"
    echo "⚠️ بدترین عملکرد: ${worst_score}/100 (${worst_file})"
    echo "📈 پتانسیل بهبود: $((best_score - worst_score)) امتیاز"
fi

echo ""
echo "✅ گزارش با موفقیت ایجاد شد"
