// فایل: src/services/MonitoringService.ts
// نسخه اصلاح شده با رفع خطای Sentry - پشتیبانی از دو نسخه

import * as Sentry from '@sentry/node';
import * as Prometheus from 'prom-client';

// برای نسخه‌های قدیمی Sentry (قبل از 7.x) این import را فعال کنید
// import { Http } from "@sentry/integrations";

// راه‌اندازی Prometheus متریک‌ها
const register = new Prometheus.Registry();

// متریک‌های اصلی
const errorCounter = new Prometheus.Counter({
    name: 'tetra_errors_total',
    help: 'Total number of errors',
    labelNames: ['error_code', 'operation', 'severity']
});

const operationDuration = new Prometheus.Histogram({
    name: 'tetra_operation_duration_seconds',
    help: 'Duration of operations in seconds',
    labelNames: ['operation', 'success']
});

const mttrGauge = new Prometheus.Gauge({
    name: 'tetra_mttr_minutes',
    help: 'Current estimated MTTR in minutes'
});

// ثبت در رجیستر
register.registerMetric(errorCounter);
register.registerMetric(operationDuration);
register.registerMetric(mttrGauge);

export class MonitoringService {
    
    static init() {
        // راه‌اندازی Sentry
        if (process.env.SENTRY_DSN) {
            try {
                const sentryConfig: any = {
                    dsn: process.env.SENTRY_DSN,
                    environment: process.env.NODE_ENV || 'development',
                    tracesSampleRate: 1.0
                };
                
                // **راه‌حل خطا: انتخاب روش بر اساس نسخه Sentry**
                // گزینه ۱: برای نسخه‌های جدید (۷.۶۸.۰ به بالا)
                if (typeof Sentry.httpIntegration === 'function') {
                    sentryConfig.integrations = [
                        Sentry.httpIntegration({ tracing: true }) // ✅ روش جدید
                    ];
                } 
                // گزینه ۲: برای نسخه‌های قدیمی‌تر
                else {
                    // اگر از @sentry/integrations import کرده‌اید:
                    // sentryConfig.integrations = [new Http({ tracing: true })]
                    
                    // یا بدون integration خاص:
                    sentryConfig.integrations = [];
                    console.log('[INFO] Using Sentry without HTTP integration (legacy mode)');
                }
                
                Sentry.init(sentryConfig);
                console.log('✅ Sentry initialized successfully');
                
            } catch (sentryError) {
                console.error('❌ Failed to initialize Sentry:', sentryError);
            }
        } else {
            console.log('⚠️  SENTRY_DSN not set, Sentry monitoring disabled');
        }
        
        console.log('✅ Monitoring service initialized');
    }
    
    static recordSuccess(
        operation: string, 
        duration: number,
        metadata?: any
    ) {
        operationDuration.observe(
            { operation, success: 'true' },
            duration / 1000
        );
        
        // ثبت لاگ داخلی
        console.log(`[METRIC_SUCCESS] ${operation} completed in ${duration}ms`);
    }
    
    static recordOperationComplete(
        operation: string,
        success: boolean,
        duration: number,
        impactScore?: number
    ) {
        operationDuration.observe(
            { operation, success: success.toString() },
            duration / 1000
        );
        
        if (impactScore !== undefined) {
            mttrGauge.set(this.calculateMTTRFromScore(impactScore));
        }
        
        // گزارش مفصل برای تحلیل
        if (!success) {
            console.log(`[METRIC_FAILURE] ${operation} failed after ${duration}ms, impact: ${impactScore}`);
        }
    }
    
    static reportError(log: any) {
        const { error, prediction, metadata } = log;
        
        // ثبت در Prometheus
        const severity = prediction.score >= 0.7 ? 'high' : 
                        prediction.score >= 0.4 ? 'medium' : 'low';
        
        errorCounter.inc({
            error_code: error.code,
            operation: metadata.operationName,
            severity
        });
        
        // ارسال به Sentry (اگر فعال باشد)
        if (process.env.SENTRY_DSN) {
            try {
                Sentry.captureException(new Error(error.message), {
                    tags: {
                        errorCode: error.code,
                        operation: metadata.operationName,
                        impactScore: prediction.score.toFixed(2)
                    },
                    extra: {
                        context: error.context,
                        prediction: {
                            score: prediction.score,
                            estimatedMTTR: prediction.estimatedMTTR,
                            recommendations: prediction.recommendations
                        },
                        metadata: {
                            duration: metadata.duration,
                            environment: metadata.environment,
                            timestamp: metadata.timestamp
                        }
                    }
                });
            } catch (sentryError) {
                console.error('Failed to send error to Sentry:', sentryError);
            }
        }
        
        // ثبت در لاگ داخلی
        this.logToInternalSystem(log);
        
        console.log(`[ERROR_REPORTED] ${error.code} in ${metadata.operationName}, Impact: ${prediction.score}`);
    }
    
    static async sendAlert(channel: 'slack' | 'pagerduty' | 'email', message: any): Promise<void> {
        // شبیه‌سازی webhook URLs
        const webhookUrls: Record<string, string | undefined> = {
            slack: process.env.SLACK_WEBHOOK_URL,
            pagerduty: process.env.PAGERDUTY_WEBHOOK_URL,
            email: process.env.EMAIL_SERVICE_URL
        };
        
        const url = webhookUrls[channel];
        if (!url) {
            console.log(`[ALERT_SKIPPED] No webhook URL configured for ${channel}`);
            return;
        }
        
        try {
            // در محیط واقعی از fetch یا axios استفاده می‌شود
            console.log(`[ALERT_SENT] Channel: ${channel}, Title: ${message.title}`);
            console.log(`[ALERT_DETAILS] ${JSON.stringify(message, null, 2)}`);
            
        } catch (error) {
            console.error(`[ALERT_FAILED] ${channel}:`, error);
        }
    }
    
    static async getMetrics(): Promise<string> {
        return register.metrics();
    }
    
    static async getErrorReport(timeframe: '24h' | '7d' | '30d' = '24h'): Promise<any> {
        // در این نسخه ساده، داده‌های ثابت برمی‌گرداند
        // در نسخه واقعی از دیتابیس query می‌زنید
        
        const reports: Record<string, any> = {
            '24h': {
                timeframe: '24h',
                totalErrors: 42,
                criticalErrors: 5,
                avgMTTR: 28.5,
                resolutionRate: 0.82,
                topErrors: [
                    { errorCode: 'VALIDATION_FAILED', count: 18, avgMTTR: 15 },
                    { errorCode: 'DATABASE_ERROR', count: 12, avgMTTR: 45 },
                    { errorCode: 'NETWORK_TIMEOUT', count: 8, avgMTTR: 30 },
                    { errorCode: 'AUTH_FAILED', count: 4, avgMTTR: 20 }
                ],
                recommendations: [
                    'خطاهای VALIDATION_FAILED بیشترین تکرار را دارند - منطق اعتبارسنجی را بازبینی کنید',
                    'خطاهای DATABASE_ERROR بالاترین MTTR را دارند - اتصالات دیتابیس را بررسی کنید'
                ]
            },
            '7d': {
                timeframe: '7d',
                totalErrors: 215,
                criticalErrors: 32,
                avgMTTR: 32.1,
                resolutionRate: 0.78,
                topErrors: [
                    { errorCode: 'DATABASE_ERROR', count: 85, avgMTTR: 47 },
                    { errorCode: 'VALIDATION_FAILED', count: 76, avgMTTR: 18 },
                    { errorCode: 'EXTERNAL_API_FAILURE', count: 32, avgMTTR: 65 },
                    { errorCode: 'NETWORK_TIMEOUT', count: 22, avgMTTR: 35 }
                ]
            }
        };
        
        return reports[timeframe] || reports['24h'];
    }
    
    // متدهای کمکی داخلی
    private static calculateMTTRFromScore(score: number): number {
        if (score >= 0.8) return 120;
        if (score >= 0.6) return 60;
        if (score >= 0.4) return 30;
        return 15;
    }
    
    private static logToInternalSystem(log: any): void {
        // شبیه‌سازی ذخیره‌سازی در سیستم داخلی
        const internalLog = {
            ...log,
            storedAt: new Date().toISOString(),
            system: 'tetra-monitoring-v2',
            processed: true
        };
        
        // در محیط واقعی به دیتابیس یا فایل ذخیره می‌شود
        // اینجا فقط لاگ می‌کنیم
        console.log('[INTERNAL_LOG]', JSON.stringify({
            timestamp: internalLog.storedAt,
            errorCode: internalLog.error.code,
            operation: internalLog.metadata.operationName,
            impactScore: internalLog.prediction.score
        }));
    }
    
    // متد برای تست سلامت سرویس
    static async healthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        checks: Array<{ service: string; status: boolean; message?: string }>;
        timestamp: string;
    }> {
        const checks = [
            {
                service: 'prometheus_metrics',
                status: true,
                message: 'Metrics registry active'
            },
            {
                service: 'sentry',
                status: !!process.env.SENTRY_DSN,
                message: process.env.SENTRY_DSN ? 'Sentry DSN configured' : 'Sentry not configured'
            },
            {
                service: 'alerting',
                status: true,
                message: 'Alert system ready'
            }
        ];
        
        const allHealthy = checks.every(check => check.status);
        
        return {
            status: allHealthy ? 'healthy' : 
                   checks.filter(c => !c.status).length <= 1 ? 'degraded' : 'unhealthy',
            checks,
            timestamp: new Date().toISOString()
        };
    }
}
