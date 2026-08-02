import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    // صرفاً بررسی می‌کنیم که صفحه رندر می‌شود
    expect(document.body).toBeInTheDocument();
  });

  test('contains platform title', () => {
    render(<App />);
    // بررسی وجود هر متنی که شامل TetraSaaS باشد
    const tetraElements = screen.getAllByText(/TetraSaaS/i);
    expect(tetraElements.length).toBeGreaterThan(0);
  });

  test('has API input field', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/کلید API/i);
    expect(input).toBeInTheDocument();
  });

  test('has connection check button', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /بررسی اتصال/i });
    expect(button).toBeInTheDocument();
  });

  test('shows service count', () => {
    render(<App />);
    // فقط بررسی می‌کنیم که متن "سرویس ابری" وجود دارد
    const serviceText = screen.getByText(/سرویس ابری/i);
    expect(serviceText).toBeInTheDocument();
  });

  test('has footer section', () => {
    render(<App />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  test('displays at least one metric', () => {
    render(<App />);
    // بررسی وجود حداقل یک عدد (متریک)
    const numbers = screen.getAllByText(/\d+(\.\d+)?/);
    expect(numbers.length).toBeGreaterThan(0);
  });
});
