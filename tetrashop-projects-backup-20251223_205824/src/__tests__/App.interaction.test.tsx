import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock برای توابع fetch
global.fetch = jest.fn();

describe('App Interaction Tests - Realistic', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  test('API key input can be changed', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const apiInput = screen.getByPlaceholderText(/کلید API/i);
    
    // تغییر مقدار
    await user.clear(apiInput);
    await user.type(apiInput, 'new_test_api_key_456');
    
    expect(apiInput).toHaveValue('new_test_api_key_456');
  });

  test('connection check button shows success notification', async () => {
    const user = userEvent.setup();
    
    // Mock successful response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        status: 'connected', 
        ping: 42,
        message: 'اتصال برقرار است'
      })
    });

    render(<App />);
    
    const checkButton = screen.getByRole('button', { name: /بررسی اتصال/i });
    
    await user.click(checkButton);
    
    // بررسی نمایش نوتیفیکیشن موفقیت
    await waitFor(() => {
      expect(screen.getByText(/اتصال Gateway برقرار است/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('scale up button shows notification', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // دکمه افزایش مقیاس
    const scaleUpButton = screen.getByRole('button', { name: /افزایش مقیاس \+/i });
    
    await user.click(scaleUpButton);
    
    // بررسی نمایش نوتیفیکیشن
    await waitFor(() => {
      expect(screen.getByText(/مقیاس افزایش یافت/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('scale down button shows notification', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // دکمه کاهش مقیاس
    const scaleDownButton = screen.getByRole('button', { name: /کاهش مقیاس -/i });
    
    await user.click(scaleDownButton);
    
    // بررسی نمایش نوتیفیکیشن
    await waitFor(() => {
      expect(screen.getByText(/مقیاس کاهش یافت/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('auto stop button toggles state', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const autoStopButton = screen.getByRole('button', { name: /توقف اتوماتیک/i });
    
    // ذخیره کلاس اولیه
    const initialClass = autoStopButton.className;
    
    // کلیک برای فعال کردن
    await user.click(autoStopButton);
    
    // بررسی تغییر کلاس (state)
    await waitFor(() => {
      expect(autoStopButton.className).not.toBe(initialClass);
    }, { timeout: 1000 });
    
    // کلیک مجدد برای غیرفعال کردن
    await user.click(autoStopButton);
  });

  test('API documentation button exists', async () => {
    render(<App />);
    
    const docsButton = screen.getByRole('button', { name: /مستندات API/i });
    expect(docsButton).toBeInTheDocument();
  });

  test('notification can be closed', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // ابتدا یک نوتیفیکیشن ایجاد می‌کنیم
    const scaleUpButton = screen.getByRole('button', { name: /افزایش مقیاس \+/i });
    await user.click(scaleUpButton);
    
    // صبر برای نمایش نوتیفیکیشن
    await waitFor(() => {
      expect(screen.getByText(/مقیاس افزایش یافت/i)).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // پیدا کردن دکمه بستن نوتیفیکیشن
    const closeButtons = document.querySelectorAll('[class*="text-gray-400"]');
    
    if (closeButtons.length > 0) {
      await user.click(closeButtons[0]);
      
      // بررسی بسته شدن نوتیفیکیشن
      await waitFor(() => {
        expect(screen.queryByText(/مقیاس افزایش یافت/i)).not.toBeInTheDocument();
      }, { timeout: 2000 });
    }
  });

  test('page has interactive elements', () => {
    render(<App />);
    
    // بررسی وجود عناصر تعاملی
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(3); // حداقل 4 دکمه
    
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
    
    // بررسی وجود آیکون‌ها
    const icons = document.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(5);
  });
});
