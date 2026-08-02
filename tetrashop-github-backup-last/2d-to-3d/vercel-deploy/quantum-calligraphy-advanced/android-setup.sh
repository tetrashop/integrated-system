#!/bin/bash
echo "📱 راه‌اندازی تتراشاپ در اندروید"
echo "================================"

# رنگ‌ها
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 بررسی پیش‌نیازها...${NC}"

# بررسی Python
if command -v python3 &> /dev/null; then
    echo -e "${GREEN}✅ Python 3 نصب شده${NC}"
else
    echo "📥 نصب Python3..."
    pkg install python -y
fi

# بررسی Git
if command -v git &> /dev/null; then
    echo -e "${GREEN}✅ Git نصب شده${NC}"
else
    echo "📥 نصب Git..."
    pkg install git -y
fi

echo -e "${BLUE}📥 دریافت پروژه از GitHub...${NC}"
cd ~
if [ -d "tetrashop-projects" ]; then
    echo "📁 پروژه از قبل وجود دارد. به روزرسانی..."
    cd tetrashop-projects
    git pull
else
    echo "📦 کلون کردن پروژه جدید..."
    git clone https://github.com/tetrashop/tetrashop-projects.git
    cd tetrashop-projects
fi

echo -e "${GREEN}🎉 پروژه آماده است!${NC}"
echo ""
echo "📂 مسیر پروژه: ~/tetrashop-projects"
echo ""
echo "🚀 پروژه‌های قابل اجرا:"
echo "  🧠 cd quantum-calligraphy-advanced && python3 quantum_nlp_fixed.py"
echo "  💪 cd common-rhetoric-pro && g++ -std=c++11 powerful_rhetoric_fixed.cpp -o rhetoric && ./rhetoric"
echo "  🔐 cd aman-secret-cluster && python3 cluster_manager_fixed.py"
echo "  ♟️ cd chess-deepmind && g++ -std=c++11 stockfish_deep_learning_engine.cpp -o chess && ./chess"
echo ""
echo "📚 برای راهنمایی بیشتر: cat ANDROID_SETUP_GUIDE.md"
