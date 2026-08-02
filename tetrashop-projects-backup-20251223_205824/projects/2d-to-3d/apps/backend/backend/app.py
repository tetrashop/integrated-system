from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import sys
import os

app = Flask(__name__)
CORS(app)

# مسیر اسکریپت‌های پایتون
SCRIPTS_PATH = {
    'chess': 'scripts/chess_engine.py',
    'speech': 'scripts/speech_processor.py',
    'quantum': 'scripts/quantum_writer.py',
    'intelligent': 'scripts/intelligent_writer.py',
    'security': 'scripts/secret_guardian.py'
}

@app.route('/api/run-script', methods=['POST'])
def run_script():
    try:
        data = request.json
        script_name = data.get('script')
        input_data = data.get('input', '')
        
        if script_name not in SCRIPTS_PATH:
            return jsonify({'error': 'اسکریپت پیدا نشد'}), 404
        
        # اجرای اسکریپت پایتون
        result = subprocess.run(
            [sys.executable, SCRIPTS_PATH[script_name], input_data],
            capture_output=True, text=True, timeout=30
        )
        
        if result.returncode == 0:
            return jsonify({
                'success': True,
                'output': result.stdout,
                'project': script_name
            })
        else:
            return jsonify({
                'success': False,
                'error': result.stderr
            })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects', methods=['GET'])
def get_projects():
    projects = [
        {
            'name': '♟️ Chess Engine',
            'description': 'موتور شطرنج هوشمند با مینی‌مکس',
            'status': 'تکمیل شده',
            'script': 'chess',
            'endpoint': '/api/run-script'
        },
        {
            'name': '🎤 Speech Processor', 
            'description': 'پردازشگر صوت و تبدیل گفتار به متن',
            'status': 'فعال',
            'script': 'speech',
            'endpoint': '/api/run-script'
        },
        {
            'name': '🔮 Quantum Writer',
            'description': 'نویسنده مبتنی بر الگوریتم‌های کوانتومی',
            'status': 'تکمیل شده', 
            'script': 'quantum',
            'endpoint': '/api/run-script'
        }
    ]
    return jsonify(projects)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
