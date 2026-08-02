import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const PORT = 3000;
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const server = createServer(async (req, res) => {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = join(__dirname, filePath);
    
    try {
        const content = await readFile(filePath);
        const ext = extname(filePath);
        const contentType = MIME_TYPES[ext] || 'text/plain';
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // برای SPA، همه routes به index.html بروند
            const indexContent = await readFile(join(__dirname, 'index.html'));
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(indexContent);
        } else {
            res.writeHead(500);
            res.end('خطای سرور');
        }
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🎯 پلتفرم شطرنج تتراشاپ در حال اجرا روی پورت ${PORT}`);
    console.log(`🌐 آدرس دسترسی: http://localhost:${PORT}`);
    console.log(`📱 آدرس شبکه: http://[آیپی دستگاه]:${PORT}`);
    console.log(`⚡ برای متوقف کردن: Ctrl + C`);
});
