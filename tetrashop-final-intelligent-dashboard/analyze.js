const fs = require('fs');
const path = require('path');

// مسیر واقعی پوشه پروژه‌ها
const projectsDir = "/data/data/com.termux/files/home/tetrashop-projects";

function analyzeProject(projectPath) {
    const stats = {
        name: path.basename(projectPath),
        path: projectPath,
        type: "unknown",
        files: [],
        hasPackageJson: false,
        hasIndexHtml: false,
        hasServerJs: false,
        lineCount: 0,
        sizeKB: 0
    };
    
    try {
        const items = fs.readdirSync(projectPath);
        
        for (const item of items) {
            const itemPath = path.join(projectPath, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isFile()) {
                stats.files.push(item);
                
                if (item === 'package.json') stats.hasPackageJson = true;
                if (item === 'index.html') stats.hasIndexHtml = true;
                if (item === 'server.js') stats.hasServerJs = true;
                
                // محاسبه حجم و تعداد خطوط
                try {
                    const content = fs.readFileSync(itemPath, 'utf8');
                    stats.lineCount += content.split('\n').length;
                    stats.sizeKB += Math.round(stat.size / 1024);
                } catch (e) {}
            }
        }
        
        // تعیین نوع پروژه
        if (stats.hasPackageJson && stats.hasIndexHtml) {
            stats.type = "fullstack";
        } else if (stats.hasPackageJson) {
            stats.type = "node";
        } else if (stats.hasIndexHtml) {
            stats.type = "web";
        } else if (stats.files.some(f => f.endsWith('.py'))) {
            stats.type = "python";
        }
        
    } catch (error) {
        console.error(`خطا در تحلیل ${projectPath}:`, error.message);
    }
    
    return stats;
}

function analyzeAllProjects() {
    const projects = [];
    
    try {
        const items = fs.readdirSync(projectsDir);
        
        for (const item of items) {
            const itemPath = path.join(projectsDir, item);
            
            if (fs.statSync(itemPath).isDirectory()) {
                const project = analyzeProject(itemPath);
                if (project.files.length > 0) {
                    projects.push(project);
                }
            }
        }
    } catch (error) {
        console.error("خطا در خواندن پوشه پروژه‌ها:", error.message);
    }
    
    return projects;
}

// اجرای تحلیل و ذخیره نتایج
const projects = analyzeAllProjects();
console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    totalProjects: projects.length,
    projects: projects
}, null, 2));
