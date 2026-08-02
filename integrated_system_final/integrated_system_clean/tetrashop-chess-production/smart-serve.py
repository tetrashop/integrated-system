import http.server
import socketserver
import sys

def find_available_port(start_port=3000, max_attempts=10):
    import socket
    for port in range(start_port, start_port + max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except OSError:
            continue
    return None

PORT = find_available_port()

if PORT is None:
    print("❌ هیچ پورت آزادی پیدا نشد!")
    sys.exit(1)

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="./", **kwargs)
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

print(f"🎯 پلتفرم شطرنج تتراشاپ در حال اجرا روی پورت {PORT}")
print(f"🌐 آدرس دسترسی محلی: http://localhost:{PORT}")
print(f"📱 آدرس دسترسی از شبکه: http://[آیپی دستگاه]:{PORT}")
print("⚡ برای متوقف کردن: Ctrl + C")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n⏹️  سرور متوقف شد")
