
## 6. **اسکریپت بازیابی از Backup (restore-backup.sh):**
```bash
#!/bin/bash

echo "🔄 سیستم بازیابی از Backup"
echo "=========================="

BACKUP_DIR="$HOME/git-backups"
PROJECT_DIR="/data/data/com.termux/files/home/tetrashop-projects"

cd "$PROJECT_DIR" || {
    echo "❌ خطا: دایرکتوری پروژه یافت نشد"
    exit 1
}

# نمایش backupهای موجود
echo "📁 Backupهای موجود:"
ls -la "$BACKUP_DIR"/*.txt 2>/dev/null | head -20

if [ $? -ne 0 ]; then
    echo "❌ هیچ backupی یافت نشد"
    exit 1
fi

echo ""
echo "🔧 انتخاب نوع بازیابی:"
echo "1. بازیابی وضعیت Git"
echo "2. بازیابی diff تغییرات"
echo "3. بازیابی تاریخچه commits"
echo "4. بازیابی فایل‌های تغییر یافته"
echo "5. بازیابی کامل از یک timestamp"
echo ""
read -p "انتخاب شما (1-5): " choice

case $choice in
    1)
        # بازیابی وضعیت Git
        LATEST_STATUS=$(ls -t "$BACKUP_DIR"/git-status-*.txt 2>/dev/null | head -1)
        if [ -n "$LATEST_STATUS" ]; then
            echo "📋 وضعیت Git backup شده:"
            cat "$LATEST_STATUS"
        fi
        ;;
    2)
        # بازیابی diff
        LATEST_DIFF=$(ls -t "$BACKUP_DIR"/git-diff-*.txt 2>/dev/null | head -1)
        if [ -n "$LATEST_DIFF" ]; then
            echo "📝 Diff تغییرات:"
            head -100 "$LATEST_DIFF"
            echo "..."
            echo "برای مشاهده کامل: less $LATEST_DIFF"
        fi
        ;;
    3)
        # بازیابی تاریخچه
        LATEST_LOG=$(ls -t "$BACKUP_DIR"/git-log-*.txt 2>/dev/null | head -1)
        if [ -n "$LATEST_LOG" ]; then
            echo "📜 تاریخچه commits:"
            cat "$LATEST_LOG"
        fi
        ;;
    4)
        # بازیابی فایل‌های تغییر یافته
        LATEST_FILES=$(ls -t "$BACKUP_DIR"/changed-files-*.txt 2>/dev/null | head -1)
        if [ -n "$LATEST_FILES" ]; then
            echo "📄 فایل‌های تغییر یافته:"
            cat "$LATEST_FILES"
        fi
        ;;
    5)
        # بازیابی کامل
        echo "🕒 انتخاب timestamp برای بازیابی:"
        TIMESTAMPS=$(ls "$BACKUP_DIR"/git-status-*.txt 2>/dev/null | grep -o '[0-9]\{8\}_[0-9]\{6\}' | sort -r)
        select ts in $TIMESTAMPS; do
            if [ -n "$ts" ]; then
                echo "🔁 بازیابی از $ts..."
                
                # نمایش اطلاعات
                echo "📋 وضعیت:"
                cat "$BACKUP_DIR/git-status-$ts.txt" 2>/dev/null
                echo ""
                
                echo "📝 Diff:"
                head -50 "$BACKUP_DIR/git-diff-$ts.txt" 2>/dev/null
                echo "..."
                echo ""
                
                echo "📜 Commits:"
                cat "$BACKUP_DIR/git-log-$ts.txt" 2>/dev/null
                echo ""
                
                echo "📄 فایل‌ها:"
                cat "$BACKUP_DIR/changed-files-$ts.txt" 2>/dev/null
                
                break
            fi
        done
        ;;
    *)
        echo "❌ انتخاب نامعتبر"
        exit 1
        ;;
esac

echo ""
echo "✅ عملیات بازیابی کامل شد"
