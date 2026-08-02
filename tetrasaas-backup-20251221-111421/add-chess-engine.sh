#!/bin/bash

# =========================================
# 🚀 اسکریپت سریع و ایمن اضافه کردن موتور شطرنج C++
# =========================================

set -e  # در صورت خطا، اسکریپت متوقف شود

echo "♟️ شروع اضافه کردن موتور شطرنج C++..."
echo "===================================="

# تنظیم مسیرها
PROJECT_ROOT="/data/data/com.termux/files/home/tetrashop-projects"
CHESS_ENGINE_DIR="$PROJECT_ROOT/projects/chess-engine-cpp"
BACKUP_DIR="$PROJECT_ROOT/backup_$(date +%Y%m%d_%H%M%S)"

# ۱. بررسی وجود پوشه پروژه
if [ ! -d "$PROJECT_ROOT" ]; then
    echo "❌ پوشه پروژه یافت نشد: $PROJECT_ROOT"
    exit 1
fi

cd "$PROJECT_ROOT"

# ۲. پشتیبان‌گیری از وضعیت فعلی
echo "💾 در حال ایجاد پشتیبان..."
mkdir -p "$BACKUP_DIR"
if [ -d "projects/chess-engine-cpp" ]; then
    cp -r projects/chess-engine-cpp "$BACKUP_DIR/" 2>/dev/null || true
fi
git status > "$BACKUP_DIR/git_status_before.txt" 2>/dev/null || true
echo "✅ پشتیبان در $BACKUP_DIR ذخیره شد"

# ۳. ایجاد پوشه مقصد
echo "📁 ایجاد ساختار پوشه..."
mkdir -p "$CHESS_ENGINE_DIR"
cd "$CHESS_ENGINE_DIR"

# ۴. دانلود مخزن موتور شطرنج (بدون تاریخچه Git برای سادگی)
echo "📥 در حال دریافت موتور شطرنج C++..."
if command -v wget >/dev/null 2>&1; then
    # روش ۱: دانلود به صورت zip
    wget -q https://github.com/tetrashop/ChessEngine/archive/main.zip -O chess.zip
    unzip -q chess.zip 2>/dev/null || echo "⚠️ unzip ممکن است نیاز به نصب داشته باشد"
    rm -f chess.zip
    if [ -d "ChessEngine-main" ]; then
        mv ChessEngine-main/* .
        rm -rf ChessEngine-main
    fi
elif command -v git >/dev/null 2>&1; then
    # روش ۲: Clone بدون تاریخچه (سطحی)
    git clone --depth 1 https://github.com/tetrashop/ChessEngine.git .
    rm -rf .git  # حذف اطلاعات git برای جلوگیری از تداخل
else
    echo "❌ wget یا git یافت نشد"
    echo "📦 لطفاً نصب کنید: pkg install wget unzip git"
    exit 1
fi

# ۵. ایجاد فایل‌های پیکربندی ضروری
echo "⚙️ ایجاد فایل‌های پیکربندی..."

# ایجاد Makefile ساده
cat > Makefile << 'MAKEFILE'
# Makefile ساده برای موتور شطرنج
CXX = g++
CXXFLAGS = -std=c++11 -O2 -Wall
TARGET = chess-engine

SRC_FILES = $(wildcard *.cpp)
OBJ_FILES = $(SRC_FILES:.cpp=.o)

all: $(TARGET)

$(TARGET): $(OBJ_FILES)
$(CXX) $(CXXFLAGS) -o $@ $^

%.o: %.cpp
$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
rm -f *.o $(TARGET)

run: $(TARGET)
./$(TARGET)

test: $(TARGET)
./$(TARGET) --test

.PHONY: all clean run test
MAKEFILE

# ایجاد README فارسی
cat > README.fa.md << 'MD'
# ♟️ موتور شطرنج C++ - TetraChess

## ویژگی‌ها
- هوش مصنوعی با الگوریتم Minimax/Alpha-Beta
- ارزیابی موقعیت پیشرفته
- پشتیبانی از استاندارد UCI
- سرعت بالا و بهینه

## کامپایل
```bash
make
EOF
