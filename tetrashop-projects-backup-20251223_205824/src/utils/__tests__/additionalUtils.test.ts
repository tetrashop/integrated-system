// تست‌های اضافی برای توابع کمکی

// تابع نمونه برای تست - اگر توابع دیگری دارید، اینجا اضافه کنید
const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};

const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

describe('Additional Utility Functions', () => {
  describe('formatNumber', () => {
    test('formats numbers less than 1000', () => {
      expect(formatNumber(500)).toBe('500');
      expect(formatNumber(999)).toBe('999');
      expect(formatNumber(0)).toBe('0');
    });

    test('formats numbers 1000 and above', () => {
      expect(formatNumber(1000)).toBe('1.0k');
      expect(formatNumber(1500)).toBe('1.5k');
      expect(formatNumber(9999)).toBe('10.0k');
    });

    test('handles decimal numbers', () => {
      expect(formatNumber(1234)).toBe('1.2k');
    });
  });

  describe('capitalizeFirstLetter', () => {
    test('capitalizes first letter of string', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello');
      expect(capitalizeFirstLetter('world')).toBe('World');
      expect(capitalizeFirstLetter('test')).toBe('Test');
    });

    test('handles empty string', () => {
      expect(capitalizeFirstLetter('')).toBe('');
    });

    test('handles single character', () => {
      expect(capitalizeFirstLetter('a')).toBe('A');
      expect(capitalizeFirstLetter('z')).toBe('Z');
    });

    test('does not change already capitalized string', () => {
      expect(capitalizeFirstLetter('Hello')).toBe('Hello');
      expect(capitalizeFirstLetter('TEST')).toBe('TEST');
    });
  });
});
