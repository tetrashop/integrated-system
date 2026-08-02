from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
from datetime import datetime
import statistics

app = Flask(__name__)
CORS(app)

# مسیر ذخیره‌سازی داده‌ها
DATA_FILE = 'data/projects.json'

# بارگذاری داده‌های نمونه
def load_projects():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

# ذخیره داده‌ها
def save_projects(projects):
    with open(DATA_FILE, 'w') as f:
        json.dump(projects, f, indent=2)

# نمونه داده اولیه (اگر فایل خالی باشد)
def init_sample_data():
    if not os.path.exists(DATA_FILE):
        sample = [
            {"id": 1, "name": "پروژه تبدیل 3D", "status": "در حال انجام", "progress": 75, "team": "تیم توسعه", "deadline": "2026-09-01", "priority": "بالا"},
            {"id": 2, "name": "سیستم NLP", "status": "تکمیل شده", "progress": 100, "team": "تیم تحقیق", "deadline": "2026-07-15", "priority": "متوسط"},
            {"id": 3, "name": "داشبورد مالی", "status": "در انتظار", "progress": 30, "team": "تیم مالی", "deadline": "2026-10-20", "priority": "پایین"},
            {"id": 4, "name": "پلتفرم فروشگاهی", "status": "در حال توسعه", "progress": 60, "team": "تیم محصول", "deadline": "2026-08-30", "priority": "بالا"}
        ]
        save_projects(sample)
    return load_projects()

@app.route('/api/projects', methods=['GET'])
def get_projects():
    projects = load_projects()
    return jsonify(projects)

@app.route('/api/projects', methods=['POST'])
def add_project():
    new_project = request.json
    projects = load_projects()
    new_project['id'] = max([p['id'] for p in projects], default=0) + 1
    projects.append(new_project)
    save_projects(projects)
    return jsonify(new_project), 201

@app.route('/api/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    projects = load_projects()
    for p in projects:
        if p['id'] == project_id:
            p.update(request.json)
            save_projects(projects)
            return jsonify(p)
    return jsonify({"error": "پروژه یافت نشد"}), 404

@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    projects = load_projects()
    projects = [p for p in projects if p['id'] != project_id]
    save_projects(projects)
    return jsonify({"message": "حذف شد"}), 200

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    projects = load_projects()
    if not projects:
        return jsonify({"total": 0, "status_counts": {}, "avg_progress": 0, "priority_counts": {}})
    
    total = len(projects)
    status_counts = {}
    priority_counts = {}
    progress_sum = 0
    
    for p in projects:
        status_counts[p['status']] = status_counts.get(p['status'], 0) + 1
        priority_counts[p['priority']] = priority_counts.get(p['priority'], 0) + 1
        progress_sum += p['progress']
    
    avg_progress = progress_sum / total if total > 0 else 0
    
    return jsonify({
        "total": total,
        "status_counts": status_counts,
        "avg_progress": round(avg_progress, 1),
        "priority_counts": priority_counts
    })

if __name__ == '__main__':
    init_sample_data()
    app.run(debug=True, host='0.0.0.0', port=5000)
