// اسکریپت استقرار خودکار Tetrashop100
const fs = require('fs');
const path = require('path');

console.log('🚀 Tetrashop100 - Automated Deployment');

class DeployManager {
    constructor() {
        this.platforms = {
            vercel: {
                name: 'Vercel',
                config: 'vercel.json',
                command: 'npx vercel --prod'
            },
            netlify: {
                name: 'Netlify', 
                config: 'netlify.toml',
                command: 'npx netlify-cli deploy --prod'
            },
            cloudflare: {
                name: 'Cloudflare Pages',
                config: 'wrangler.toml',
                command: 'npx wrangler pages deploy .'
            }
        };
    }

    checkFiles() {
        console.log('📁 بررسی فایل‌ها...');
        const requiredFiles = [
            'index.html',
            'vercel.json', 
            'netlify.toml',
            'package.json',
            '3d-conversion-system/index.html',
            'payment-systems/crypto-management.html',
            'payment-systems/crypto-management.html',
            'payment-systems/crypto-management.html'
        ];

        let allExists = true;
        requiredFiles.forEach(file => {
            if (fs.existsSync(file)) {
                console.log(`✅ ${file}`);
            } else {
                console.log(`❌ ${file}`);
                allExists = false;
            }
        });

        return allExists;
    }

    generateDeployCommands() {
        console.log('\n🎯 دستورات استقرار:');
        Object.entries(this.platforms).forEach(([key, platform]) => {
            console.log(`\n${platform.name}:`);
            console.log(`  ${platform.command}`);
        });

        console.log('\n📋 دستور کلی:');
        console.log('  git add . && git commit -m "deploy" && git push origin main');
    }

    createDeployScript() {
        const script = `#!/bin/bash
echo "🚀 استقرار خودکار Tetrashop100"

# بررسی پیش‌نیازها
if ! command -v git &> /dev/null; then
    echo "❌ Git نصب نیست"
    exit 1
fi

# آپدیت ریپازیتوری
git add .
git commit -m "🚀 Deploy Tetrashop100 - \$(date +'%Y-%m-%d %H:%M:%S')"
git push origin main

echo "✅ پروژه به GitHub پوش شد"
echo "🌐 حالا به پلتفرم مورد نظر بروید و از GitHub deploy کنید"
`;

        fs.writeFileSync('deploy.sh', script);
        fs.chmodSync('deploy.sh', '755');
        console.log('✅ اسکریپت deploy.sh ایجاد شد');
    }
}

// اجرای اسکریپت
const deployer = new DeployManager();

if (deployer.checkFiles()) {
    console.log('\n🎉 تمام فایل‌ها آماده استقرار هستند!');
    deployer.generateDeployCommands();
    deployer.createDeployScript();
} else {
    console.log('\n❌ برخی فایل‌ها وجود ندارند');
    process.exit(1);
}
