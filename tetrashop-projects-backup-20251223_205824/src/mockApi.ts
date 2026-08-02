// فایل شبیه‌سازی API برای TetraSaaS Dashboard

export interface MockApiResponse {
  success: boolean
  data?: any
  error?: string
  timestamp: string
  requestId: string
}

export interface ServiceStatus {
  id: number
  name: string
  status: 'active' | 'inactive' | 'degraded'
  uptime: number
  responseTime: number
  lastCheck: string
}

export interface UsageStats {
  dailyRequests: number
  weeklyRequests: number
  monthlyRequests: number
  topServices: Array<{
    id: number
    name: string
    requests: number
  }>
  errorRate: number
}

// شبیه‌سازی Gateway Health Check
export const checkGatewayHealth = async (): Promise<MockApiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const isHealthy = Math.random() > 0.1;
  
  if (!isHealthy) {
    return {
      success: false,
      error: 'Gateway connection timeout',
      timestamp: new Date().toISOString(),
      requestId: `HEALTH-${Date.now()}`
    };
  }
  
  return {
    success: true,
    data: {
      status: 'healthy',
      version: '2.4.1',
      uptime: Math.floor(Math.random() * 1000000),
      services: 23,
      activeConnections: Math.floor(Math.random() * 1000) + 100,
      memoryUsage: Math.floor(Math.random() * 30) + 50,
      cpuUsage: Math.floor(Math.random() * 40) + 20,
      timestamp: new Date().toISOString()
    },
    timestamp: new Date().toISOString(),
    requestId: `HEALTH-${Date.now()}`
  };
};

// شبیه‌سازی اجرای سرویس
export const executeService = async (
  serviceId: number, 
  params: any
): Promise<MockApiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 1000));
  
  const isSuccess = Math.random() > 0.15;
  
  if (!isSuccess) {
    const errors = [
      'Service timeout',
      'Invalid parameters',
      'Rate limit exceeded',
      'Internal server error',
      'Authentication failed'
    ];
    
    return {
      success: false,
      error: errors[Math.floor(Math.random() * errors.length)],
      timestamp: new Date().toISOString(),
      requestId: `EXEC-${Date.now()}-${serviceId}`
    };
  }
  
  // تولید داده‌های شبیه‌سازی شده بر اساس نوع سرویس
  let mockData: any;
  
  switch (serviceId) {
    case 1: // NLP
      mockData = {
        text: params.text || 'متن تستی',
        analysis: {
          sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
          confidence: (Math.random() * 0.3 + 0.7).toFixed(2),
          entities: ['ایران', 'هوش مصنوعی', 'برنامه‌نویسی'].slice(0, Math.floor(Math.random() * 3) + 1),
          topics: ['فناوری', 'برنامه‌نویسی', 'زبان فارسی'],
          wordCount: Math.floor(Math.random() * 500) + 100
        }
      };
      break;
      
    case 2: // حل فرمول
      mockData = {
        formula: params.formula || 'x^2 + 2x + 1',
        variables: params.variables || { x: 5 },
        result: Math.floor(Math.random() * 1000) + 100,
        steps: [
          'تبدیل فرمول به ساختار درختی',
          'محاسبه متغیرها',
          'اجرای عملیات ریاضی',
          'بررسی صحت نتیجه'
        ]
      };
      break;
      
    case 3: // نویسنده هوشمند
      mockData = {
        prompt: params.prompt || 'مقاله درباره هوش مصنوعی',
        generatedText: `این یک متن تولید شده توسط هوش مصنوعی است. ${'متن تستی '.repeat(10)}`,
        length: params.length || 'medium',
        language: 'fa',
        readabilityScore: Math.floor(Math.random() * 100),
        uniqueness: (Math.random() * 0.5 + 0.5).toFixed(2)
      };
      break;
      
    default:
      mockData = {
        serviceId,
        params,
        processed: true,
        executionTime: `${Math.floor(Math.random() * 500) + 100}ms`,
        resultId: `RES-${Date.now()}`,
        metadata: {
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          processedBy: 'mock-processor'
        }
      };
  }
  
  return {
    success: true,
    data: mockData,
    timestamp: new Date().toISOString(),
    requestId: `EXEC-${Date.now()}-${serviceId}`
  };
};

// شبیه‌سازی دریافت آمار سرویس‌ها
export const getServicesStatus = async (): Promise<MockApiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const services: ServiceStatus[] = Array.from({ length: 23 }, (_, i) => ({
    id: i + 1,
    name: `Service ${i + 1}`,
    status: Math.random() > 0.9 ? 'inactive' : Math.random() > 0.8 ? 'degraded' : 'active',
    uptime: Math.floor(Math.random() * 20) + 80,
    responseTime: Math.floor(Math.random() * 500) + 50,
    lastCheck: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString()
  }));
  
  return {
    success: true,
    data: { services },
    timestamp: new Date().toISOString(),
    requestId: `STATUS-${Date.now()}`
  };
};

// شبیه‌سازی دریافت آمار استفاده
export const getUsageStats = async (): Promise<MockApiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const stats: UsageStats = {
    dailyRequests: Math.floor(Math.random() * 500) + 200,
    weeklyRequests: Math.floor(Math.random() * 3000) + 1000,
    monthlyRequests: Math.floor(Math.random() * 15000) + 5000,
    topServices: Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `Service ${i + 1}`,
      requests: Math.floor(Math.random() * 1000) + 500
    })),
    errorRate: Math.random() * 5
  };
  
  return {
    success: true,
    data: stats,
    timestamp: new Date().toISOString(),
    requestId: `USAGE-${Date.now()}`
  };
};

// شبیه‌سازی لاگ‌های اخیر
export const getRecentLogs = async (limit: number = 10): Promise<MockApiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const logLevels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
  const services = Array.from({ length: 23 }, (_, i) => `Service ${i + 1}`);
  
  const logs = Array.from({ length: limit }, (_, i) => ({
    id: `LOG-${Date.now()}-${i}`,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
    service: services[Math.floor(Math.random() * services.length)],
    level: logLevels[Math.floor(Math.random() * logLevels.length)],
    message: `Log message ${i + 1} - ${Math.random().toString(36).substring(7)}`,
    duration: Math.floor(Math.random() * 1000) + 100
  }));
  
  return {
    success: true,
    data: { logs },
    timestamp: new Date().toISOString(),
    requestId: `LOGS-${Date.now()}`
  };
};

// شبیه‌سازی اعتبارسنجی API Key
export const validateApiKey = async (apiKey: string): Promise<MockApiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const isValid = apiKey.startsWith('apikey_');
  
  if (!isValid) {
    return {
      success: false,
      error: 'Invalid API key format',
      timestamp: new Date().toISOString(),
      requestId: `AUTH-${Date.now()}`
    };
  }
  
  return {
    success: true,
    data: {
      valid: true,
      keyType: apiKey.includes('_free_') ? 'free' : apiKey.includes('_pro_') ? 'pro' : 'enterprise',
      remainingRequests: Math.floor(Math.random() * 1000) + 100,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      permissions: ['read', 'execute', 'stats']
    },
    timestamp: new Date().toISOString(),
    requestId: `AUTH-${Date.now()}`
  };
};
