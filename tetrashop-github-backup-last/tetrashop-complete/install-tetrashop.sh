#!/bin/bash
# 📦 اسکریپت نصب تتراشاپ

echo "🚀 نصب سیستم تتراشاپ"
echo "====================="

# بررسی وابستگی‌ها
echo "🔍 بررسی وابستگی‌های سیستم..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 یافت نشد. لطفا نصب کنید."
    exit 1
fi

if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 یافت نشد. لطفا نصب کنید."
    exit 1
fi

echo "✅ وابستگی‌ها بررسی شدند."

# نصب پکیج‌های پایتون
echo "📦 نصب پکیج‌های مورد نیاز..."
pip3 install numpy pillow cryptography SpeechRecognition

# ایجاد فایل requirements
cat > requirements.txt << 'REQEOF'
numpy>=1.21.0
Pillow>=8.3.0
cryptography>=3.4.0
SpeechRecognition>=3.8.0
REQEOF

pip3 install -r requirements.txt

# تنظیم مجوزهای اجرا
echo "🔧 تنظیم مجوزهای اجرا..."
chmod +x *.sh
chmod +x */*.py

# ایجاد فایل پیکربندی
cat > tetrashop-config.yaml << 'CONFIGEOF'
# پیکربندی سیستم تتراشاپ
version: "2.0.0"
components:
  nlp:
    enabled: true
    algorithms: 219
  quantum:
    enabled: true
    version: "1.0.0"
  secret:
    enabled: true
    security_level: "high"
  speech:
    enabled: true
    realtime: true

logging:
  level: "INFO"
  file: "tetrashop.log"

paths:
  data: "./data"
  models: "./models"
  outputs: "./outputs"
CONFIGEOF

echo "🎉 نصب تتراشاپ با موفقیت انجام شد!"
echo ""
echo "📋 راهنمای استفاده:"
echo "   ./run-nlp.sh         # اجرای الگوریتم‌های NLP"
echo "   ./run-quantum.sh     # اجرای Quantum Writer"
echo "   ./run-secret.sh      # اجرای Secret Garden"
echo "   ./run-speech.sh      # اجرای Speech Recognition"
echo "   ./run-all.sh         # اجرای تمام سیستم"
echo ""
echo "📖 مستندات: README.md"

