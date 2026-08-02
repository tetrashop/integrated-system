// توابع کمکی برای App.tsx

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return 'bg-emerald-100 text-emerald-800';
    case 'inactive': return 'bg-gray-100 text-gray-800';
    case 'warning': return 'bg-amber-100 text-amber-800';
    case 'error': return 'bg-rose-100 text-rose-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'active': return 'فعال';
    case 'inactive': return 'غیرفعال';
    case 'warning': return 'هشدار';
    case 'error': return 'خطا';
    default: return 'نامشخص';
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatResponseTime = (time: number): string => {
  if (time < 100) return `${time}ms (عالی)`;
  if (time < 300) return `${time}ms (خوب)`;
  if (time < 500) return `${time}ms (متوسط)`;
  return `${time}ms (کند)`;
};

export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export const mockServiceExecution = async (serviceId: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        serviceId,
        timestamp: new Date().toISOString(),
        result: 'اجرای موفقیت‌آمیز'
      });
    }, 1000);
  });
};
