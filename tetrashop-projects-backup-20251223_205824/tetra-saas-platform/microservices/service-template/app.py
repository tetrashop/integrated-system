"""
الگوی پایه برای تمام میکروسرویس‌های TetraSaaS
هر سرویس باید این ساختار را دنبال کند
"""

from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process():
    """endpoint اصلی پردازش"""
    data = request.get_json()
    # منطق پردازش مختص هر سرویس اینجا پیاده‌سازی می‌شود
    return jsonify({"status": "success", "service": os.getenv("SERVICE_NAME")})

@app.route('/health', methods=['GET'])
def health():
    """بررسی سلامت سرویس"""
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv("PORT", 3000)))
