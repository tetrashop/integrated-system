import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// سرویس فایل‌های استاتیک
app.use(express.static(path.join(__dirname)));

// هندل تمام routes برای SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎯 پلتفرم شطرنج تتراشاپ در حال اجرا روی پورت ${PORT}`);
    console.log(`🌐 آدرس دسترسی محلی: http://localhost:${PORT}`);
    console.log(`📱 آدرس دسترسی از موبایل: http://[آیپی ترمکس]:${PORT}`);
    console.log(`⚡ برای متوقف کردن: Ctrl + C`);
});
