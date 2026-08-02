import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://tetrashop-projects-alpha.vercel.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// محصولات نمونه مطابق با API واقعی
const sampleProducts = [
  {
    id: 1,
    name: 'لپ‌تاپ گیمینگ',
    price: 25000000,
    category: 'الکترونیک',
    stock: 15,
    featured: true,
    description: 'لپ‌تاپ گیمینگ با کارایی بالا'
  },
  {
    id: 2,
    name: 'هدفون بی‌سیم', 
    price: 3500000,
    category: 'صوتی',
    stock: 30,
    featured: true,
    description: 'هدفون با کیفیت صدای عالی'
  },
  {
    id: 3,
    name: 'کتاب برنامه‌نویسی',
    price: 450000,
    category: 'کتاب',
    stock: 100,
    featured: false,
    description: 'کتاب جامع آموزش برنامه‌نویسی'
  }
];

export const apiService = {
  // سلامت سرویس
  health: {
    check: () => apiClient.get('/api/health')
  },

  // محصولات - استفاده از داده‌های نمونه تا زمانی که API کامل شود
  products: {
    getAll: async () => {
      try {
        // اول سعی می‌کنیم از API واقعی بگیریم
        const response = await apiClient.get('/api/products');
        return response;
      } catch (error) {
        // اگر API خطا داد، از داده‌های نمونه استفاده می‌کنیم
        console.log('Using sample products data');
        return {
          data: {
            success: true,
            data: {
              products: sampleProducts,
              count: sampleProducts.length
            }
          }
        };
      }
    }
  },

  // کاربران
  users: {
    getAll: () => apiClient.get('/api/users')
  },

  // احراز هویت (شبیه‌سازی شده)
  auth: {
    login: (credentials) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              success: true,
              data: {
                user: {
                  id: 1,
                  name: 'کاربر تست',
                  email: credentials.email
                },
                token: 'mock-jwt-token-' + Date.now()
              }
            }
          });
        }, 1000);
      });
    },
    
    register: (userData) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              success: true,
              data: {
                user: {
                  id: Date.now(),
                  name: userData.name,
                  email: userData.email
                },
                token: 'mock-jwt-token-' + Date.now()
              }
            }
          });
        }, 1000);
      });
    }
  }
};
