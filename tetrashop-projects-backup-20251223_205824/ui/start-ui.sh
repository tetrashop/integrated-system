#!/bin/bash

echo "🚀 راه‌اندازی واسط کاربری TetraSaaS"
echo "=================================="

# بررسی وجود node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js یافت نشد. لطفا نصب کنید:"
    echo "   pkg install nodejs"
    exit 1
fi

# نصب وابستگی‌ها
echo "📦 بررسی وابستگی‌ها..."
cd /data/data/com.termux/files/home/tetrashop-projects/ui

# ایجاد فایل package.json برای UI
cat > package.json << 'UI_PACKAGE_EOF'
{
  "name": "tetrasaas-ui",
  "version": "1.0.0",
  "description": "Dashboard UI for TetraSaaS",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
UI_PACKAGE_EOF

# نصب وابستگی‌ها
npm install express cors --silent

# ایجاد سرور ساده
cat > server.js << 'SERVER_EOF'
const express = require('express');
const path = require('path');
const app = express();

// سرویس فایل‌های استاتیک
app.use(express.static(path.join(__dirname)));

// Route اصلی
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API برای سرویس‌ها
app.get('/api/services', (req, res) => {
    res.json({
        success: true,
        count: 23,
        services: [
            "quantum-writer", "ai-writer", "secret-garden", "3d-converter", "2d-to-3d",
            "content-analyzer", "anti-fragmentation", "formula-solver", "code-cleaner",
            "graphic-2d", "anti-smoke", "telescope-design", "teleport-system",
            "image-processor", "audio-converter", "video-editor", "data-encryptor",
            "network-scanner", "battery-optimizer", "file-organizer",
            "password-generator", "system-monitor", "backup-manager"
        ]
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: 23,
        uptime: process.uptime()
    });
});

// پورت
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 TetraSaaS UI running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/index.html`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
});
SERVER_EOF

# شروع سرور
echo "✅ واسط کاربری آماده است!"
echo ""
echo "🌐 برای مشاهده:"
echo "   1. سرور را اجرا کنید: node server.js"
echo "   2. مرورگر خود را باز کنید: http://localhost:3000"
echo ""
echo "📱 روی Termux:"
echo "   • مرورگر: http://localhost:3000"
echo "   • یا: termux-open-url http://localhost:3000"
echo ""
echo "⚡ دستور سریع:"
echo "   cd /data/data/com.termux/files/home/tetrashop-projects/ui"
echo "   node server.js"
