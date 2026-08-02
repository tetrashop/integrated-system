from flask import Flask, request, jsonify

app = Flask(__name__)

SERVICE_NAME = "graphic-2d"
SERVICE_DESC = "گرافیکی دو بعدی"

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
    app.run(host='0.0.0.0', port=3010)
