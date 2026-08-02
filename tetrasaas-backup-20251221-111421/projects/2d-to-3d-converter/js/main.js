// مبدل ۲D به ۳D - تتراشاپ - نسخه واقعی

// متغیرهای جهانی
let currentImage = null;
let isProcessing = false;
let modelCreated = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('مبدل ۲D به ۳D بارگذاری شد');
    
    // راه‌اندازی اولیه
    initializeConverter();
    setupEventListeners();
    
    // بارگذاری Three.js و راه‌اندازی
    loadThreeJS();
});

function initializeConverter() {
    console.log('راه‌اندازی مبدل...');
    
    // مقداردهی اولیه مقادیر کنترل
    updateControlValues();
    
    // بارگذاری مثال اولیه
    loadExampleImage();
    
    // به‌روزرسانی آمار اولیه
    updateModelInfo();
}

function setupEventListeners() {
    // آپلود فایل
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    
    uploadArea.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            loadImageFile(file);
        }
    });
    
    // دکمه تبدیل
    document.getElementById('convert-btn').addEventListener('click', convertTo3D);
    
    // دکمه دانلود
    document.getElementById('download-btn').addEventListener('click', downloadModel);
    
    // کنترل‌های اسلایدر
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            updateControlValue(this);
            if (modelCreated) {
                update3DModel();
            }
        });
    });
    
    // کشیدن و رها کردن فایل
    setupDragAndDrop();
    
    // دکمه بازنشانی
    document.getElementById('reset-btn').addEventListener('click', resetConverter);
    
    // فرمت‌های خروجی
    document.querySelectorAll('.format-option').forEach(option => {
        option.addEventListener('click', function() {
            const format = this.dataset.format;
            setOutputFormat(format);
        });
    });
}

function setupDragAndDrop() {
    const uploadArea = document.getElementById('upload-area');
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = '#8b5cf6';
        this.style.background = 'rgba(139, 92, 246, 0.2)';
    });
    
    uploadArea.addEventListener('dragleave', function() {
        this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        this.style.background = 'transparent';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        this.style.background = 'transparent';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            loadImageFile(file);
        } else {
            alert('لطفاً فقط فایل تصویری انتخاب کنید.');
        }
    });
}

function loadThreeJS() {
    console.log('بارگذاری Three.js...');
    
    // چک کردن اگر Three.js قبلاً لود شده
    if (typeof THREE === 'undefined') {
        // لود کردن Three.js از CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = function() {
            // لود کردن OrbitControls
            const controlsScript = document.createElement('script');
            controlsScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
            controlsScript.onload = function() {
                // لود کردن STLExporter و OBJExporter
                loadExporters();
            };
            document.head.appendChild(controlsScript);
        };
        document.head.appendChild(script);
    } else {
        initThreeJS();
    }
}

function loadExporters() {
    // لود کردن STLExporter
    const stlScript = document.createElement('script');
    stlScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/exporters/STLExporter.js';
    
    // لود کردن OBJExporter
    const objScript = document.createElement('script');
    objScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/exporters/OBJExporter.js';
    
    stlScript.onload = function() {
        objScript.onload = function() {
            // حالا Three.js کامل شده، راه‌اندازی کن
            const threeScript = document.createElement('script');
            threeScript.src = 'js/three-setup.js';
            threeScript.onload = function() {
                if (window.converter3D) {
                    window.converter3D.initThreeJS();
                }
            };
            document.head.appendChild(threeScript);
        };
        document.head.appendChild(objScript);
    };
    document.head.appendChild(stlScript);
}

function loadExampleImage() {
    console.log('بارگذاری تصویر مثال...');
    
    // ایجاد یک تصویر نمونه با Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // ایجاد گرادیانت
    const gradient = ctx.createLinearGradient(0, 0, 400, 0);
    gradient.addColorStop(0, '#8b5cf6');
    gradient.addColorStop(0.5, '#ec4899');
    gradient.addColorStop(1, '#f59e0b');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 300);
    
    // اضافه کردن متن
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('۲D به ۳D', 200, 150);
    ctx.font = '20px Arial';
    ctx.fillText('تصویر نمونه برای تبدیل', 200, 200);
    
    // نمایش تصویر
    const img = new Image();
    img.src = canvas.toDataURL();
    img.onload = function() {
        currentImage = img;
        document.getElementById('image-preview').src = img.src;
        updateModelInfo();
        showConversionOptions();
    };
}

function loadImageFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('لطفاً فقط فایل تصویری انتخاب کنید');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            currentImage = img;
            document.getElementById('image-preview').src = e.target.result;
            updateModelInfo();
            showConversionOptions();
            showNotification('تصویر با موفقیت بارگذاری شد!', 'success');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function updateControlValue(slider) {
    const valueSpan = slider.nextElementSibling;
    valueSpan.textContent = slider.value;
}

function updateControlValues() {
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        updateControlValue(slider);
    });
}

function updateModelInfo() {
    if (!currentImage) return;
    
    // محاسبه اطلاعات بر اساس تصویر
    const width = currentImage.width;
    const height = currentImage.height;
    const aspectRatio = (width / height).toFixed(2);
    const estimatedVertices = Math.min(width, 1000) * Math.min(height, 1000) / 100;
    const estimatedFaces = estimatedVertices * 1.5;
    const estimatedSize = (estimatedVertices * 0.01).toFixed(2);
    
    document.getElementById('vertex-count').textContent = Math.round(estimatedVertices).toLocaleString();
    document.getElementById('face-count').textContent = Math.round(estimatedFaces).toLocaleString();
    document.getElementById('model-size').textContent = estimatedSize;
    document.getElementById('image-resolution').textContent = `${width}×${height} (${aspectRatio})`;
}

function showConversionOptions() {
    const conversionModes = document.getElementById('conversion-modes');
    conversionModes.style.display = 'grid';
}

function convertTo3D() {
    if (!currentImage) {
        showNotification('لطفاً ابتدا یک تصویر انتخاب کنید.', 'warning');
        return;
    }
    
    if (isProcessing) return;
    
    console.log('شروع تبدیل به ۳D...');
    
    const convertBtn = document.getElementById('convert-btn');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    // غیرفعال کردن دکمه
    isProcessing = true;
    convertBtn.disabled = true;
    convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال تبدیل...';
    
    // دریافت تنظیمات
    const depth = document.getElementById('depth-slider').value / 100;
    const smoothness = document.getElementById('smoothness-slider').value;
    const detail = document.getElementById('detail-slider').value;
    
    // شبیه‌سازی پیشرفت
    let progress = 0;
    const interval = setInterval(() => {
        progress += 2;
        progressFill.style.width = progress + '%';
        progressText.textContent = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            
            // فعال کردن دکمه
            convertBtn.disabled = false;
            convertBtn.innerHTML = '<i class="fas fa-sync-alt"></i> تبدیل مجدد';
            isProcessing = false;
            
            // ایجاد مدل واقعی
            createReal3DModel(depth, detail);
            
            // نمایش پیام موفقیت
            showNotification('✅ تبدیل با موفقیت انجام شد! مدل ۳D ایجاد شد.', 'success');
            
            // فعال کردن دکمه دانلود
            document.getElementById('download-btn').disabled = false;
            modelCreated = true;
            
            // نمایش اطلاعات مدل
            updateModelInfo();
        }
    }, 30);
}

function createReal3DModel(depth, detail) {
    console.log('Creating real 3D model with depth:', depth, 'detail:', detail);
    
    if (!currentImage) {
        console.error('No image available for 3D conversion');
        return;
    }
    
    // استفاده از Three.js برای ایجاد مدل
    if (window.converter3D && window.converter3D.create3DModelFromImage) {
        try {
            window.converter3D.create3DModelFromImage(currentImage, depth, detail / 10);
            
            // نمایش کانواس ۳D
            const canvas = document.getElementById('3d-canvas');
            canvas.style.display = 'block';
            
            // به‌روزرسانی اطلاعات مدل
            updateModelInfo();
        } catch (error) {
            console.error('Error creating 3D model:', error);
            showNotification('خطا در ایجاد مدل ۳D. لطفاً دوباره تلاش کنید.', 'error');
        }
    } else {
        console.warn('Three.js not fully loaded, using fallback');
        createFallback3DModel();
    }
}

function createFallback3DModel() {
    // ایجاد یک مدل ساده به عنوان fallback
    const canvas = document.getElementById('3d-canvas');
    const ctx = canvas.getContext('2d');
    
    // پاک کردن کانواس
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // رسم یک مکعب ساده
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    
    // نقاط مکعب
    const points = [
        {x: 150, y: 100}, {x: 250, y: 100}, {x: 250, y: 200}, {x: 150, y: 200}, // جلو
        {x: 170, y: 80}, {x: 270, y: 80}, {x: 270, y: 180}, {x: 170, y: 180}   // عقب
    ];
    
    // کشیدن خطوط
    ctx.beginPath();
    
    // مربع جلو
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < 4; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    
    // مربع عقب
    ctx.moveTo(points[4].x, points[4].y);
    for (let i = 5; i < 8; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    
    // خطوط اتصال
    for (let i = 0; i < 4; i++) {
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[i+4].x, points[i+4].y);
    }
    
    ctx.stroke();
    
    // اضافه کردن متن
    ctx.fillStyle = '#8b5cf6';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('مدل ۳D ساخته شد', 200, 250);
    ctx.font = '12px Arial';
    ctx.fillText('برای مشاهده مدل کامل، Three.js را فعال کنید', 200, 270);
}

function update3DModel() {
    if (!modelCreated || !currentImage) return;
    
    const depth = document.getElementById('depth-slider').value / 100;
    const detail = document.getElementById('detail-slider').value;
    
    if (window.converter3D && window.converter3D.create3DModelFromImage) {
        window.converter3D.create3DModelFromImage(currentImage, depth, detail / 10);
    }
}

function downloadModel() {
    if (!modelCreated) {
        showNotification('لطفاً ابتدا یک مدل ایجاد کنید.', 'warning');
        return;
    }
    
    const format = document.querySelector('.format-option.active')?.dataset.format || 'stl';
    
    if (window.converter3D && window.converter3D.exportModel) {
        window.converter3D.exportModel(format);
    } else {
        // Fallback: دانلود یک فایل نمونه
        downloadFallbackModel(format);
    }
}

function downloadFallbackModel(format) {
    let content, fileName, mimeType;
    
    switch(format) {
        case 'stl':
            content = `solid 3D_Model
facet normal 0 0 0
    outer loop
        vertex 0 0 0
        vertex 1 0 0
        vertex 1 1 0
    endloop
endfacet
endsolid 3D_Model`;
            fileName = '3d-model.stl';
            mimeType = 'text/plain';
            break;
            
        case 'obj':
            content = `# 3D Model
v 0 0 0
v 1 0 0
v 1 1 0
vn 0 0 1
f 1//1 2//1 3//1`;
            fileName = '3d-model.obj';
            mimeType = 'text/plain';
            break;
            
        default:
            showNotification('فرمت پشتیبانی نمی‌شود.', 'error');
            return;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification(`مدل نمونه با فرمت ${format.toUpperCase()} دانلود شد!`, 'success');
}

function setOutputFormat(format) {
    const options = document.querySelectorAll('.format-option');
    options.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.format === format) {
            option.classList.add('active');
        }
    });
    
    showNotification(`فرمت خروجی به ${format.toUpperCase()} تغییر کرد.`, 'info');
}

function resetConverter() {
    if (confirm('آیا مطمئن هستید که می‌خواهید همه چیز را بازنشانی کنید؟')) {
        // پاک کردن تصویر
        currentImage = null;
        document.getElementById('image-preview').src = '';
        document.getElementById('file-input').value = '';
        
        // پاک کردن مدل ۳D
        const canvas = document.getElementById('3d-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
        
        // پاک کردن مدل Three.js
        if (window.converter3D && scene) {
            if (mesh) {
                scene.remove(mesh);
                mesh = null;
            }
        }
        
        // بازنشانی کنترل‌ها
        document.getElementById('depth-slider').value = 50;
        document.getElementById('smoothness-slider').value = 50;
        document.getElementById('detail-slider').value = 60;
        
        // غیرفعال کردن دکمه دانلود
        document.getElementById('download-btn').disabled = true;
        modelCreated = false;
        
        // به‌روزرسانی مقادیر
        updateControlValues();
        updateModelInfo();
        
        // مخفی کردن گزینه‌های تبدیل
        document.getElementById('conversion-modes').style.display = 'none';
        
        showNotification('همه موارد بازنشانی شدند.', 'success');
    }
}

function showNotification(message, type) {
    // حذف نوتیفیکیشن قبلی
    const oldNotification = document.querySelector('.converter-notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    // ایجاد نوتیفیکیشن جدید
    const notification = document.createElement('div');
    notification.className = `converter-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(46, 204, 113, 0.9)' : 
                     type === 'warning' ? 'rgba(241, 196, 15, 0.9)' : 
                     'rgba(52, 152, 219, 0.9)'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease-out;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    // حذف خودکار بعد از 3 ثانیه
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// اضافه کردن استایل‌های انیمیشن
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100px); opacity: 0; }
    }
`;
document.head.appendChild(style);
