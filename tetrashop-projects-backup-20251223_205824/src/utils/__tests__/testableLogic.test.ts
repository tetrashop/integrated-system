import { 
  getStatusColor, 
  getStatusText, 
  formatDate, 
  formatResponseTime,
  AppError,
  mockServiceExecution 
} from '../testableLogic';

describe('testableLogic', () => {
  describe('getStatusColor', () => {
    it('should return correct color for active status', () => {
      expect(getStatusColor('active')).toBe('bg-emerald-100 text-emerald-800');
    });

    it('should return correct color for inactive status', () => {
      expect(getStatusColor('inactive')).toBe('bg-gray-100 text-gray-800');
    });

    it('should return correct color for warning status', () => {
      expect(getStatusColor('warning')).toBe('bg-amber-100 text-amber-800');
    });

    it('should return correct color for error status', () => {
      expect(getStatusColor('error')).toBe('bg-rose-100 text-rose-800');
    });

    it('should return default color for unknown status', () => {
      expect(getStatusColor('unknown')).toBe('bg-gray-100 text-gray-800');
    });
  });

  describe('getStatusText', () => {
    it('should return correct text for active status', () => {
      expect(getStatusText('active')).toBe('فعال');
    });

    it('should return correct text for inactive status', () => {
      expect(getStatusText('inactive')).toBe('غیرفعال');
    });

    it('should return correct text for warning status', () => {
      expect(getStatusText('warning')).toBe('هشدار');
    });

    it('should return correct text for error status', () => {
      expect(getStatusText('error')).toBe('خطا');
    });

    it('should return default text for unknown status', () => {
      expect(getStatusText('unknown')).toBe('نامشخص');
    });
  });

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const date = '2024-01-15T10:30:00Z';
      const formatted = formatDate(date);
      expect(formatted).toContain('۱۴۰۲');
    });

    it('should handle current date', () => {
      const currentDate = new Date().toISOString();
      const formatted = formatDate(currentDate);
      expect(formatted).toBeDefined();
    });
  });

  describe('formatResponseTime', () => {
    it('should format fast response time as excellent', () => {
      expect(formatResponseTime(50)).toBe('50ms (عالی)');
    });

    it('should format medium response time as good', () => {
      expect(formatResponseTime(150)).toBe('150ms (خوب)');
    });

    it('should format slow response time as average', () => {
      expect(formatResponseTime(350)).toBe('350ms (متوسط)');
    });

    it('should format very slow response time as slow', () => {
      expect(formatResponseTime(600)).toBe('600ms (کند)');
    });
  });

  describe('AppError', () => {
    it('should create an AppError with correct message and name', () => {
      const error = new AppError('Test error message');
      expect(error.message).toBe('Test error message');
      expect(error.name).toBe('AppError');
      expect(error).toBeInstanceOf(Error);
    });

    it('should be throwable', () => {
      expect(() => {
        throw new AppError('Error thrown');
      }).toThrow('Error thrown');
    });
  });

  describe('mockServiceExecution', () => {
    it('should resolve with success after timeout', async () => {
      const result = await mockServiceExecution('test-service');
      expect(result.success).toBe(true);
      expect(result.serviceId).toBe('test-service');
      expect(result.result).toBe('اجرای موفقیت‌آمیز');
      expect(result.timestamp).toBeDefined();
    });

    it('should resolve within reasonable time', async () => {
      const startTime = Date.now();
      await mockServiceExecution('test-service');
      const endTime = Date.now();
      expect(endTime - startTime).toBeGreaterThanOrEqual(900);
      expect(endTime - startTime).toBeLessThan(2000);
    });
  });
});
