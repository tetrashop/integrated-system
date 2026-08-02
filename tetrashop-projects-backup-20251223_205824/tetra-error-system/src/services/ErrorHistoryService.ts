// فایل: src/services/ErrorHistoryService.ts
// مدیریت تاریخچه خطاها

export interface ErrorRecord {
    id: string;
    errorCode: string;
    operationName: string;
    timestamp: Date;
    resolved: boolean;
    resolutionTime?: number;
    userId?: string;
    serviceTier?: string;
    impactScore?: number;
    actualMTTR?: number;
    metadata?: Record<string, any>;
}

export class ErrorHistoryService {
    private static errors: ErrorRecord[] = [];
    private static readonly MAX_HISTORY = 1000;
    
    static async recordError(error: Omit<ErrorRecord, 'id' | 'resolved'>): Promise<string> {
        const record: ErrorRecord = {
            ...error,
            id: this.generateId(),
            resolved: false,
            metadata: {
                recordedAt: new Date(),
                version: '1.0'
            }
        };
        
        this.errors.unshift(record); // اضافه به ابتدای آرایه
        
        // محدود کردن تاریخچه به MAX_HISTORY رکورد
        if (this.errors.length > this.MAX_HISTORY) {
            this.errors = this.errors.slice(0, this.MAX_HISTORY);
        }
        
        console.log(`[HISTORY] Error recorded: ${error.errorCode} for ${error.operationName} (ID: ${record.id})`);
        
        return record.id;
    }
    
    static async markAsResolved(errorId: string, resolutionTime: number): Promise<boolean> {
        const error = this.errors.find(e => e.id === errorId);
        if (error) {
            error.resolved = true;
            error.resolutionTime = resolutionTime;
            error.metadata = {
                ...error.metadata,
                resolvedAt: new Date(),
                resolutionMethod: 'manual' // یا 'automatic'
            };
            return true;
        }
        return false;
    }
    
    static async getErrorStats(errorCode?: string, operation?: string): Promise<{
        totalOccurrences: number;
        recentOccurrences: number;
        avgResolutionTime: number;
        resolvedCount: number;
        unresolvedCount: number;
        mostCommonOperations: string[];
    }> {
        let filtered = this.errors;
        
        if (errorCode) {
            filtered = filtered.filter(e => e.errorCode === errorCode);
        }
        
        if (operation) {
            filtered = filtered.filter(e => e.operationName === operation);
        }
        
        // خطاهای 24 ساعت گذشته
        const recent = filtered.filter(e => 
            Date.now() - e.timestamp.getTime() < 24 * 60 * 60 * 1000
        );
        
        const resolved = filtered.filter(e => e.resolved);
        const unresolved = filtered.filter(e => !e.resolved);
        
        // میانگین زمان رفع
        const avgResolutionTime = resolved.length > 0
            ? resolved.reduce((sum, e) => sum + (e.resolutionTime || 0), 0) / resolved.length
            : 0;
        
        // عملیات‌های پرتکرار
        const operationCounts = filtered.reduce((acc, e) => {
            acc[e.operationName] = (acc[e.operationName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        const mostCommonOperations = Object.entries(operationCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name]) => name);
        
        return {
            totalOccurrences: filtered.length,
            recentOccurrences: recent.length,
            avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
            resolvedCount: resolved.length,
            unresolvedCount: unresolved.length,
            mostCommonOperations
        };
    }
    
    static async getMTTRAnalysis(days: number = 7): Promise<{
        period: string;
        totalErrors: number;
        avgMTTR: number;
        byErrorCode: Array<{ errorCode: string; count: number; avgMTTR: number }>;
        trend: 'improving' | 'stable' | 'worsening';
        recommendations: string[];
    }> {
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const periodErrors = this.errors.filter(e => e.timestamp >= since);
        const resolvedErrors = periodErrors.filter(e => e.resolved && e.resolutionTime);
        
        if (resolvedErrors.length === 0) {
            return {
                period: `${days} روز گذشته`,
                totalErrors: periodErrors.length,
                avgMTTR: 0,
                byErrorCode: [],
                trend: 'stable',
                recommendations: ['داده کافی برای تحلیل MTTR وجود ندارد']
            };
        }
        
        // محاسبه MTTR کلی
        const totalMTTR = resolvedErrors.reduce((sum, e) => sum + (e.resolutionTime || 0), 0);
        const avgMTTR = totalMTTR / resolvedErrors.length;
        
        // محاسبه MTTR بر اساس نوع خطا
        const errorCodeStats = resolvedErrors.reduce((acc, error) => {
            if (!acc[error.errorCode]) {
                acc[error.errorCode] = { totalMTTR: 0, count: 0 };
            }
            acc[error.errorCode].totalMTTR += error.resolutionTime || 0;
            acc[error.errorCode].count += 1;
            return acc;
        }, {} as Record<string, { totalMTTR: number; count: number }>);
        
        const byErrorCode = Object.entries(errorCodeStats).map(([errorCode, stats]) => ({
            errorCode,
            count: stats.count,
            avgMTTR: stats.totalMTTR / stats.count
        })).sort((a, b) => b.avgMTTR - a.avgMTTR);
        
        // محاسبه روند
        const halfPoint = Math.floor(resolvedErrors.length / 2);
        const firstHalf = resolvedErrors.slice(0, halfPoint);
        const secondHalf = resolvedErrors.slice(halfPoint);
        
        const avgFirst = firstHalf.length > 0 
            ? firstHalf.reduce((s, e) => s + (e.resolutionTime || 0), 0) / firstHalf.length 
            : 0;
        const avgSecond = secondHalf.length > 0
            ? secondHalf.reduce((s, e) => s + (e.resolutionTime || 0), 0) / secondHalf.length
            : 0;
        
        let trend: 'improving' | 'stable' | 'worsening' = 'stable';
        if (avgSecond < avgFirst * 0.8 && avgFirst > 0) trend = 'improving';
        else if (avgSecond > avgFirst * 1.2 && avgSecond > 0) trend = 'worsening';
        
        // تولید توصیه‌ها
        const recommendations: string[] = [];
        if (trend === 'worsening') {
            recommendations.push('⚠️ روند MTTR در حال افزایش است - فرآیندهای عیب‌یابی را بازبینی کنید');
        } else if (trend === 'improving') {
            recommendations.push('✅ روند MTTR در حال بهبود است - رویه‌های فعلی مؤثر هستند');
        }
        
        if (byErrorCode.length > 0) {
            const worstError = byErrorCode[0];
            if (worstError.avgMTTR > 60) {
                recommendations.push(`⏱️ خطای "${worstError.errorCode}" بیشترین MTTR را دارد (${Math.round(worstError.avgMTTR)} دقیقه)`);
            }
        }
        
        return {
            period: `${days} روز گذشته`,
            totalErrors: periodErrors.length,
            avgMTTR: Math.round(avgMTTR * 10) / 10,
            byErrorCode,
            trend,
            recommendations
        };
    }
    
    static async getErrors(
        filters?: {
            errorCode?: string;
            operationName?: string;
            resolved?: boolean;
            startDate?: Date;
            endDate?: Date;
            limit?: number;
        }
    ): Promise<ErrorRecord[]> {
        let filtered = [...this.errors];
        
        if (filters?.errorCode) {
            filtered = filtered.filter(e => e.errorCode === filters.errorCode);
        }
        
        if (filters?.operationName) {
            filtered = filtered.filter(e => e.operationName === filters.operationName);
        }
        
        if (filters?.resolved !== undefined) {
            filtered = filtered.filter(e => e.resolved === filters.resolved);
        }
        
        if (filters?.startDate) {
            filtered = filtered.filter(e => e.timestamp >= filters.startDate!);
        }
        
        if (filters?.endDate) {
            filtered = filtered.filter(e => e.timestamp <= filters.endDate!);
        }
        
        const limit = filters?.limit || 100;
        return filtered.slice(0, limit);
    }
    
    static async clearOldRecords(daysToKeep: number = 30): Promise<number> {
        const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
        const initialLength = this.errors.length;
        
        this.errors = this.errors.filter(e => e.timestamp >= cutoffDate);
        
        const removedCount = initialLength - this.errors.length;
        console.log(`[HISTORY] Cleared ${removedCount} old records (keeping ${daysToKeep} days)`);
        
        return removedCount;
    }
    
    private static generateId(): string {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 9);
        return `err_${timestamp}_${random}`;
    }
}
