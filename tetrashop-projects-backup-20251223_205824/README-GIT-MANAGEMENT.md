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
