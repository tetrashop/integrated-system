// فایل: src/services/ErrorHandlerService.ts
// نسخه نهایی - بدون خطای تایپ‌اسکریپت

import { AppError } from '../errors/AppError';
import { AdvancedImpactPredictor, PredictionFactors } from '../ai/AdvancedImpactPredictor';
import { ErrorHistoryService } from './ErrorHistoryService';
import { MonitoringService } from './MonitoringService';

// تنظیمات پیکربندی
const CONFIG = {
    CRITICAL_THRESHOLD: 0.7,
    ALERT_CHANNELS: ['slack', 'pagerduty', 'email'] as const,
    COLLECT_METRICS: true
};

// تابع کمکی برای ارسال هشدار بحرانی
async function triggerCriticalAlert(log: any, prediction: any): Promise<void> {
    const alertMessage = {
        title: `🚨 خطای بحرانی در سرویس ${log.error.code}`,
        description: `عملیات ${log.metadata.operationName} با خطا مواجه شد`,
        severity: 'CRITICAL' as const,
        prediction: {
            score: prediction.score,
            estimatedMTTR: prediction.estimatedMTTR,
            confidence: prediction.confidence
        },
        recommendations: prediction.recommendations.slice(0, 3),
        timestamp: new Date().toISOString(),
        links: {
            dashboard: 'https://monitoring.tetrasaas.com/errors',
            runbook: `https://docs.tetrasaas.com/runbooks/${log.error.code}`
        }
    };
    
    // ارسال به کانال‌های مختلف
    for (const channel of CONFIG.ALERT_CHANNELS) {
        try {
            await MonitoringService.sendAlert(channel, alertMessage);
        } catch (alertError) {
            console.error(`[ALERT_ERROR] Failed to send via ${channel}:`, alertError);
        }
    }
}

export async function executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    operationName: string,
    metadata?: {
        userId?: string;
        requestId?: string;
        serviceTier?: 'free' | 'pro' | 'enterprise';
    }
): Promise<{ success: boolean; data?: T; error?: AppError; metrics?: any }> {
    
    const startTime = Date.now();
    let operationSuccess = false;
    let errorImpact: any = null;
    
    try {
        const data = await operation();
        const duration = Date.now() - startTime;
        operationSuccess = true;
        
        // ثبت متریک موفقیت
        if (CONFIG.COLLECT_METRICS) {
            MonitoringService.recordSuccess(operationName, duration, metadata);
        }
        
        return { 
            success: true, 
            data,
            metrics: { 
                duration, 
                timestamp: new Date().toISOString(),
                operationName 
            }
        };
        
    } catch (error) {
        const appError: AppError = error instanceof AppError 
            ? error 
            : new AppError('UNKNOWN_ERROR', `Unexpected error in ${operationName}`, { 
                originalError: error,
                operationName,
                ...metadata,
                timestamp: new Date().toISOString()
            });
        
        const errorTime = new Date();
        const duration = Date.now() - startTime;
        
        // ۱. تحلیل پیشرفته خطا
        const predictionFactors: PredictionFactors = {
            errorCode: appError.code,
            operationName,
            timestamp: errorTime,
            userId: metadata?.userId,
            requestId: metadata?.requestId,
            serviceTier: metadata?.serviceTier
        };
        
        try {
            errorImpact = await AdvancedImpactPredictor.predictImpact(predictionFactors);
        } catch (predictionError) {
            console.error('[PREDICTION_ERROR] Failed to predict impact:', predictionError);
            errorImpact = {
                score: 0.5,
                confidence: 0.3,
                recommendations: ['تحلیل خطا ناموفق بود - بررسی دستی نیاز است'],
                estimatedMTTR: 60
            };
        }
        
        // ۲. ذخیره تاریخچه خطا
        try {
            await ErrorHistoryService.recordError({
                errorCode: appError.code,
                operationName,
                timestamp: errorTime,
                userId: metadata?.userId,
                serviceTier: metadata?.serviceTier,
                impactScore: errorImpact.score,
                actualMTTR: undefined
            });
        } catch (historyError) {
            console.error('[HISTORY_ERROR] Failed to record error:', historyError);
        }
        
        // ۳. لاگ‌گیری ساختاریافته
        const structuredLog = {
            level: errorImpact.score >= CONFIG.CRITICAL_THRESHOLD ? 'ERROR' : 'WARN' as const,
            message: `Operation ${operationName} failed`,
            timestamp: errorTime.toISOString(),
            error: {
                code: appError.code,
                message: appError.message,
                stack: appError.stack,
                context: appError.context
            },
            prediction: errorImpact,
            metadata: {
                ...metadata,
                duration,
                environment: process.env.NODE_ENV || 'development',
                operationName,
                timestamp: errorTime.toISOString()
            }
        };
        
        // لاگ بر اساس سطح اهمیت
        if (errorImpact.score >= 0.8) {
            console.error('[CRITICAL_ERROR]', JSON.stringify(structuredLog, null, 2));
        } else if (errorImpact.score >= 0.6) {
            console.warn('[HIGH_ERROR]', JSON.stringify(structuredLog, null, 2));
        } else {
            console.log('[LOW_ERROR]', JSON.stringify(structuredLog, null, 2));
        }
        
        // ۴. ارسال به سیستم‌های مانیتورینگ خارجی
        MonitoringService.reportError(structuredLog);
        
        // ۵. هشدار برای خطاهای بحرانی
        if (errorImpact.score >= CONFIG.CRITICAL_THRESHOLD) {
            try {
                await triggerCriticalAlert(structuredLog, errorImpact);
            } catch (alertError) {
                console.error('[CRITICAL_ALERT_FAILED]', alertError);
            }
        }
        
        return { 
            success: false, 
            error: appError,
            metrics: {
                duration,
                impactScore: errorImpact.score,
                estimatedMTTR: errorImpact.estimatedMTTR,
                confidence: errorImpact.confidence,
                timestamp: errorTime.toISOString(),
                operationName
            }
        };
    } finally {
        // ۶. ثبت متریک نهایی
        if (CONFIG.COLLECT_METRICS) {
            MonitoringService.recordOperationComplete(
                operationName,
                operationSuccess,
                Date.now() - startTime,
                errorImpact?.score
            );
        }
    }
}

// تابع کمکی برای بسته‌بندی عملیات ساده
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
    operation: T,
    operationName: string
): (...args: Parameters<T>) => ReturnType<typeof executeWithErrorHandling> {
    return async (...args: Parameters<T>) => {
        return executeWithErrorHandling(
            () => operation(...args),
            operationName
        );
    };
}
