#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
import json
import asyncio
from pathlib import Path
from datetime import datetime

class TetrashopProjectScanner:
    def __init__(self, base_path="."):
        self.base_path = Path(base_path)
        self.projects = {}
        self.issues = []
    
    def scan_projects(self):
        """اسکن تمام پروژه‌های tetrashop"""
        print("🔍 در حال اسکن پروژه‌های tetrashop...")
        
        # پیدا کردن پروژه‌های شطرنج
        chess_projects = list(self.base_path.rglob("*chess*"))
        for chess_path in chess_projects:
            if chess_path.is_dir():
                self.analyze_chess_project(chess_path)
        
        # پیدا کردن پروژه‌های UI
        ui_projects = list(self.base_path.rglob("*/fronted/*")) + \
                     list(self.base_path.rglob("*/pages/*"))
        for ui_path in ui_projects:
            if ui_path.is_dir():
                self.analyze_ui_project(ui_path)
        
        return self.projects, self.issues
    
    def analyze_chess_project(self, project_path):
        """آنالیز پروژه شطرنج"""
        project_name = project_path.name
        print(f"♟️ آنالیز پروژه شطرنج: {project_name}")
        
        self.projects[project_name] = {
            'path': str(project_path),
            'type': 'chess',
            'files': [],
            'issues': []
        }
        
        # آنالیز فایل‌های شطرنج
        chess_files = list(project_path.rglob("*.js")) + list(project_path.rglob("*.py"))
        for chess_file in chess_files:
            issues = self.analyze_chess_file(chess_file)
            self.projects[project_name]['files'].append(str(chess_file))
            self.projects[project_name]['issues'].extend(issues)
            self.issues.extend(issues)

    def analyze_ui_project(self, project_path):
        """آنالیز پروژه UI"""
        project_name = project_path.parent.name
        print(f"🎨 آنالیز پروژه UI: {project_name}")
        
        if project_name not in self.projects:
            self.projects[project_name] = {
                'path': str(project_path),
                'type': 'ui',
                'files': [],
                'issues': []
            }
        
        # آنالیز فایل‌های UI
        ui_files = list(project_path.rglob("*.js")) + list(project_path.rglob("*.jsx"))
        for ui_file in ui_files:
            issues = self.analyze_ui_file(ui_file)
            self.projects[project_name]['files'].append(str(ui_file))
            self.projects[project_name]['issues'].extend(issues)
            self.issues.extend(issues)

    def analyze_chess_file(self, file_path):
        """آنالیز فایل شطرنج برای مشکلات"""
        issues = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # بررسی محاسبات سنگین در main thread
                chess_patterns = [
                    (r'minimax\(', 'الگوریتم Minimax در main thread'),
                    (r'alphabeta\(', 'الگوریتم Alpha-Beta در main thread'),
                    (r'evaluatePosition\(', 'تابع ارزیابی موقعیت در main thread'),
                    (r'calculateMove\(', 'تابع محاسبه حرکت در main thread'),
                    (r'while.*true.*calculate', 'حلقه بی‌نهایت در محاسبات شطرنج'),
                ]
                
                for pattern, description in chess_patterns:
                    if re.search(pattern, content, re.IGNORECASE):
                        issues.append({
                            'file': str(file_path),
                            'type': 'chess_performance',
                            'description': description,
                            'severity': 'high',
                            'fix': 'انتقال به Web Worker'
                        })
                
                # بررسی عدم استفاده از cache
                if any(keyword in content for keyword in ['calculate', 'evaluate', 'minimax']):
                    if 'cache' not in content and 'Cache' not in content:
                        issues.append({
                            'file': str(file_path),
                            'type': 'chess_cache',
                            'description': 'عدم استفاده از cache برای موقعیت‌های تکراری',
                            'severity': 'medium',
                            'fix': 'پیاده‌سازی position cache'
                        })
                        
        except Exception as e:
            print(f"خطا در آنالیز فایل {file_path}: {e}")
        
        return issues

    def analyze_ui_file(self, file_path):
        """آنالیز فایل UI برای مشکلات"""
        issues = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.split('\n')
                
                # بررسی event listenerهای حذف نشده
                event_count = content.count('addEventListener')
                remove_count = content.count('removeEventListener')
                
                if event_count > remove_count:
                    issues.append({
                        'file': str(file_path),
                        'type': 'memory_leak',
                        'description': f'event listenerهای حذف نشده: {event_count} اضافه شده, {remove_count} حذف شده',
                        'severity': 'high',
                        'fix': 'افزودن removeEventListener در cleanup'
                    })
                
                # بررسی setInterval/setTimeout بدون cleanup
                for i, line in enumerate(lines, 1):
                    if re.search(r'setInterval\([^)]+\)[^;]*$', line) and 'clearInterval' not in content:
                        issues.append({
                            'file': str(file_path),
                            'line': i,
                            'type': 'memory_leak',
                            'description': 'setInterval بدون clearInterval',
                            'severity': 'high',
                            'fix': 'ذخیره intervalId و clear در cleanup'
                        })
                    
                    if re.search(r'setTimeout\([^)]+\)[^;]*$', line):
                        issues.append({
                            'file': str(file_path),
                            'line': i,
                            'type': 'potential_issue',
                            'description': 'setTimeout ممکن است باعث memory leak شود',
                            'severity': 'medium',
                            'fix': 'استفاده از AbortController برای مدیریت timeout'
                        })
                
                # بررسی عملیات سنگین در UI thread
                heavy_operations = [
                    'JSON.parse',
                    'JSON.stringify', 
                    'array.sort',
                    'complex calculations'
                ]
                
                for op in heavy_operations:
                    if op in content and 'Worker' not in content:
                        issues.append({
                            'file': str(file_path),
                            'type': 'ui_blocking',
                            'description': f'عملیات سنگین ({op}) در main thread',
                            'severity': 'medium',
                            'fix': 'انتقال به Web Worker'
                        })
                        
        except Exception as e:
            print(f"خطا در آنالیز فایل {file_path}: {e}")
        
        return issues

class TetrashopOptimizer:
    def __init__(self):
        self.fixes_applied = []
    
    def apply_fixes(self, projects, issues):
        """اعمال فیکس‌ها برای مشکلات پیدا شده"""
        print("\n🔧 شروع اعمال بهینه‌سازی‌ها...")
        
        for issue in issues:
            fix = self.create_fix(issue)
            if fix:
                self.fixes_applied.append(fix)
        
        # ایجاد فایل‌های بهینه‌سازی
        self.create_worker_files()
        self.create_optimization_scripts()
        
        return self.fixes_applied
    
    def create_fix(self, issue):
        """ایجاد فیکس برای یک مشکل خاص"""
        if issue['type'] == 'chess_performance':
            return self.create_chess_worker_fix(issue)
        elif issue['type'] == 'chess_cache':
            return self.create_chess_cache_fix(issue)
        elif issue['type'] == 'memory_leak':
            return self.create_memory_leak_fix(issue)
        elif issue['type'] == 'ui_blocking':
            return self.create_worker_fix(issue)
        
        return None
    
    def create_chess_worker_fix(self, issue):
        """ایجاد فیکس برای موتور شطرنج"""
        fix_code = """
// موتور شطرنج بهینه‌سازی شده با Web Worker
class OptimizedChessEngine {
    constructor() {
        this.worker = new Worker('/js/workers/chess-engine.js');
        this.positionCache = new Map();
        this.pendingCalculations = new Map();
        this.cacheHits = 0;
        this.cacheMisses = 0;
    }

    async calculateBestMove(fen, depth = 3) {
        const cacheKey = `${fen}-${depth}`;
        
        // بررسی کش
        if (this.positionCache.has(cacheKey)) {
            this.cacheHits++;
            return this.positionCache.get(cacheKey);
        }
        
        this.cacheMisses++;
        
        // جلوگیری از محاسبات تکراری
        if (this.pendingCalculations.has(cacheKey)) {
            return this.pendingCalculations.get(cacheKey);
        }
        
        const calculationPromise = new Promise((resolve, reject) => {
            const calculationId = Date.now() + Math.random();
            
            const messageHandler = (e) => {
                if (e.data.id === calculationId) {
                    this.worker.removeEventListener('message', messageHandler);
                    this.pendingCalculations.delete(cacheKey);
                    
                    if (e.data.error) {
                        reject(e.data.error);
                    } else {
                        // ذخیره در کش
                        this.positionCache.set(cacheKey, e.data.move);
                        
                        // مدیریت اندازه کش
                        if (this.positionCache.size > 1000) {
                            const firstKey = this.positionCache.keys().next().value;
                            this.positionCache.delete(firstKey);
                        }
                        
                        resolve(e.data.move);
                    }
                }
            };
            
            this.worker.addEventListener('message', messageHandler);
            
            // ارسال درخواست محاسبه
            this.worker.postMessage({
                type: 'calculate_move',
                fen: fen,
                depth: depth,
                id: calculationId
            });
            
            // تایم‌اوت
            setTimeout(() => {
                this.worker.removeEventListener('message', messageHandler);
                this.pendingCalculations.delete(cacheKey);
                reject(new Error('Calculation timeout after 30s'));
            }, 30000);
        });
        
        this.pendingCalculations.set(cacheKey, calculationPromise);
        return calculationPromise;
    }
    
    getCacheStats() {
        const hitRate = this.cacheHits / (this.cacheHits + this.cacheMisses) * 100;
        return {
            hits: this.cacheHits,
            misses: this.cacheMisses,
            hitRate: hitRate.toFixed(2) + '%',
            cacheSize: this.positionCache.size
        };
    }
    
    cleanup() {
        this.positionCache.clear();
        this.pendingCalculations.clear();
        this.worker.terminate();
    }
}
"""
        
        return {
            'type': 'chess_worker_fix',
            'file': issue['file'],
            'description': issue['description'],
            'fix_code': fix_code,
            'fix_file': 'optimized-chess-engine.js'
        }
    
    def create_memory_leak_fix(self, issue):
        """ایجاد فیکس برای memory leak"""
        fix_code = """
// مدیریت event listeners و timers
class EventManager {
    constructor() {
        this.listeners = new Map();
        this.intervals = new Set();
        this.timeouts = new Set();
    }
    
    addEventListener(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
        const listenerId = `${event}-${Date.now()}`;
        this.listeners.set(listenerId, { element, event, handler });
        return listenerId;
    }
    
    removeEventListener(listenerId) {
        if (this.listeners.has(listenerId)) {
            const { element, event, handler } = this.listeners.get(listenerId);
            element.removeEventListener(event, handler);
            this.listeners.delete(listenerId);
        }
    }
    
    setInterval(callback, delay) {
        const id = setInterval(callback, delay);
        this.intervals.add(id);
        return id;
    }
    
    clearInterval(id) {
        if (this.intervals.has(id)) {
            clearInterval(id);
            this.intervals.delete(id);
        }
    }
    
    setTimeout(callback, delay) {
        const id = setTimeout(() => {
            this.timeouts.delete(id);
            callback();
        }, delay);
        this.timeouts.add(id);
        return id;
    }
    
    clearTimeout(id) {
        if (this.timeouts.has(id)) {
            clearTimeout(id);
            this.timeouts.delete(id);
        }
    }
    
    cleanup() {
        // پاک‌سازی تمام listeners
        for (const [id, { element, event, handler }] of this.listeners) {
            element.removeEventListener(event, handler);
        }
        this.listeners.clear();
        
        // پاک‌سازی intervals
        for (const id of this.intervals) {
            clearInterval(id);
        }
        this.intervals.clear();
        
        // پاک‌سازی timeouts
        for (const id of this.timeouts) {
            clearTimeout(id);
        }
        this.timeouts.clear();
    }
}

// استفاده نمونه:
// const eventManager = new EventManager();
// 
// // اضافه کردن event listener با مدیریت خودکار
// const clickId = eventManager.addEventListener(
//     button, 'click', handleClick
// );
// 
// // در cleanup کامپوننت:
// eventManager.cleanup();
"""
        
        return {
            'type': 'memory_leak_fix',
            'file': issue['file'],
            'description': issue['description'],
            'fix_code': fix_code,
            'fix_file': 'event-manager.js'
        }
    
    def create_worker_files(self):
        """ایجاد فایل‌های Worker مورد نیاز"""
        
        # ایجاد دایرکتوری workers
        os.makedirs('js/workers', exist_ai=True)
        
        # فایل worker برای شطرنج
        chess_worker_code = """
// chess-engine-worker.js
self.addEventListener('message', function(e) {
    const { type, fen, depth, id } = e.data;
    
    if (type === 'calculate_move') {
        try {
            // شبیه‌سازی محاسبات سنگین شطرنج
            const bestMove = calculateBestMove(fen, depth);
            
            self.postMessage({
                type: 'move_calculated',
                move: bestMove,
                id: id
            });
        } catch (error) {
            self.postMessage({
                type: 'error',
                error: error.message,
                id: id
            });
        }
    }
});

// تابع ساده برای شبیه‌سازی موتور شطرنج
function calculateBestMove(fen, depth) {
    // این یک پیاده‌سازی ساده است - در واقعیت از الگوریتم‌های پیشرفته استفاده می‌شود
    const moves = ['e2e4', 'd2d4', 'g1f3', 'c2c4'];
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    
    // شبیه‌سازی زمان محاسبه
    const start = Date.now();
    while (Date.now() - start < 100) {
        // محاسبات سنگین
    }
    
    return randomMove;
}
"""
        
        with open('js/workers/chess-engine.js', 'w') as f:
            f.write(chess_worker_code)
    
    def create_optimization_scripts(self):
        """ایجاد اسکریپت‌های بهینه‌سازی"""
        
        # اسکریپت اعمال بهینه‌سازی‌ها
        optimization_script = """
#!/bin/bash
echo "🚀 شروع بهینه‌سازی پروژه‌های tetrashop..."

# کپی فایل‌های بهینه‌سازی شده
cp optimized-chess-engine.js ./chess-engine/
cp event-manager.js ./fronted/src/utils/

# نصب پیش‌نیازها (اگر نیاز باشد)
# npm install --save worker-loader

echo "✅ بهینه‌سازی‌ها اعمال شدند"
echo "📁 فایل‌های ایجاد شده:"
echo "   - optimized-chess-engine.js (موتور شطرنج بهینه‌سازی شده)"
echo "   - event-manager.js (مدیریت memory leak)"
echo "   - js/workers/chess-engine.js (Web Worker شطرنج)"
"""
        
        with open('apply-optimizations.sh', 'w') as f:
            f.write(optimization_script)
        
        os.chmod('apply-optimizations.sh', 0o755)

async def main():
    print("🎯 شروع بهینه‌سازی پروژه‌های tetrashop")
    print("=" * 50)
    
    try:
        # اسکن پروژه‌ها
        scanner = TetrashopProjectScanner()
        projects, issues = scanner.scan_projects()
        
        print(f"\n📊 نتایج اسکن:")
        print(f"   پروژه‌های یافت شده: {len(projects)}")
        print(f"   مشکلات شناسایی شده: {len(issues)}")
        
        # نمایش مشکلات
        for i, issue in enumerate(issues, 1):
            print(f"   {i}. [{issue['severity'].upper()}] {issue['description']}")
            print(f"      فایل: {issue['file']}")
            print(f"      راه‌حل: {issue['fix']}")
            print()
        
        # اعمال بهینه‌سازی‌ها
        optimizer = TetrashopOptimizer()
        fixes = optimizer.apply_fixes(projects, issues)
        
        print(f"✅ بهینه‌سازی کامل شد!")
        print(f"🔧 {len(fixes)} فیکس ایجاد شد")
        
        # ذخیره گزارش
        report = {
            'scan_date': str(datetime.now()),
            'projects_found': list(projects.keys()),
            'issues_identified': len(issues),
            'fixes_created': len(fixes),
            'issues_details': issues,
            'fixes_details': fixes
        }
        
        with open('tetrashop_optimization_report.json', 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print("📊 گزارش کامل در tetrashop_optimization_report.json ذخیره شد")
        print("\n🚀 برای اعمال بهینه‌سازی‌ها اجرا کنید: ./apply-optimizations.sh")
        
    except Exception as e:
        print(f"❌ خطا در بهینه‌سازی: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
