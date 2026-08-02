from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
import numpy as np
from datetime import datetime, timedelta
import joblib

app = Flask(__name__)
CORS(app)

DATA_FILE = 'data/projects.json'
MODEL_DIR = 'models'

# ============================================
# ۱. بارگذاری و ذخیره‌سازی داده‌ها
# ============================================
def load_projects():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

def save_projects(projects):
    with open(DATA_FILE, 'w') as f:
        json.dump(projects, f, indent=2)

# ============================================
# ۲. پیش‌بینی ساده (بر اساس پیشرفت و زمان)
# ============================================
def predict_completion(project):
    progress = project.get('progress', 0)
    if progress >= 100:
        return 0
    elif progress >= 75:
        return np.random.randint(2, 5)
    elif progress >= 50:
        return np.random.randint(5, 10)
    else:
        return np.random.randint(10, 20)

def suggest_priority(project):
    progress = project.get('progress', 0)
    deadline_str = project.get('deadline', '')
    try:
        if deadline_str:
            deadline = datetime.strptime(deadline_str, '%Y-%m-%d')
            days_left = (deadline - datetime.now()).days
        else:
            days_left = 30
    except:
        days_left = 30

    if progress < 50 and days_left < 10:
        return "بالا"
    elif progress < 70 and days_left < 20:
        return "متوسط"
    else:
        return "پایین"

# ============================================
# ۳. API‌ها
# ============================================
@app.route('/api/projects', methods=['GET'])
def get_projects():
    projects = load_projects()
    for p in projects:
        p['predicted_days'] = predict_completion(p)
        p['suggested_priority'] = suggest_priority(p)
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

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    days = predict_completion(data)
    priority = suggest_priority(data)
    return jsonify({"predicted_days": days, "suggested_priority": priority})

# ============================================
# ۴. اجرا
# ============================================
if __name__ == '__main__':
    os.makedirs('data', exist_ok=True)
    os.makedirs('models', exist_ok=True)
    
    if not os.path.exists(DATA_FILE):
        sample = [
            {"id": 1, "name": "پروژه تبدیل 3D", "status": "در حال انجام", "progress": 75, "team": "تیم توسعه", "deadline": "2026-09-01", "priority": "بالا"},
            {"id": 2, "name": "سیستم NLP", "status": "تکمیل شده", "progress": 100, "team": "تیم تحقیق", "deadline": "2026-07-15", "priority": "متوسط"},
            {"id": 3, "name": "داشبورد مالی", "status": "در انتظار", "progress": 30, "team": "تیم مالی", "deadline": "2026-10-20", "priority": "پایین"},
            {"id": 4, "name": "پلتفرم فروشگاهی", "status": "در حال توسعه", "progress": 60, "team": "تیم محصول", "deadline": "2026-08-30", "priority": "بالا"}
        ]
        save_projects(sample)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
