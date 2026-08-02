// Web Worker برای پردازش تصویر در background

self.onmessage = function(e) {
    const { imageData, width, height } = e.data;
    
    // شبیه‌سازی پردازش سنگین با تاخیر
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += 10;
        self.postMessage({ type: 'progress', data: progress });
        
        if (progress >= 100) {
            clearInterval(interval);
            
            // پردازش تصویر (الگوریتم ساده)
            try {
                const processedData = processImage(imageData, width, height);
                self.postMessage({ 
                    type: 'result', 
                    data: {
                        vertices: processedData.vertices,
                        faces: processedData.faces,
                        texture: processedData.texture
                    }
                });
            } catch (error) {
                self.postMessage({ type: 'error', data: error.message });
            }
        }
    }, 100);
};

function processImage(imageData, width, height) {
    // تبدیل تصویر ۲D به داده‌های ۳D
    // این یک الگوریتم ساده است - در نسخه واقعی پیچیده‌تر است
    
    const vertices = [];
    const faces = [];
    
    // کاهش رزولوشن برای پردازش سریع‌تر
    const scale = 0.1;
    const scaledWidth = Math.floor(width * scale);
    const scaledHeight = Math.floor(height * scale);
    
    // ایجاد vertices بر اساس روشنایی پیکسل‌ها
    for (let y = 0; y < scaledHeight; y++) {
        for (let x = 0; x < scaledWidth; x++) {
            const pixelIndex = (y * scaledWidth + x) * 4;
            const r = imageData[pixelIndex];
            const g = imageData[pixelIndex + 1];
            const b = imageData[pixelIndex + 2];
            
            // محاسبه روشنایی
            const brightness = (r + g + b) / 3;
            
            // ارتفاع بر اساس روشنایی
            const z = (brightness / 255) * 2;
            
            vertices.push(
                (x / scaledWidth) * 2 - 1,   // x
                (y / scaledHeight) * 2 - 1,  // y
                z                            // z
            );
        }
    }
    
    // ایجاد faces
    for (let y = 0; y < scaledHeight - 1; y++) {
        for (let x = 0; x < scaledWidth - 1; x++) {
            const a = y * scaledWidth + x;
            const b = y * scaledWidth + (x + 1);
            const c = (y + 1) * scaledWidth + x;
            const d = (y + 1) * scaledWidth + (x + 1);
            
            // دو مثلث برای هر مربع
            faces.push(a, b, c);
            faces.push(b, d, c);
        }
    }
    
    // ایجاد texture
    const texture = {
        data: imageData,
        width: width,
        height: height
    };
    
    return {
        vertices: new Float32Array(vertices),
        faces: new Uint32Array(faces),
        texture: texture,
        vertexCount: vertices.length / 3,
        faceCount: faces.length / 3
    };
}
