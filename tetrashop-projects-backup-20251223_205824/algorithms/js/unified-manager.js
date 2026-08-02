/**
 * 🎛️ مدیریت یکپارچه Tetrashop - نسخه بهینه شده
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class TetrashopUnifiedManager {
    constructor() {
        this.baseDir = path.join(__dirname, '..');
        this.projects = {
            'core': {
                name: '🛒 Tetrashop Core',
                path: path.join(this.baseDir, 'core'),
                type: 'node',
                status: 'inactive',
                port: 3000,
                start: 'npm start',
                priority: 'high'
            },
            'backend': {
                name: '🔧 Backend API',
                path: path.join(this.baseDir, 'backend'), 
                type: 'python',
                status: 'inactive',
                port: 8000,
                start: 'python3 main.py',
                priority: 'high'
            },
            'writer': {
                name: '📝 Intelligent Writer',
                path: path.join(this.baseDir, 'writer'),
                type: 'node',
                status: 'inactive', 
                port: 3002,
                start: 'npm start',
                priority: 'medium'
            },
            'chess': {
                name: '♟️ Chess Engine',
                path: path.join(this.baseDir, 'chess'),
                type: 'cpp',
                status: 'inactive',
                port: 9002,
                start: './bin/chess_server',
                priority: 'medium'
            }
        };
    }

    async startAll() {
        console.log('🚀 راه‌اندازی تمام پروژه‌های Tetrashop...\n');
        
        // راه‌اندازی به ترتیب اولویت
        const priorityOrder = ['core', 'backend', 'writer', 'chess'];
        
        for (const projectId of priorityOrder) {
            const project = this.projects[projectId];
            if (fs.existsSync(project.path)) {
                await this.startProject(projectId, project);
                await new Promise(resolve => setTimeout(resolve, 2000)); // تاخیر بین راه‌اندازی
            }
        }
        
        this.showStatus();
    }

    async startProject(projectId, project) {
        console.log(`🎯 راه‌اندازی ${project.name}...`);
        
        if (!fs.existsSync(project.path)) {
            console.log(`   ❌ مسیر ${project.path} یافت نشد`);
            return;
        }

        try {
            const originalDir = process.cwd();
            process.chdir(project.path);

            // راه‌اندازی بر اساس نوع پروژه
            if (project.type === 'node') {
                // نصب وابستگی‌ها اگر node_modules وجود ندارد
                if (!fs.existsSync('node_modules') && fs.existsSync('package.json')) {
                    console.log('   📦 نصب وابستگی‌های Node.js...');
                    execSync('npm install', { stdio: 'inherit' });
                }
            } else if (project.type === 'python') {
                // نصب وابستگی‌های Python
                if (fs.existsSync('requirements.txt')) {
                    console.log('   📦 نصب وابستگی‌های Python...');
                    execSync('pip install -r requirements.txt', { stdio: 'inherit' });
                }
            }

            // راه‌اندازی پروژه
            const childProcess = spawn(project.start, [], {
                stdio: 'inherit',
                detached: true,
                shell: true,
                cwd: project.path
            });

            childProcess.unref();
            this.projects[projectId].status = 'active';
            this.projects[projectId].pid = childProcess.pid;
            
            console.log(`   ✅ ${project.name} فعال شد (PID: ${childProcess.pid})`);
            
            process.chdir(originalDir);

        } catch (error) {
            console.log(`   ❌ خطا در راه‌اندازی ${project.name}:`, error.message);
            this.projects[projectId].status = 'error';
        }
    }

    showStatus() {
        console.log('\n📊 وضعیت سیستم Tetrashop:');
        console.log('============================');
        
        for (const [id, project] of Object.entries(this.projects)) {
            const statusIcon = 
                project.status === 'active' ? '🟢' :
                project.status === 'error' ? '🔴' : '⚪';
            
            console.log(`${statusIcon} ${project.name}`);
            console.log(`   📍 پورت: ${project.port}`);
            console.log(`   🏷️  نوع: ${project.type}`);
            console.log(`   🔧 وضعیت: ${project.status}`);
            if (project.status === 'active') {
                console.log(`   🔗 http://localhost:${project.port}`);
            }
            console.log('');
        }
        
        console.log('🎯 دستورات مدیریت:');
        console.log('   npm run manager    # بازکردن این مدیریت');
        console.log('   npm run repair     # ترمیم فوری');
        console.log('   npm run test       # تست تمام سرویس‌ها');
    }
}

// اجرا اگر مستقیماً فراخوانی شد
if (require.main === module) {
    const manager = new TetrashopUnifiedManager();
    manager.startAll();
}

module.exports = TetrashopUnifiedManager;
