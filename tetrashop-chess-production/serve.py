import http.server
import socketserver
import os

PORT = 8080

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()
    
    def log_message(self, format, *args):
        # غیرفعال کردن لاگ‌های پیش‌فرض
        pass

print("🎯" * 50)
print("🚀 پلتفرم شطرنج تتراشاپ راه‌اندازی شد!")
print(f"📍 پورت: {PORT}")
print(f"🌐 آدرس دسترسی محلی: http://localhost:{PORT}")
print("📱 برای دسترسی از موبایل/کامپیوتر دیگر:")
print("   1. آیپی ترمکس را پیدا کن: hostname -I")
print("   2. در مرورگر وارد کن: http://[آیپی]:8080")
print("⚡ برای متوقف کردن: Ctrl + C")
print("🎯" * 50)

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n🛑 سرور متوقف شد")
except Exception as e:
    print(f"❌ خطا: {e}")
    print("💡 پورت 8080 هم occupied است. پورت دیگری امتحان کن...")
