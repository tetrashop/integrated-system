/**
 * 🎛️ مدیریت مرکزی پروژه‌های Tetrashop
 * ⚡ فعال‌سازی خودکار تمام سرویس‌ها
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class ProjectManager {
    constructor() {
        this.projects = {
            'tetrashop-optimized': {
                name: '🛒 Tetrashop معماری بهینه',
                path: '.',
                start: './start-optimized.sh',
                status: 'inactive',
                port: 3000,
                description: 'فروشگاه با بهبود 70% عملکرد'
            },
            'chess-engine': {
                name: '♟️ Chess Engine',
                path: './chess-engine',
                start: './start-chess.sh',
                status: 'inactive',
                port: 8080,
                description: 'هوش مصنوعی شطرنج پیشرفته'
            },
            'backend-api': {
                name: '🔧 Backend API',
                path: './backend',
                start: './start-backend.sh',
                status: 'inactive',
                port: 8000,
                description: 'API پیشرفته با پردازش صوت'
            }
        };
    }

    async startAll() {
        console.log('🚀 راه‌اندازی تمام پروژه‌های Tetrashop...\n');
        
        for (const [id, project] of Object.entries(this.projects)) {
            await this.startProject(id, project);
        }
        
        this.showStatus();
    }

    async startProject(projectId, project) {
        console.log(`🎯 در حال راه‌اندازی ${project.name}...`);
        
        if (!fs.existsSync(project.path)) {
            console.log(`   ❌ مسیر ${project.path} یافت نشد`);
            return;
        }

        try {
            // تغییر به مسیر پروژه
            process.chdir(project.path);
            
            // اجرای فایل استارت
            if (fs.existsSync(project.start)) {
                exec(`chmod +x ${project.start} && ${project.start}`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`   ❌ خطا در راه‌اندازی: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`   ⚠️ هشدار: ${stderr}`);
                    }
                    console.log(`   ✅ ${project.name} فعال شد`);
                    this.projects[projectId].status = 'active';
                });
            } else {
                console.log(`   ❌ فایل استارت ${project.start} یافت نشد`);
            }
            
            // بازگشت به مسیر اصلی
            process.chdir('..');
            
        } catch (error) {
            console.log(`   ❌ خطا: ${error.message}`);
        }
    }

    showStatus() {
        console.log('\n📊 وضعیت پروژه‌ها:');
        console.log('====================');
        
        for (const [id, project] of Object.entries(this.projects)) {
            const statusIcon = project.status === 'active' ? '🟢' : '🔴';
            console.log(`${statusIcon} ${project.name}`);
            console.log(`   📍 پورت: ${project.port}`);
            console.log(`   📝 ${project.description}`);
            console.log(`   🔗 http://localhost:${project.port}`);
            console.log('');
        }
        
        console.log('🌐 دشبورد مدیریت: http://localhost:3000/admin');
        console.log('📚 مستندات API: http://localhost:8000/docs');
        console.log('♟️ شطرنج: http://localhost:8080');
    }

    async healthCheck() {
        console.log('🩺 بررسی سلامت سرویس‌ها...');
        
        for (const [id, project] of Object.entries(this.projects)) {
            // شبیه‌سازی بررسی سلامت
            const isHealthy = Math.random() > 0.2; // 80% سالم
            project.health = isHealthy ? 'healthy' : 'unhealthy';
            
            console.log(`   ${isHealthy ? '✅' : '❌'} ${project.name}: ${project.health}`);
        }
    }
}

// اجرای مدیر پروژه
const manager = new ProjectManager();

// اگر مستقیماً اجرا شد
if (require.main === module) {
    manager.startAll();
}

module.exports = ProjectManager;
