import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock fetch
global.fetch = jest.fn();

describe('App Comprehensive Tests - Final', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    // Mock successful connection
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 'connected', ping: 42 })
    });
  });

  test('API key input can be changed', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const apiInput = screen.getByPlaceholderText(/کلید API/i);
    
    await user.clear(apiInput);
    expect(apiInput).toHaveValue('');
    
    await user.type(apiInput, 'new_test_key');
    expect(apiInput).toHaveValue('new_test_key');
  });

  test('connection check shows some notification', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const checkButton = screen.getByRole('button', { name: /بررسی اتصال/i });
    await user.click(checkButton);
    
    // Wait for any notification to appear
    await waitFor(() => {
      const notification = document.querySelector('[class*="animate-slide-up"]');
      expect(notification).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('scale buttons trigger notifications', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Scale up
    const scaleUpButton = screen.getByRole('button', { name: /افزایش مقیاس \+/i });
    await user.click(scaleUpButton);
    
    await waitFor(() => {
      const notification = document.querySelector('[class*="animate-slide-up"]');
      expect(notification).toBeInTheDocument();
      expect(notification?.textContent).toMatch(/مقیاس|scale/i);
    }, { timeout: 2000 });
    
    // Close notification
    const closeButton = document.querySelector('[class*="text-gray-400"]');
    if (closeButton) {
      await user.click(closeButton);
    }
    
    // Scale down
    const scaleDownButton = screen.getByRole('button', { name: /کاهش مقیاس -/i });
    await user.click(scaleDownButton);
    
    await waitFor(() => {
      const notification = document.querySelector('[class*="animate-slide-up"]');
      expect(notification).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('all required elements exist', () => {
    render(<App />);
    
    // API section
    expect(screen.getByPlaceholderText(/کلید API/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /بررسی اتصال/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /مستندات API/i })).toBeInTheDocument();
    
    // Stats
    expect(screen.getByText(/سرویس ابری/i)).toBeInTheDocument();
    expect(screen.getByText(/نرخ موفقیت/i)).toBeInTheDocument();
    expect(screen.getByText(/زمان پاسخ/i)).toBeInTheDocument();
    
    // Scale buttons
    expect(screen.getByText(/افزایش مقیاس \+/i)).toBeInTheDocument();
    expect(screen.getByText(/کاهش مقیاس -/i)).toBeInTheDocument();
    expect(screen.getByText(/توقف اتوماتیک/i)).toBeInTheDocument();
    
    // Footer
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
