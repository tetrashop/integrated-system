// فایل: src/ai/AdvancedImpactPredictor.ts
// الگوریتم پیشرفته پیش‌بینی اثر خطا

import { ErrorHistoryService } from '../services/ErrorHistoryService';

export interface PredictionFactors {
    errorCode: string;
    operationName: string;
    timestamp: Date;
    userId?: string;
    requestId?: string;
    serviceTier?: 'free' | 'pro' | 'enterprise';
}

export interface PredictionResult {
    score: number;           // ۰ تا ۱ (نمره تأثیر)
    confidence: number;      // ۰ تا ۱ (اطمینان پیش‌بینی)
    recommendations: string[]; // توصیه‌های عملی
    estimatedMTTR: number;   // دقیقه
    factors?: {              // عوامل مؤثر در تصمیم (برای شفافیت)
        errorFrequency: number;
        businessCriticality: number;
        timeSensitivity: number;
        userImpact: number;
    };
}

export class AdvancedImpactPredictor {
    
    // عوامل وزندهی برای پیش‌بینی
    private static readonly FACTOR_WEIGHTS = {
        errorFrequency: 0.35,     // تناوب خطا در گذشته
        businessCriticality: 0.30, // اهمیت عملیات
        timeSensitivity: 0.20,    // حساسیت زمانی
        userImpact: 0.15          // تأثیر بر کاربر
    };
    
    // عملیات‌های بحرانی کسب‌وکار
    private static readonly CRITICAL_OPERATIONS = [
        'processPayment', 'createUser', 'verifyIdentity',
        'generateInvoice', 'updateSubscription', 'deleteAccount'
    ];
    
    // عملیات‌های با اهمیت متوسط
    private static readonly IMPORTANT_OPERATIONS = [
        'getUserById', 'updateProfile', 'searchData',
        'listProducts', 'getOrderHistory'
    ];
    
    // خطاهای با تأثیر بالا
    private static readonly HIGH_IMPACT_ERRORS = [
        'DATABASE_CONNECTION_LOST', 'EXTERNAL_API_FAILURE', 
        'PAYMENT_GATEWAY_DOWN', 'AUTH_SERVICE_UNAVAILABLE'
    ];
    
    // خطاهای با تأثیر متوسط
    private static readonly MEDIUM_IMPACT_ERRORS = [
        'VALIDATION_FAILED', 'TIMEOUT', 'RATE_LIMIT_EXCEEDED',
        'PERMISSION_DENIED', 'RESOURCE_NOT_FOUND'
    ];
    
    static async predictImpact(factors: PredictionFactors): Promise<PredictionResult> {
        
        // محاسبه هر عامل به صورت موازی
        const [
            errorFrequencyScore,
            businessCriticalityScore,
            timeSensitivityScore,
            userImpactScore
        ] = await Promise.all([
            this.calculateErrorFrequencyScore(factors.errorCode, factors.operationName),
            this.calculateBusinessCriticalityScore(factors.operationName),
            this.calculateTimeSensitivityScore(factors.timestamp),
            this.calculateUserImpactScore(factors.serviceTier)
        ]);
        
        // محاسبه نمره نهایی با وزندهی
        const finalScore = 
            (errorFrequencyScore * this.FACTOR_WEIGHTS.errorFrequency) +
            (businessCriticalityScore * this.FACTOR_WEIGHTS.businessCriticality) +
            (timeSensitivityScore * this.FACTOR_WEIGHTS.timeSensitivity) +
            (userImpactScore * this.FACTOR_WEIGHTS.userImpact);
        
        // تخمین MTTR بر اساس نمره
        const estimatedMTTR = this.estimateMTTR(finalScore, factors.errorCode);
        
        // تولید توصیه‌های عملی
        const recommendations = this.generateRecommendations(
            finalScore, 
            factors.errorCode,
            factors.operationName,
            estimatedMTTR
        );
        
        // محاسبه اطمینان پیش‌بینی
        const confidence = this.calculateConfidence(
            errorFrequencyScore,
            factors.errorCode
        );
        
        return {
            score: this.round(finalScore, 2),
            confidence: this.round(confidence, 2),
            recommendations,
            estimatedMTTR,
            factors: {
                errorFrequency: this.round(errorFrequencyScore, 2),
                businessCriticality: this.round(businessCriticalityScore, 2),
                timeSensitivity: this.round(timeSensitivityScore, 2),
                userImpact: this.round(userImpactScore, 2)
            }
        };
    }
    
    private static async calculateErrorFrequencyScore(
        errorCode: string, 
        operation: string
    ): Promise<number> {
        try {
            const history = await ErrorHistoryService.getErrorStats(errorCode, operation);
            
            if (history.totalOccurrences === 0) {
                // خطای جدید - ریسک متوسط
                return 0.4;
            }
            
            const occurrenceRate = history.recentOccurrences / 24; // در 24 ساعت گذشته
            const resolutionRate = history.resolvedCount / history.totalOccurrences;
            
            // خطاهای مکرر با رفع کند = امتیاز بالا
            if (occurrenceRate > 5 && resolutionRate < 0.3) return 0.9;
            if (occurrenceRate > 3) return 0.7;
            if (occurrenceRate > 1) return 0.5;
            
            return 0.3;
            
        } catch (error) {
            console.error('[PREDICTION] Error frequency calculation failed:', error);
            return 0.5; // مقدار پیش‌فرض در صورت خطا
        }
    }
    
    private static calculateBusinessCriticalityScore(operation: string): number {
        if (this.CRITICAL_OPERATIONS.includes(operation)) return 0.9;
        if (this.IMPORTANT_OPERATIONS.includes(operation)) return 0.6;
        return 0.3; // عملیات عادی
    }
    
    private static calculateTimeSensitivityScore(timestamp: Date): number {
        const hour = timestamp.getHours();
        const day = timestamp.getDay(); // 0 = Sunday
        
        // ساعات اوج ترافیک کاری: 9-12 و 18-21
        const isPeakHour = (hour >= 9 && hour < 12) || (hour >= 18 && hour < 21);
        
        // روزهای کاری: Monday to Friday
        const isWorkday = day >= 1 && day <= 5;
        
        if (isPeakHour && isWorkday) return 0.9;
        if (isPeakHour || isWorkday) return 0.6;
        return 0.3; // آخر هفته یا ساعات غیراوج
    }
    
    private static calculateUserImpactScore(serviceTier?: string): number {
        switch (serviceTier) {
            case 'enterprise': return 0.9;
            case 'pro': return 0.6;
            case 'free': return 0.3;
            default: return 0.4; // پیش‌فرض
        }
    }
    
    private static estimateMTTR(score: number, errorCode: string): number {
        // MTTR پایه بر اساس نمره
        let baseMTTR = 15;
        if (score >= 0.8) baseMTTR = 120;
        else if (score >= 0.6) baseMTTR = 60;
        else if (score >= 0.4) baseMTTR = 30;
        
        // تنظیم بر اساس نوع خطا
        if (this.HIGH_IMPACT_ERRORS.includes(errorCode)) {
            baseMTTR = Math.max(baseMTTR, 90); // حداقل 90 دقیقه
        } else if (errorCode.includes('DATABASE')) {
            baseMTTR = Math.max(baseMTTR, 45); // حداقل 45 دقیقه برای خطاهای DB
        }
        
        return baseMTTR;
    }
    
    private static generateRecommendations(
        score: number, 
        errorCode: string,
        operationName: string,
        estimatedMTTR: number
    ): string[] {
        const recommendations: string[] = [];
        
        // توصیه‌های بر اساس نمره
        if (score >= 0.8) {
            recommendations.push(
                '🚨 **هشدار فوری**: تیم عملیاتی را در جریان قرار دهید',
                `⏱️ **اولویت بالا**: حداکثر تا ${estimatedMTTR} دقیقه آینده بررسی شود`,
                '📊 **نظارت شدید**: سلامت سرویس‌های وابسته را پیوسته بررسی کنید'
            );
        } else if (score >= 0.6) {
            recommendations.push(
                '👨‍💻 **تیم فنی**: مهندس ارشد را مطلع کنید',
                '📝 **مستندسازی**: لاگ‌های کامل را برای تحلیل آتی جمع‌آوری کنید',
                `⏳ **زمان‌بندی**: در ${estimatedMTTR} دقیقه آینده رسیدگی شود`
            );
        } else {
            recommendations.push(
                '✅ **اولویت عادی**: در صف بررسی معمولی قرار گیرد',
                '📈 **گزارش‌دهی**: در گزارش دوره‌ای خطاها ثبت شود',
                '🔍 **بررسی سطحی**: علت اصلی در فرصت مناسب بررسی شود'
            );
        }
        
        // توصیه‌های خاص بر اساس نوع خطا
        if (errorCode.includes('DATABASE')) {
            recommendations.push('🗄️ **دیتابیس**: وضعیت کانکشن‌ها و کوئری‌ها را بررسی کنید');
        }
        if (errorCode.includes('VALIDATION')) {
            recommendations.push('🔍 **اعتبارسنجی**: ورودی‌های کاربر و قوانین کسب‌وکار را بازبینی کنید');
        }
        if (errorCode.includes('NETWORK') || errorCode.includes('TIMEOUT')) {
            recommendations.push('🌐 **شبکه**: وضعیت شبکه و سرویس‌های خارجی را بررسی کنید');
        }
        if (this.CRITICAL_OPERATIONS.includes(operationName)) {
            recommendations.push('💰 **کسب‌وکار**: تأثیر مالی این خطا را ارزیابی کنید');
        }
        
        return recommendations;
    }
    
    private static calculateConfidence(
        frequencyScore: number, 
        errorCode: string
    ): number {
        // اطمینان بر اساس تجربه تاریخی
        let confidence = 0.5; // پیش‌فرض
        
        if (frequencyScore > 0.7) confidence = 0.9; // خطای کاملاً شناخته شده
        else if (frequencyScore > 0.4) confidence = 0.7; // خطای نسبتاً شناخته شده
        
        // خطاهای شناخته‌شده سازمانی
        const knownErrorPatterns = [
            'VALIDATION_FAILED', 'DATABASE_ERROR', 'NETWORK_TIMEOUT'
        ];
        
        if (knownErrorPatterns.includes(errorCode)) {
            confidence = Math.min(confidence + 0.1, 0.95);
        }
        
        return confidence;
    }
    
    private static round(value: number, decimals: number): number {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }
    
    // متد کمکی برای آموزش مدل (چارچوب)
    static async trainModel(trainingData: Array<{
        features: PredictionFactors;
        actualImpact: number;
        actualMTTR: number;
    }>): Promise<{ success: boolean; accuracy?: number }> {
        console.log('[AI_TRAINING] Starting model training with', trainingData.length, 'samples');
        
        // در اینجا منطق آموزش مدل واقعی با TensorFlow.js یا scikit-learn قرار می‌گیرد
        // فعلاً شبیه‌سازی می‌کنیم
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            success: true,
            accuracy: 0.82 // دقت شبیه‌سازی شده
        };
    }
}
