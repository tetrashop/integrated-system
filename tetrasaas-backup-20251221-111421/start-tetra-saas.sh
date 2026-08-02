#!/bin/bash

echo "🚀 راه‌اندازی پلتفرم TetraSaaS..."
echo "================================"

# توقف سرویس‌های قبلی
echo "🛑 توقف سرویس‌های قبلی..."
pkill -f "node server.js" 2>/dev/null
pkill -f "python app.py" 2>/dev/null
pkill -f "python3 app.py" 2>/dev/null
sleep 3

# بررسی پورت‌های آزاد
echo "🔍 بررسی پورت‌ها..."
check_port() {
    port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  پورت $port در حال استفاده است"
        return 1
    else
        echo "✅ پورت $port آزاد است"
        return 0
    fi
}

# بررسی پورت‌های اصلی
check_port 8080  # API Gateway
check_port 3000  # Dashboard
check_port 3001  # Quantum Writer
check_port 3008  # Formula Solver
check_port 3009  # Content Analyzer
check_port 3010  # 3D Converter

# ایجاد فایل‌های ضروری
echo "📁 ایجاد ساختار پلتفرم..."
cd /data/data/com.termux/files/home/tetrashop-projects

# اگر پوشه وجود ندارد، ایجاد کن
if [ ! -d "tetra-saas-platform" ]; then
    echo "❌ پوشه tetra-saas-platform یافت نشد!"
    echo "ابتدا ساختار پروژه را ایجاد کنید."
    exit 1
fi

# نصب وابستگی‌های API Gateway
echo "📦 نصب وابستگی‌های API Gateway..."
cd tetra-saas-platform/api-gateway

if [ ! -d "node_modules" ]; then
    npm install --silent
    if [ $? -ne 0 ]; then
        echo "❌ خطا در نصب وابستگی‌های Node.js"
        echo "مطمئن شوید Node.js نصب است: pkg install nodejs"
        exit 1
    fi
fi

# نصب وابستگی‌های پایتون برای میکروسرویس‌ها
echo "🐍 نصب وابستگی‌های پایتون..."

install_python_deps() {
    service_dir=$1
    if [ -f "$service_dir/requirements.txt" ]; then
        echo "   نصب وابستگی‌های $service_dir..."
        cd "$service_dir"
        pip install -r requirements.txt --quiet
        cd - > /dev/null
    fi
}

# نصب وابستگی‌های سرویس‌های نمونه
install_python_deps "../microservices/formula-solver"
install_python_deps "../microservices/content-analyzer"
install_python_deps "../microservices/3d-converter"

# راه‌اندازی میکروسرویس‌ها
echo "🔧 راه‌اندازی میکروسرویس‌ها..."

start_microservice() {
    service_name=$1
    service_port=$2
    service_dir=$3
    
    echo "   راه‌اندازی $service_name روی پورت $service_port..."
    cd "$service_dir"
    
    # بررسی آیا سرویس در حال اجراست
    if lsof -Pi :$service_port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "   ⚠️  $service_name از قبل در حال اجراست"
    else
        python app.py &
        SERVICE_PID=$!
        echo $SERVICE_PID > "/tmp/tetra_${service_name}.pid"
        sleep 2
        
        # بررسی سلامت سرویس
        if curl -s "http://localhost:$service_port/health" >/dev/null 2>&1; then
            echo "   ✅ $service_name راه‌اندازی شد (PID: $SERVICE_PID)"
        else
            echo "   ❌ $service_name راه‌اندازی نشد"
        fi
    fi
    
    cd - > /dev/null
}

# راه‌اندازی سرویس‌های نمونه
start_microservice "formula-solver" 3008 "../microservices/formula-solver"
start_microservice "content-analyzer" 3009 "../microservices/content-analyzer"
start_microservice "3d-converter" 3010 "../microservices/3d-converter"

# راه‌اندازی API Gateway
echo "🌉 راه‌اندازی API Gateway..."
cd ../api-gateway

if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "   ⚠️  API Gateway از قبل در حال اجراست"
else
    node server.js &
    GATEWAY_PID=$!
    echo $GATEWAY_PID > "/tmp/tetra_gateway.pid"
    sleep 3
    
    if curl -s "http://localhost:8080/health" >/dev/null 2>&1; then
        echo "   ✅ API Gateway راه‌اندازی شد (PID: $GATEWAY_PID)"
    else
        echo "   ❌ API Gateway راه‌اندازی نشد"
    fi
fi

# نمایش اطلاعات
echo ""
echo "=========================================="
echo "🎉 پلتفرم TetraSaaS با موفقیت راه‌اندازی شد!"
echo "=========================================="
echo ""
echo "📡 آدرس‌های دسترسی:"
echo "   • API Gateway:      http://localhost:8080"
echo "   • فرمول‌ساز:        http://localhost:3008"
echo "   • تحلیلگر محتوا:   http://localhost:3009"
echo "   • مبدل 3D:          http://localhost:3010"
echo ""
echo "🔑 احراز هویت:"
echo "   POST http://localhost:8080/auth/login"
echo "   { \"username\": \"admin\", \"password\": \"admin123\" }"
echo ""
echo "🧪 تست سلامت:"
echo "   curl http://localhost:8080/health"
echo ""
echo "⚡ تست سرویس حل انتگرال:"
echo "   curl -X POST http://localhost:8080/api/formula-solver/solve/integral \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"expression\": \"x**2 + sin(x)\", \"variable\": \"x\"}'"
echo ""
echo "🛑 برای توقف پلتфорم:"
echo "   ./stop-tetra-saas.sh"
echo ""
echo "📊 لاگ‌ها:"
echo "   API Gateway:     tail -f /data/data/com.termux/files/home/tetrashop-projects/tetra-saas-platform/api-gateway/server.log"
echo ""

# نگه داشتن ترمینال فعال
wait
