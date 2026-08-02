// فایل: src/server.ts
// سرور HTTP کامل برای سیستم مدیریت خطا

import express from 'express';
import { MonitoringService } from './services/MonitoringService';
import { ErrorHistoryService } from './services/ErrorHistoryService';
import { getUserById } from './services/UserService';
import { executeWithErrorHandling } from './services/ErrorHandlerService';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request tracking middleware
app.use((req, res, next) => {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    (req as any).requestId = requestId;
    res.setHeader('X-Request-ID', requestId);
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} [ID: ${requestId}]`);
    next();
});

// Initialize monitoring
MonitoringService.init();

// ==================== Routes ====================

// Health check
app.get('/health', async (req, res) => {
    const health = await MonitoringService.healthCheck();
    res.json({
        ...health,
        service: 'tetra-error-system',
        version: '2.0.0',
        uptime: process.uptime()
    });
});

// Metrics endpoint (Prometheus format)
app.get('/metrics', async (req, res) => {
    try {
        const metrics = await MonitoringService.getMetrics();
        res.set('Content-Type', 'text/plain');
        res.send(metrics);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get metrics' });
    }
});

// Error reports
app.get('/api/errors/report', async (req, res) => {
    try {
        const timeframe = (req.query.timeframe as '24h' | '7d' | '30d') || '24h';
        const report = await MonitoringService.getErrorReport(timeframe);
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate error report' });
    }
});

// Historical data
app.get('/api/errors/history', async (req, res) => {
    try {
        const filters: any = {};
        
        if (req.query.errorCode) filters.errorCode = req.query.errorCode as string;
        if (req.query.operationName) filters.operationName = req.query.operationName as string;
        if (req.query.resolved) filters.resolved = req.query.resolved === 'true';
        if (req.query.limit) filters.limit = parseInt(req.query.limit as string);
        
        const errors = await ErrorHistoryService.getErrors(filters);
        res.json({
            count: errors.length,
            errors
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get error history' });
    }
});

// MTTR analysis
app.get('/api/analytics/mttr', async (req, res) => {
    try {
        const days = req.query.days ? parseInt(req.query.days as string) : 7;
        const analysis = await ErrorHistoryService.getMTTRAnalysis(days);
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: 'Failed to analyze MTTR' });
    }
});

// Test endpoints
app.get('/api/test/:userId', async (req, res) => {
    const result = await getUserById(req.params.userId);
    
    if (result.success) {
        res.json({
            success: true,
            data: result.data,
            metrics: result.metrics
        });
    } else {
        res.status(400).json({
            success: false,
            error: {
                code: result.error!.code,
                message: result.error!.message
            },
            metrics: result.metrics
        });
    }
});

// Simulate error endpoint
app.post('/api/errors/simulate', async (req, res) => {
    const { errorType, operationName, userId, serviceTier } = req.body;
    
    const result = await executeWithErrorHandling(
        async () => {
            // Simulate different error types
            if (errorType === 'validation') {
                throw new Error('Simulated validation error');
            } else if (errorType === 'database') {
                throw new Error('Simulated database connection error');
            } else if (errorType === 'network') {
                throw new Error('Simulated network timeout');
            } else {
                throw new Error('Unknown simulated error');
            }
        },
        operationName || 'simulatedOperation',
        { userId, serviceTier }
    );
    
    res.json(result);
});

// Clear old records
app.delete('/api/errors/cleanup', async (req, res) => {
    try {
        const daysToKeep = req.query.days ? parseInt(req.query.days as string) : 30;
        const removed = await ErrorHistoryService.clearOldRecords(daysToKeep);
        
        res.json({
            success: true,
            removedCount: removed,
            message: `Cleared ${removed} records older than ${daysToKeep} days`
        });
    } catch (error) {
        res.status(500).json({ error: 'Cleanup failed' });
    }
});

// Error statistics
app.get('/api/errors/stats', async (req, res) => {
    try {
        const errorCode = req.query.errorCode as string | undefined;
        const operation = req.query.operation as string | undefined;
        
        const stats = await ErrorHistoryService.getErrorStats(errorCode, operation);
        
        res.json({
            ...stats,
            currentTime: new Date().toISOString(),
            systemHealth: await MonitoringService.healthCheck()
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'NOT_FOUND',
        message: `Route ${req.method} ${req.path} not found`,
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
    });
});

// Error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', error);
    
    MonitoringService.reportError({
        level: 'ERROR',
        message: 'Unhandled application error',
        timestamp: new Date().toISOString(),
        error: {
            code: 'UNHANDLED_ERROR',
            message: error.message,
            stack: error.stack
        },
        metadata: {
            path: req.path,
            method: req.method,
            requestId: (req as any).requestId,
            environment: process.env.NODE_ENV || 'development'
        },
        prediction: {
            score: 0.8,
            confidence: 0.9,
            recommendations: ['بررسی فوری خطای کنترل نشده'],
            estimatedMTTR: 60
        }
    });
    
    res.status(500).json({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Tetra Error System running on port ${PORT}`);
    console.log(`📊 Metrics: http://localhost:${PORT}/metrics`);
    console.log(`🩺 Health: http://localhost:${PORT}/health`);
    console.log(`📈 Reports: http://localhost:${PORT}/api/errors/report`);
    console.log(`🧪 Test: http://localhost:${PORT}/api/test/123`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

export { app };
