# Gateway API Tetrashop

## راه‌اندازی سریع

1. نصب وابستگی‌ها:
\`\`\`bash
npm install
\`\`\`

2. اجرای سرور:
\`\`\`bash
node core/gateway/server.js
# یا
./scripts/start.sh
\`\`\`

## Endpoint‌ها

- \`GET /\` - صفحه اصلی
- \`GET /health\` - سلامت سرویس
- \`GET /api/services\` - لیست سرویس‌ها
- \`GET /api/stats\` - آمار سرویس‌ها

## توسعه

برای اضافه کردن سرویس جدید، فایل \`core/gateway/server.js\` را ویرایش کنید.
