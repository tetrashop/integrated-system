# راهنمای نصب و راه‌اندازی TetraSaaS Dashboard

## 📋 پیش‌نیازها
- Node.js 18 یا بالاتر
- npm یا yarn
- Gateway TetraSaaS (پورت 3000)

## 🚀 مراحل نصب

### 1. ایجاد پروژه
```bash
# رفتن به پوشه اصلی
cd /data/data/com.termux/files/home

# ایجاد پروژه با Vite
npx create-vite@latest tetrasaas-dashboard -- --template react-ts
cd tetrasaas-dashboard
