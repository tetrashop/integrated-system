const fs = require('fs');
const path = require('path');

function analyzeProjects(rootDir) {
    const projects = [];
    
    function scanDirectory(dir, projectName = '') {
        const items = fs.readdirSync(dir);
        let hasPackage = false;
        let hasIndex = false;
        let hasServer = false;
        let mainFile = '';
        
        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && !item.startsWith('.')) {
                scanDirectory(fullPath, item);
            } else if (stat.isFile()) {
                if (item === 'package.json') hasPackage = true;
                if (item === 'index.html') hasIndex = true;
                if (item === 'server.js') hasServer = true;
                if (item.endsWith('.js') && !mainFile) mainFile = item;
            }
        });
        
        if (hasPackage || hasIndex || hasServer) {
            projects.push({
                name: projectName || path.basename(dir),
                path: dir,
                type: hasPackage && hasIndex ? 'fullstack' : 
                      hasPackage ? 'node' : 
                      hasIndex ? 'web' : 'unknown',
                hasPackage,
                hasIndex,
                hasServer,
                mainFile
            });
        }
    }
    
    scanDirectory(rootDir);
    return projects;
}

const projects = analyzeProjects("$PROJECTS_DIR");
console.log(JSON.stringify(projects, null, 2));
