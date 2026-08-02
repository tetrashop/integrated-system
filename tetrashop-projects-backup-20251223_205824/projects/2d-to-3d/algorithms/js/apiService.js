import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://tetrashop-projects-alpha.vercel.app',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// مدیریت خطاهای سراسری
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // سلامت سرویس
  health: {
    check: () => apiClient.get('/api/health')
  },

  // محصولات
  products: {
    getAll: () => apiClient.get('/api/products'),
    getById: (id) => apiClient.get(`/api/products/${id}`)
  },

  // کاربران
  users: {
    getAll: () => apiClient.get('/api/users')
  },

  // احراز هویت (برای توسعه آینده)
  auth: {
    login: (credentials) => apiClient.post('/api/auth/login', credentials),
    register: (userData) => apiClient.post('/api/auth/register', userData)
  }
};

// هوک برای استفاده آسان از API
export const useApi = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const callApi = async (apiCall, options = {}) => {
    const { showLoading = true, handleError = true } = options;
    
    try {
      if (showLoading) setLoading(true);
      setError(null);
      
      const response = await apiCall();
      return response.data;
    } catch (err) {
      if (handleError) {
        const errorMessage = err.response?.data?.error || err.response?.data?.message || 'خطایی در ارتباط با سرور رخ داده است';
        setError(errorMessage);
      }
      throw err;
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { loading, error, callApi, clearError };
};
