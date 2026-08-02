#!/bin/bash
echo "🔗 لینک‌های سریع Tetrashop100:"
echo "🌐 سایت: https://tetrashop-projects-alpha.vercel.app"
echo "🩺 سلامت: https://tetrashop-projects-alpha.vercel.app/api/health"
echo "🛒 محصولات: https://tetrashop-projects-alpha.vercel.app/api/products"
echo "👥 کاربران: https://tetrashop-projects-alpha.vercel.app/api/users"

# تست سریع
echo -e "\n🧪 تست سریع سلامت:"
curl -s https://tetrashop-projects-alpha.vercel.app/api/health | jq '.status'
