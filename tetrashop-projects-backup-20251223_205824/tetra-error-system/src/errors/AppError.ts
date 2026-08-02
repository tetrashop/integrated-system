// فایل: src/errors/AppError.ts
// کلاس‌های خطای اصلی سیستم

export interface ErrorContext {
    originalError?: any;
    userId?: string;
    requestId?: string;
    operationName?: string;
    timestamp?: string;
    [key: string]: any;
}

export class AppError extends Error {
    public readonly context?: ErrorContext;
    public readonly timestamp: Date;
    
    constructor(
        public readonly code: string,
        message: string,
        context?: ErrorContext
    ) {
        super(message);
        this.name = 'AppError';
        this.context = context;
        this.timestamp = new Date();
        
        // حفظ stack trace اصلی
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }
    
    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            context: this.context,
            timestamp: this.timestamp.toISOString(),
            stack: this.stack
        };
    }
    
    toString() {
        return `[${this.code}] ${this.message} (${this.timestamp.toISOString()})`;
    }
}

// خطاهای اعتبارسنجی
export class ValidationError extends AppError {
    constructor(message: string, public field: string, context?: ErrorContext) {
        super('VALIDATION_FAILED', `Validation error in ${field}: ${message}`, {
            ...context,
            field
        });
        this.name = 'ValidationError';
    }
}

// خطاهای پایگاه داده
export class DatabaseError extends AppError {
    constructor(operation: string, originalError?: any, context?: ErrorContext) {
        super('DATABASE_ERROR', `DB operation '${operation}' failed`, {
            ...context,
            operation,
            originalError
        });
        this.name = 'DatabaseError';
    }
}

// خطاهای شبکه و ارتباطات خارجی
export class NetworkError extends AppError {
    constructor(
        service: string,
        public readonly statusCode?: number,
        originalError?: any,
        context?: ErrorContext
    ) {
        const message = statusCode 
            ? `Network error calling ${service}: HTTP ${statusCode}`
            : `Network error calling ${service}`;
            
        super('NETWORK_ERROR', message, {
            ...context,
            service,
            statusCode,
            originalError
        });
        this.name = 'NetworkError';
    }
}

// خطاهای مجوز و احراز هویت
export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication failed', context?: ErrorContext) {
        super('AUTHENTICATION_FAILED', message, context);
        this.name = 'AuthenticationError';
    }
}

export class AuthorizationError extends AppError {
    constructor(
        resource: string,
        action: string,
        userId?: string,
        context?: ErrorContext
    ) {
        super('AUTHORIZATION_FAILED', 
            `User ${userId || 'unknown'} not authorized to ${action} ${resource}`,
            { ...context, resource, action, userId }
        );
        this.name = 'AuthorizationError';
    }
}

// خطاهای پرداخت
export class PaymentError extends AppError {
    constructor(
        gateway: string,
        public readonly transactionId?: string,
        originalError?: any,
        context?: ErrorContext
    ) {
        super('PAYMENT_FAILED', `Payment via ${gateway} failed`, {
            ...context,
            gateway,
            transactionId,
            originalError
        });
        this.name = 'PaymentError';
    }
}

// خطاهای منطق کسب‌وکار
export class BusinessLogicError extends AppError {
    constructor(
        rule: string,
        message: string,
        context?: ErrorContext
    ) {
        super('BUSINESS_LOGIC_ERROR', `Business rule violation [${rule}]: ${message}`, {
            ...context,
            rule
        });
        this.name = 'BusinessLogicError';
    }
}

// خطاهای منابع
export class ResourceNotFoundError extends AppError {
    constructor(
        resourceType: string,
        resourceId: string | number,
        context?: ErrorContext
    ) {
        super('RESOURCE_NOT_FOUND', 
            `${resourceType} with ID ${resourceId} not found`,
            { ...context, resourceType, resourceId }
        );
        this.name = 'ResourceNotFoundError';
    }
}

export class ResourceConflictError extends AppError {
    constructor(
        resourceType: string,
        conflictDetails: string,
        context?: ErrorContext
    ) {
        super('RESOURCE_CONFLICT', 
            `${resourceType} conflict: ${conflictDetails}`,
            { ...context, resourceType, conflictDetails }
        );
        this.name = 'ResourceConflictError';
    }
}

// خطاهای محدودیت نرخ
export class RateLimitError extends AppError {
    constructor(
        limit: number,
        window: string,
        retryAfter?: number,
        context?: ErrorContext
    ) {
        const message = `Rate limit exceeded: ${limit} requests per ${window}`;
        super('RATE_LIMIT_EXCEEDED', message, {
            ...context,
            limit,
            window,
            retryAfter
        });
        this.name = 'RateLimitError';
    }
}

// Utility function for creating custom errors
export function createError(
    code: string,
    message: string,
    context?: ErrorContext
): AppError {
    return new AppError(code, message, context);
}

// Type guard for AppError
export function isAppError(error: any): error is AppError {
    return error instanceof AppError;
}
