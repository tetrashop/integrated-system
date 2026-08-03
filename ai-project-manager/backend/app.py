from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import json
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import joblib
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

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
# ۲. آماده‌سازی داده برای یادگیری ماشین
# ============================================
def prepare_data(projects):
    if not projects:
        return None, None
    df = pd.DataFrame(projects)
    # تبدیل تاریخ به روزهای باقی‌مانده
    df['deadline'] = pd.to_datetime(df['deadline'])
    df['days_remaining'] = (df['deadline'] - pd.Timestamp.now()).dt.days
    # تبدیل وضعیت به عددی
    status_map = {'در حال انجام': 0, 'تکمیل شده': 1, 'در انتظار': 2, 'در حال توسعه': 3}
    df['status_code'] = df['status'].map(status_map)
    # اولویت به عددی
    priority_map = {'بالا': 2, 'متوسط': 1, 'پایین': 0}
    df['priority_code'] = df['priority'].map(priority_map)
    return df, df[['progress', 'days_remaining', 'status_code', 'priority_code']]

# ============================================
# ۳. آموزش مدل‌ها (هر بار که داده‌ها تغییر می‌کنند)
# ============================================
def train_models():
    projects = load_projects()
    if not projects or len(projects) < 3:
        return
    
    df, features = prepare_data(projects)
    if features is None:
        return
    
    # هدف: پیش‌بینی زمان اتمام (روزهای باقی‌مانده)
    X = features[['progress', 'status_code', 'priority_code']].values
    y = features['days_remaining'].values
    
    # مدل رگرسیون خطی
    reg_model = LinearRegression()
    reg_model.fit(X, y)
    joblib.dump(reg_model, f'{MODEL_DIR}/regression_model.pkl')
    
    # مدل خوشه‌بندی (K-Means) برای طبقه‌بندی خودکار وضعیت
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(features[['progress', 'days_remaining']].values)
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    kmeans.fit(X_scaled)
    joblib.dump(kmeans, f'{MODEL_DIR}/kmeans_model.pkl')
    joblib.dump(scaler, f'{MODEL_DIR}/scaler.pkl')
    
    print("✅ مدل‌های هوش مصنوعی آموزش داده شدند.")

# ============================================
# ۴. پیش‌بینی با مدل‌ها
# ============================================
def predict_completion(project):
    try:
        reg_model = joblib.load(f'{MODEL_DIR}/regression_model.pkl')
        status_map = {'در حال انجام': 0, 'تکمیل شده': 1, 'در انتظار': 2, 'در حال توسعه': 3}
        priority_map = {'بالا': 2, 'متوسط': 1, 'پایین': 0}
        
        X_pred = np.array([[project['progress'], status_map.get(project['status'], 0), priority_map.get(project['priority'], 1)]])
        days_pred = reg_model.predict(X_pred)[0]
        return max(0, int(days_pred))
    except:
        return None

def suggest_priority(project):
    try:
        kmeans = joblib.load(f'{MODEL_DIR}/kmeans_model.pkl')
        scaler = joblib.load(f'{MODEL_DIR}/scaler.pkl')
        df, _ = prepare_data(load_projects())
        if df is None:
            return "متوسط"
        features = df[['progress', 'days_remaining']].values
        X_scaled = scaler.transform(features)
        clusters = kmeans.fit_predict(X_scaled)
        # آخرین خوشه‌ی پروژه
        last_cluster = clusters[-1]
        if last_cluster == 0:
            return "پایین"
        elif last_cluster == 1:
            return "متوسط"
        else:
            return "بالا"
    except:
        return "متوسط"

# ============================================
# ۵. API‌ها
# ============================================
@app.route('/api/projects', methods=['GET'])
def get_projects():
    projects = load_projects()
    # اضافه کردن پیش‌بینی و پیشنهاد به هر پروژه
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
    train_models()  # بازآموزی با داده‌های جدید
    return jsonify(new_project), 201

@app.route('/api/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    projects = load_projects()
    for p in projects:
        if p['id'] == project_id:
            p.update(request.json)
            save_projects(projects)
            train_models()
            return jsonify(p)
    return jsonify({"error": "پروژه یافت نشد"}), 404

@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    projects = load_projects()
    projects = [p for p in projects if p['id'] != project_id]
    save_projects(projects)
    train_models()
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
# ۶. اجرا
# ============================================
if __name__ == '__main__':
    os.makedirs(MODEL_DIR, exist_ok=True)
    if not os.path.exists(DATA_FILE):
        sample = [
            {"id": 1, "name": "پروژه تبدیل 3D", "status": "در حال انجام", "progress": 75, "team": "تیم توسعه", "deadline": "2026-09-01", "priority": "بالا"},
            {"id": 2, "name": "سیستم NLP", "status": "تکمیل شده", "progress": 100, "team": "تیم تحقیق", "deadline": "2026-07-15", "priority": "متوسط"},
            {"id": 3, "name": "داشبورد مالی", "status": "در انتظار", "progress": 30, "team": "تیم مالی", "deadline": "2026-10-20", "priority": "پایین"},
            {"id": 4, "name": "پلتفرم فروشگاهی", "status": "در حال توسعه", "progress": 60, "team": "تیم محصول", "deadline": "2026-08-30", "priority": "بالا"}
        ]
        save_projects(sample)
    
    train_models()
    app.run(debug=True, host='0.0.0.0', port=5000)
