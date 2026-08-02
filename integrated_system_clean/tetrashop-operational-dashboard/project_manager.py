#!/usr/bin/env python3
import os
import json
import subprocess
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

class ProjectHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        
        if path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            
            with open('index.html', 'r', encoding='utf-8') as f:
                self.wfile.write(f.read().encode())
        
        elif path == '/api/projects':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            with open('projects_analysis.json', 'r', encoding='utf-8') as f:
                self.wfile.write(f.read().encode())
        
        elif path.startswith('/api/run/'):
            project_name = path.split('/')[-1]
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            result = {"status": "success", "project": project_name}
            self.wfile.write(json.dumps(result).encode())
        
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        if self.path == '/api/execute':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode())
            
            project_name = data.get('project')
            command = data.get('command', '')
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            result = self.execute_command(project_name, command)
            self.wfile.write(json.dumps(result).encode())
    
    def execute_command(self, project_name, command):
        project_path = f"/data/data/com.termux/files/home/tetrashop-projects/{project_name}"
        
        if not os.path.exists(project_path):
            return {"status": "error", "message": "پروژه یافت نشد"}
        
        try:
            if command == "run_web":
                # پیدا کردن فایل HTML
                html_files = [f for f in os.listdir(project_path) if f.endswith('.html')]
                if html_files:
                    return {
                        "status": "success",
                        "message": "آماده اجرا",
                        "url": f"/projects/{project_name}/{html_files[0]}"
                    }
            
            elif command == "run_node":
                if os.path.exists(os.path.join(project_path, "package.json")):
                    return {
                        "status": "success", 
                        "message": "پروژه Node.js آماده اجراست",
                        "command": f"cd {project_path} && npm start"
                    }
            
            return {"status": "info", "message": "دستور اجرا شد"}
            
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def log_message(self, format, *args):
        pass  # غیرفعال کردن لاگ

if __name__ == "__main__":
    server = HTTPServer(('localhost', 8083), ProjectHandler)
    print("🌐 سرور مدیریت پروژه‌ها روی پورت 8083 راه‌اندازی شد")
    server.serve_forever()
