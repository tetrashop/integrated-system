#!/bin/bash
# 🎯 اسکریپت نصب کامل موتور شطرنج C++

echo "♟️ نصب کامل موتور شطرنج C++"
echo "==========================="

# ۱. پاکسازی
cd /data/data/com.termux/files/home/tetrashop-projects
echo "🧹 پاکسازی قدیمی..."
rm -rf projects/chess-engine-cpp
rm -f .gitmodules

# ۲. دانلود
echo "📥 دانلود موتور شطرنج..."
git clone --depth 1 https://github.com/tetrashop/ChessEngine.git projects/chess-engine-cpp
rm -rf projects/chess-engine-cpp/.git

# ۳. بررسی
cd projects/chess-engine-cpp
echo "📊 محتویات:"
ls -la
echo ""
echo "📝 فایل‌های C++:"
find . -name "*.cpp" -o -name "*.h" | head -10

# ۴. ایجاد README
cat > README.md << 'README'
# TetraChess Engine
موتور شطرنج C++ از TetraShop

## کامپایل
```bash
make
