// ============================================
// 🎯 الگوریتم واقعی تبدیل تصویر ۲D به مدل ۳D
// نسخه نهایی - تتراشاپ
// ============================================

class ImageTo3DConverter {
    constructor() {
        console.log('✅ سیستم تبدیل تصویر به مدل ۳D آماده است');
        this.version = '2.0.0';
        this.lastUpdate = '2025-12-15';
    }

    // -------------------------------------------------
    // 📤 تابع اصلی: تبدیل تصویر به مدل ۳D
    // -------------------------------------------------
    async convertImageTo3D(imagePath, outputName = '3d-model') {
        console.log(`🚀 شروع تبدیل: ${outputName}`);
        
        try {
            // 1. بارگذاری تصویر
            const imageData = await this.loadImage(imagePath);
            
            // 2. پردازش و ایجاد مدل
            const startTime = Date.now();
            const model = this.create3DModel(imageData);
            const processTime = Date.now() - startTime;
            
            // 3. ذخیره مدل
            const objContent = this.createOBJFile(model, outputName);
            this.saveModel(objContent, `${outputName}.obj`);
            
            // 4. آمار
            console.log(`✅ تبدیل کامل در ${processTime}ms`);
            console.log(`📊 ${model.vertexCount} رأس | ${model.faceCount} وجه`);
            
            return {
                success: true,
                model: model,
                stats: {
                    vertices: model.vertexCount,
                    faces: model.faceCount,
                    time: processTime,
                    fileSize: objContent.length
                }
            };
            
        } catch (error) {
            console.error('❌ خطا در تبدیل:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // -------------------------------------------------
    // 🖼️ بارگذاری تصویر
    // -------------------------------------------------
    async loadImage(imagePath) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                resolve({
                    data: imageData,
                    width: canvas.width,
                    height: canvas.height
                });
            };
            
            img.onerror = reject;
            img.src = imagePath;
        });
    }

    // -------------------------------------------------
    // 🎨 ایجاد مدل ۳D از تصویر
    // -------------------------------------------------
    create3DModel(imageData) {
        const { data, width, height } = imageData;
        const pixels = data.data;
        
        // تنظیمات پردازش
        const maxVertices = 50000; // حداکثر رئوس برای کارایی
        const scaleFactor = Math.sqrt(maxVertices / (width * height));
        const scale = Math.min(1, scaleFactor);
        
        const scaledWidth = Math.max(10, Math.floor(width * scale));
        const scaledHeight = Math.max(10, Math.floor(height * scale));
        
        // آرایه‌های مدل
        const vertices = [];
        const faces = [];
        const colors = [];
        
        // ایجاد رئوس
        for (let y = 0; y < scaledHeight; y++) {
            for (let x = 0; x < scaledWidth; x++) {
                const srcX = Math.floor(x / scale);
                const srcY = Math.floor(y / scale);
                const idx = (srcY * width + srcX) * 4;
                
                // رنگ پیکسل
                const r = pixels[idx] / 255;
                const g = pixels[idx + 1] / 255;
                const b = pixels[idx + 2] / 255;
                
                // روشنایی برای عمق
                const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                
                // مختصات ۳D
                const x3d = (x / scaledWidth) * 2 - 1;
                const y3d = (y / scaledHeight) * 2 - 1;
                const z3d = brightness * 0.5; // عمق بر اساس روشنایی
                
                vertices.push(x3d, z3d, y3d);
                colors.push(r, g, b);
            }
        }
        
        // ایجاد وجه‌ها
        for (let y = 0; y < scaledHeight - 1; y++) {
            for (let x = 0; x < scaledWidth - 1; x++) {
                const a = y * scaledWidth + x;
                const b = y * scaledWidth + (x + 1);
                const c = (y + 1) * scaledWidth + x;
                const d = (y + 1) * scaledWidth + (x + 1);
                
                // دو مثلث برای هر سلول
                faces.push(a, b, c);
                faces.push(b, d, c);
            }
        }
        
        return {
            vertices: vertices,
            faces: faces,
            colors: colors,
            width: scaledWidth,
            height: scaledHeight,
            vertexCount: vertices.length / 3,
            faceCount: faces.length / 3,
            originalSize: { width, height }
        };
    }

    // -------------------------------------------------
    // 💾 ایجاد فایل OBJ
    // -------------------------------------------------
    createOBJFile(model, name = 'model') {
        let objContent = `# مدل ۳D ایجاد شده توسط تتراشاپ\n`;
        objContent += `# تبدیل تصویر ۲D به مدل ۳D\n`;
        objContent += `# رئوس: ${model.vertexCount} | وجه‌ها: ${model.faceCount}\n\n`;
        
        // رئوس
        objContent += "# رئوس\n";
        for (let i = 0; i < model.vertices.length; i += 3) {
            objContent += `v ${model.vertices[i].toFixed(6)} ${model.vertices[i+1].toFixed(6)} ${model.vertices[i+2].toFixed(6)}\n`;
        }
        
        // رنگ‌ها (به عنوان vertex colors)
        objContent += "\n# رنگ‌های رئوس\n";
        for (let i = 0; i < model.colors.length; i += 3) {
            objContent += `vc ${model.colors[i].toFixed(4)} ${model.colors[i+1].toFixed(4)} ${model.colors[i+2].toFixed(4)}\n`;
        }
        
        // وجه‌ها
        objContent += "\n# وجه‌ها\n";
        for (let i = 0; i < model.faces.length; i += 3) {
            const v1 = model.faces[i] + 1;
            const v2 = model.faces[i + 1] + 1;
            const v3 = model.faces[i + 2] + 1;
            objContent += `f ${v1}//${v1} ${v2}//${v2} ${v3}//${v3}\n`;
        }
        
        return objContent;
    }

    // -------------------------------------------------
    // 📥 ذخیره مدل
    // -------------------------------------------------
    saveModel(objContent, filename) {
        // ذخیره در localStorage برای استفاده بعدی
        localStorage.setItem('last_3d_model', objContent);
        localStorage.setItem('last_3d_model_filename', filename);
        
        // آماده برای دانلود
        this.downloadReady = {
            content: objContent,
            filename: filename
        };
        
        console.log(`💾 مدل آماده دانلود: ${filename}`);
    }

    // -------------------------------------------------
    // 🎮 نمایش مدل با Three.js
    // -------------------------------------------------
    displayModel(model, containerId = 'model-container') {
        const container = document.getElementById(containerId);
        if (!container || typeof THREE === 'undefined') {
            console.warn('⚠️ Three.js یا کانتینر موجود نیست');
            return false;
        }
        
        // پاک کردن محتوای قبلی
        container.innerHTML = '';
        
        // ایجاد صحنه
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a1a);
        
        // دوربین
        const camera = new THREE.PerspectiveCamera(
            60,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 3);
        
        // رندرر
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // نورها
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        
        // ایجاد geometry از مدل
        const geometry = new THREE.BufferGeometry();
        
        // رئوس
        const vertices = new Float32Array(model.vertices);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        
        // رنگ‌ها
        const colors = new Float32Array(model.colors);
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // وجه‌ها
        const indices = new Uint32Array(model.faces);
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        
        geometry.computeVertexNormals();
        
        // متریال
        const material = new THREE.MeshPhongMaterial({
            vertexColors: true,
            side: THREE.DoubleSide,
            shininess: 30,
            transparent: true,
            opacity: 0.9
        });
        
        // mesh
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        // کنترل‌های دوربین
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        
        // انیمیشن
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
        
        // responsive
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
        
        console.log('✅ مدل با Three.js نمایش داده شد');
        return true;
    }

    // -------------------------------------------------
    // ⬇️ دانلود فایل
    // -------------------------------------------------
    downloadModel(filename = null) {
        const content = this.downloadReady?.content || localStorage.getItem('last_3d_model');
        const fname = filename || this.downloadReady?.filename || '3d-model.obj';
        
        if (!content) {
            console.warn('⚠️ مدلی برای دانلود وجود ندارد');
            return false;
        }
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fname;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log(`✅ مدل دانلود شد: ${fname}`);
        return true;
    }

    // -------------------------------------------------
    // 🧪 تست سیستم
    // -------------------------------------------------
    async testSystem() {
        console.log('🧪 شروع تست سیستم...');
        
        // ایجاد یک تصویر تست
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // رسم گرادیان
        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0, '#FF0000');
        gradient.addColorStop(0.5, '#00FF00');
        gradient.addColorStop(1, '#0000FF');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        
        // تبدیل به Data URL
        const testImage = canvas.toDataURL('image/png');
        
        // تست تبدیل
        const result = await this.convertImageTo3D(testImage, 'test-model');
        
        if (result.success) {
            console.log('✅ تست موفقیت‌آمیز بود!');
            return result;
        } else {
            console.error('❌ تست ناموفق بود');
            return null;
        }
    }
}

// ایجاد instance جهانی
window.Image3DConverter = new ImageTo3DConverter();

// توابع سریع برای استفاده
window.convertImageTo3D = (imagePath) => window.Image3DConverter.convertImageTo3D(imagePath);
window.display3DModel = (model, container) => window.Image3DConverter.displayModel(model, container);
window.download3DModel = (filename) => window.Image3DConverter.downloadModel(filename);
window.test3DConverter = () => window.Image3DConverter.testSystem();

console.log('🚀 سیستم تبدیل تصویر به مدل ۳D بارگذاری شد');
console.log('📖 دستورات:');
console.log('   convertImageTo3D("path/to/image.jpg")');
console.log('   display3DModel(modelData, "container-id")');
console.log('   download3DModel("my-model.obj")');
console.log('   test3DConverter()');
