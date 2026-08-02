// فایل بهینه‌سازی برای رفع فریز شدن پروژه تبدیل ۲D به ۳D

class ImageTo3DOptimizer {
    constructor() {
        this.isProcessing = false;
        this.progress = 0;
        this.worker = null;
        this.init();
    }

    init() {
        console.log('🔄 بهینه‌ساز بارگذاری شد');
        this.setupEventListeners();
        this.setupWorker();
    }

    setupEventListeners() {
        // جلوگیری از ارسال چندباره فرم
        const form = document.getElementById('upload-form') || document.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                if (this.isProcessing) {
                    e.preventDefault();
                    alert('لطفا صبر کنید، پردازش در حال انجام است...');
                    return;
                }
                this.isProcessing = true;
                this.showLoading();
            });
        }

        // بهینه‌سازی input file
        const fileInput = document.getElementById('image-input') || document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.validateFile(e.target.files[0]);
            });
        }
    }

    setupWorker() {
        // ایجاد Web Worker برای پردازش در background
        if (window.Worker) {
            this.worker = new Worker('image-processor-worker.js');
            
            this.worker.onmessage = (e) => {
                const { type, data } = e.data;
                
                switch (type) {
                    case 'progress':
                        this.updateProgress(data);
                        break;
                    case 'result':
                        this.handleResult(data);
                        break;
                    case 'error':
                        this.handleError(data);
                        break;
                }
            };
        }
    }

    validateFile(file) {
        if (!file) return;
        
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        
        if (file.size > maxSize) {
            alert('حجم فایل باید کمتر از ۱۰ مگابایت باشد');
            return false;
        }
        
        if (!allowedTypes.includes(file.type)) {
            alert('فرمت فایل باید JPG، PNG یا WebP باشد');
            return false;
        }
        
        // نمایش پیش‌نمایش با سایز کاهش یافته
        this.previewImage(file);
        return true;
    }

    previewImage(file) {
        const reader = new FileReader();
        const preview = document.getElementById('image-preview') || 
                       document.getElementById('preview') || 
                       document.querySelector('.preview');
        
        if (!preview) return;
        
        reader.onload = (e) => {
            // ایجاد تصویر با اندازه بهینه‌شده
            const img = new Image();
            img.onload = () => {
                // کاهش سایز برای پیش‌نمایش
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // محدود کردن سایز پیش‌نمایش
                const maxWidth = 800;
                const maxHeight = 600;
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                preview.innerHTML = '';
                preview.appendChild(canvas);
                
                // ذخیره تصویر اصلی برای پردازش
                this.originalImage = img;
            };
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }

    showLoading() {
        // ایجاد یا نمایش loading indicator
        let loader = document.getElementById('loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loader';
            loader.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                           background: rgba(0,0,0,0.8); display: flex; flex-direction: column; 
                           justify-content: center; align-items: center; z-index: 1000;">
                    <div class="spinner" style="width: 50px; height: 50px; border: 5px solid #f3f3f3; 
                        border-top: 5px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <p style="color: white; margin-top: 20px; font-size: 18px;">در حال پردازش تصویر...</p>
                    <div id="progress-bar" style="width: 300px; height: 20px; background: #555; 
                        border-radius: 10px; margin-top: 20px; overflow: hidden;">
                        <div id="progress-fill" style="width: 0%; height: 100%; background: #3498db; transition: width 0.3s;"></div>
                    </div>
                    <p id="progress-text" style="color: white; margin-top: 10px;">0%</p>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
    }

    hideLoading() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'none';
        }
        this.isProcessing = false;
    }

    updateProgress(percent) {
        this.progress = percent;
        const fill = document.getElementById('progress-fill');
        const text = document.getElementById('progress-text');
        
        if (fill) fill.style.width = percent + '%';
        if (text) text.textContent = percent + '%';
    }

    handleResult(data) {
        console.log('✅ پردازش کامل شد:', data);
        this.hideLoading();
        
        // نمایش نتیجه
        this.display3DModel(data);
    }

    handleError(error) {
        console.error('❌ خطا در پردازش:', error);
        this.hideLoading();
        alert('خطا در پردازش تصویر: ' + error);
    }

    display3DModel(modelData) {
        // اینجا مدل 3D ایجاد یا نمایش داده می‌شود
        const resultContainer = document.getElementById('result') || 
                               document.getElementById('3d-result') ||
                               document.querySelector('.result');
        
        if (resultContainer) {
            resultContainer.innerHTML = `
                <h3>✅ مدل سه بعدی ایجاد شد</h3>
                <div id="3d-viewer" style="width: 100%; height: 400px;"></div>
                <div style="margin-top: 20px;">
                    <button onclick="downloadModel()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px;">
                        دانلود مدل
                    </button>
                    <button onclick="resetConverter()" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 5px; margin-left: 10px;">
                        شروع مجدد
                    </button>
                </div>
            `;
            
            // اینجا Three.js یا کتابخانه 3D دیگر را بارگذاری کنید
            this.init3DViewer(modelData);
        }
    }

    init3DViewer(modelData) {
        // کد Three.js برای نمایش مدل
        console.log('رندر مدل 3D با داده‌ها:', modelData);
        
        // اگر Three.js موجود است
        if (typeof THREE !== 'undefined') {
            // ایجاد صحنه Three.js
            const container = document.getElementById('3d-viewer');
            if (!container) return;
            
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);
            
            // نور
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(1, 1, 1).normalize();
            scene.add(light);
            
            // ایجاد مدل ساده (مکعب) به عنوان مثال
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);
            
            camera.position.z = 5;
            
            // انیمیشن
            function animate() {
                requestAnimationFrame(animate);
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
                renderer.render(scene, camera);
            }
            animate();
            
            // رسپانسیو کردن
            window.addEventListener('resize', () => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });
        } else {
            // اگر Three.js نیست، یک تصویر جایگزین نشان دهید
            document.getElementById('3d-viewer').innerHTML = `
                <div style="display: flex; justify-content: center; align-items: center; height: 100%; background: #f0f0f0;">
                    <p>مدل سه بعدی با موفقیت ایجاد شد!</p>
                </div>
            `;
        }
    }
}

// تابع‌های کمکی
function downloadModel() {
    alert('این قابلیت در نسخه کامل فعال می‌شود');
}

function resetConverter() {
    window.location.reload();
}

// مقداردهی اولیه زمانی که DOM بارگذاری شد
document.addEventListener('DOMContentLoaded', () => {
    window.imageConverter = new ImageTo3DOptimizer();
    
    // اضافه کردن CSS برای بهینه‌سازی
    const style = document.createElement('style');
    style.textContent = `
        /* جلوگیری از فریز شدن */
        * {
            box-sizing: border-box;
        }
        
        body {
            overflow-x: hidden;
        }
        
        /* بهینه‌سازی input file */
        input[type="file"] {
            max-width: 100%;
        }
        
        /* محدود کردن سایز تصاویر */
        img, canvas {
            max-width: 100%;
            height: auto;
        }
        
        /* جلوگیری از selection سنگین */
        * {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
        }
        
        /* بهبود performance برای transform */
        .preview-area, .result-area {
            will-change: transform;
        }
    `;
    document.head.appendChild(style);
});

// خطایابی WebGL
function checkWebGLSupport() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
        alert('مرورگر شما از WebGL پشتیبانی نمی‌کند. برای استفاده از این قابلیت لطفا مرورگر خود را آپدیت کنید.');
        return false;
    }
    return true;
}

// بررسی پشتیبانی WebGL هنگام بارگذاری
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkWebGLSupport);
} else {
    checkWebGLSupport();
}
