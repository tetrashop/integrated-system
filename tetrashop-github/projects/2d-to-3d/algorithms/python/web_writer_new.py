"""
🌐 سرور وب هوش نگار - نسخه پورت جدید
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import urllib.parse
import os

# import our template writer
from template_writer import TemplateIntelligentWriter

writer = TemplateIntelligentWriter()

class IntelligentWriterHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/api/generate'):
            self._handle_generate_request()
        elif self.path == '/' or self.path == '/intelligent_writer.html':
            # Serve the HTML file
            self.path = '/intelligent_writer.html'
            super().do_GET()
        else:
            super().do_GET()
    
    def _handle_generate_request(self):
        try:
            # پارس کردن پارامترها
            query = urllib.parse.urlparse(self.path).query
            params = urllib.parse.parse_qs(query)
            
            topic = params.get('topic', ['هوش مصنوعی'])[0]
            template = params.get('template', ['مقاله'])[0]
            length = params.get('length', ['medium'])[0]
            
            # تولید محتوا
            content = writer.generate_content(topic, template, length)
            
            # ارسال پاسخ
            self.send_response(200)
            self.send_header('Content-type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "status": "success",
                "data": content,
                "message": "محتوای با موفقیت تولید شد"
            }
            
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = {
                "status": "error",
                "message": str(e)
            }
            self.wfile.write(json.dumps(error_response).encode())

print("🚀 سرور هوش نگار در حال راه‌اندازی...")
print("📡 آدرس: http://localhost:8000")
print("🔗 API: http://localhost:8000/api/generate?topic=هوش%20مصنوعی&template=مقاله&length=medium")
print("🌐 رابط کاربری: http://localhost:8000/intelligent_writer.html")
print("🛑 برای توقف: Ctrl+C")

# تغییر دایرکتوری کاری به مسیر فعلی
os.chdir(os.path.dirname(os.path.abspath(__file__)))

server = HTTPServer(('localhost', 8000), IntelligentWriterHandler)
server.serve_forever()

