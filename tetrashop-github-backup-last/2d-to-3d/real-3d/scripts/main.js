// main.js - نقطه ورود اصلی
import { RealDepthEstimator } from './depth-estimator.js';
import { RealMeshGenerator } from './mesh-generator.js';
import { TextureMapper } from './texture-mapper.js';
import { Exporter } from './exporter.js';

class Real2DTo3DConverter {
    constructor() {
        this.depthEstimator = new RealDepthEstimator();
        this.meshGenerator = new RealMeshGenerator();
        this.textureMapper = new TextureMapper();
        this.exporter = new Exporter();
        
        this.processingQueue = [];
        this.isProcessing = false;
    }
    
    async convert(image, options = {}) {
        const startTime = Date.now();
        
        // تنظیمات پیش‌فرض
        const settings = {
            quality: options.quality || 'medium',
            textureMethod: options.textureMethod || 'uv',
            exportFormats: options.exportFormats || ['obj', 'gltf'],
            resolution: options.resolution || '1024x1024',
            ...options
        };
        
        console.log('🚀 شروع تبدیل واقعی ۲D به ۳D');
        console.log('تنظیمات:', settings);
        
        // مرحله ۱: تخمین عمق
        console.time('تخمین عمق');
        const depthResult = await this.depthEstimator.estimate(image, settings.quality);
        console.timeEnd('تخمین عمق');
        
        // مرحله ۲: ایجاد مش
        console.time('ایجاد مش');
        const mesh = this.meshGenerator.generateMeshFromDepth(depthResult.depthMap, settings.quality);
        console.timeEnd('ایجاد مش');
        
        // مرحله ۳: اعمال بافت
        console.time('اعمال بافت');
        const textured = this.textureMapper.applyTexture(mesh, image, settings.textureMethod);
        console.timeEnd('اعمال بافت');
        
        // مرحله ۴: ایجاد خروجی‌ها
        console.time('ایجاد خروجی‌ها');
        const exports = await this.exporter.export(textured, settings.exportFormats);
        console.timeEnd('ایجاد خروجی‌ها');
        
        const totalTime = Date.now() - startTime;
        
        return {
            success: true,
            data: {
                mesh: textured.mesh,
                depthMap: depthResult.depthMap,
                texture: textured.texture,
                exports: exports
            },
            stats: {
                totalProcessingTime: totalTime,
                depthEstimationTime: depthResult.processingTime,
                vertices: mesh.vertexCount,
                faces: mesh.faceCount,
                quality: settings.quality,
                resolution: settings.resolution
            }
        };
    }
}

// اکسپورت برای استفاده در مرورگر
window.Real2DTo3DConverter = Real2DTo3DConverter;
