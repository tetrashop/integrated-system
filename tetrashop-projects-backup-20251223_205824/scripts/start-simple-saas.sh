#!/bin/bash
echo "راه‌اندازی ساده پلتفرم SaaS"

# توقف سرویس‌های قبلی
pkill -f "python app.py" 2>/dev/null
pkill -f "node server.js" 2>/dev/null

# راه‌اندازی میکروسرویس‌های نمونه
cd tetra-saas-platform/microservices/formula-solver
python app.py &
echo "سرویس حل فرمول راه‌اندازی شد"

# راه‌اندازی API Gateway
cd ../../api-gateway
npm install express 2>/dev/null
node server.js &
echo "API Gateway راه‌اندازی شد"

echo "پلتفرم آماده است: http://localhost:8080"
