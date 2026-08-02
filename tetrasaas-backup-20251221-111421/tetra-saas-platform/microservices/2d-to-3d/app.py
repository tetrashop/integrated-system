from flask import Flask, request, jsonify

app = Flask(__name__)

SERVICE_NAME = "2d-to-3d"
SERVICE_DESC = "تبدیل دو بعدی به سه بعدی"

@app.route('/process', methods=['POST'])
def process():
    return jsonify({
        "service": SERVICE_NAME,
        "description": SERVICE_DESC,
        "status": "ready",
        "message": "سرویس آماده است. منطق پردازش اینجا پیاده‌سازی می‌شود."
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": SERVICE_NAME})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3005)
