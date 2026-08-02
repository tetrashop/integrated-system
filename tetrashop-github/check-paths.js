const fs = require('fs');
const path = require('path');

console.log('🔍 بررسی مسیرهای پروژه‌ها:\n');

const projects = [
  { name: 'chess', file: 'chess/index.html' },
  { name: 'quantum-writer', file: 'quantum-writer/quantum-writer.html' },
  { name: 'speech-recognition', file: 'speech-recognition/index.html' },
  { name: 'intelligent-writer', file: 'intelligent-writer-backup-20251021/index.html' },
  { name: 'secret-garden', file: 'secret-garden/index.html' }
];

const baseDir = process.cwd();
console.log('📂 مسیر جاری:', baseDir);
console.log('');

projects.forEach(project => {
  const filePath = path.join(baseDir, project.file);
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${project.name}:`);
  console.log(`   مسیر: ${project.file}`);
  console.log(`   وجود دارد: ${exists}`);
  console.log('');
});
