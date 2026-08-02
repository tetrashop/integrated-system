#!/bin/bash
# 🚀 اسکریپت تصحیح کامل موتور شطرنج C++

set -e

echo "🔧 شروع تصحیح موتور شطرنج C++..."
echo "================================"

cd /data/data/com.termux/files/home/tetrashop-projects

# ۱. حذف submodule اشتباه
echo "🗑️ حذف submodule موجود..."
if [ -f ".gitmodules" ]; then
    git submodule deinit -f projects/chess-engine-cpp 2>/dev/null || true
    git rm -f projects/chess-engine-cpp 2>/dev/null || true
    rm -rf .git/modules/projects/chess-engine-cpp 2>/dev/null || true
    rm -f .gitmodules
fi

# ۲. حذف پوشه قدیمی
echo "📁 حذف پوشه قدیمی..."
rm -rf projects/chess-engine-cpp

# ۳. ایجاد پوشه جدید
echo "📂 ایجاد پوشه جدید..."
mkdir -p projects/chess-engine-cpp
cd projects/chess-engine-cpp

# ۴. دانلود واقعی مخزن شطرنج
echo "📥 دانلود مخزن موتور شطرنج..."
if command -v git >/dev/null 2>&1; then
    git clone --depth 1 https://github.com/tetrashop/ChessEngine.git .
    # حذف .git داخلی
    rm -rf .git
else
    # روش جایگزین با wget
    wget -q https://github.com/tetrashop/ChessEngine/archive/main.zip
    unzip -q main.zip
    rm main.zip
    mv ChessEngine-main/* .
    rm -rf ChessEngine-main
fi

# ۵. بررسی فایل‌ها
echo "📊 بررسی فایل‌های دریافتی..."
echo "تعداد فایل‌های C++: $(find . -name "*.cpp" -o -name "*.h" | wc -l)"
ls -la

# ۶. ایجاد Makefile اگر وجود ندارد
if [ ! -f "Makefile" ]; then
    echo "⚙️ ایجاد Makefile..."
    cat > Makefile << 'MAKEFILE'
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

.PHONY: all clean run
MAKEFILE
fi

# ۷. برگشت به ریشه و اضافه کردن به git
cd /data/data/com.termux/files/home/tetrashop-projects
echo "📤 اضافه کردن به Git..."
git add projects/chess-engine-cpp/

# ۸. کامیت
echo "💾 کامیت تغییرات..."
git commit -m "🔧 تصحیح موتور شطرنج C++ - اضافه کردن فایل‌های واقعی

• حذف submodule اشتباه
• اضافه کردن فایل‌های واقعی موتور شطرنج
• ساختار کامل C++ با Makefile
• آماده برای کامپایل و اجرا"

echo ""
echo "✅ تصحیح کامل شد!"
echo ""
echo "🛠️ دستورات کامپایل:"
echo "   cd projects/chess-engine-cpp"
echo "   make"
echo ""
echo "🚀 دستورات push:"
echo "   git push origin main"
echo ""
echo "📊 وضعیت فعلی:"
git status --short
