// اصلاح شده با رفع خطاهای TypeScript - تعریف انواع و رفع خطاهای نوع‌دهی
import { useState, useEffect } from 'react';
import { 
  getStatusColor, 
  getStatusText, 
  formatDate, 
  formatResponseTime,
  AppError,
  mockServiceExecution 
} from './utils/testableLogic';

// تعریف انواع TypeScript
interface Service {
  id: string;
  name: string;
  category: string;
  isFavorite: boolean;
  status: string;
}

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: Date;
}

// کامپوننت App اصلی
function App() {
  // Stateهای ضروری
  const [apiKey, setApiKey] = useState<string>('apikey_user_free_123');
  const [services] = useState<Service[]>([
    { id: 'nlp-analyzer', name: 'تحلیلگر محتوا', category: 'NLP', isFavorite: true, status: 'active' },
    { id: 'vision-detector', name: 'تشخیص تصویر', category: 'بینایی کامپیوتر', isFavorite: false, status: 'active' },
    { id: 'audio-processor', name: 'پردازش صوت', category: 'پردازش صوت', isFavorite: true, status: 'active' },
    { id: 'data-analyzer', name: 'تحلیل داده', category: 'علم داده', isFavorite: false, status: 'active' },
    { id: 'text-summarizer', name: 'خلاصه‌ساز متن', category: 'NLP', isFavorite: true, status: 'active' },
    { id: 'sentiment-analyzer', name: 'تحلیل احساسات', category: 'NLP', isFavorite: false, status: 'active' },
    { id: 'object-detector', name: 'تشخیص اشیا', category: 'بینایی کامپیوتر', isFavorite: true, status: 'active' },
    { id: 'face-recognizer', name: 'تشخیص چهره', category: 'بینایی کامپیوتر', isFavorite: false, status: 'active' },
    { id: 'speech-to-text', name: 'صحبت به متن', category: 'پردازش صوت', isFavorite: true, status: 'active' },
    { id: 'text-to-speech', name: 'متن به صحبت', category: 'پردازش صوت', isFavorite: false, status: 'active' },
    { id: 'predictive-model', name: 'مدل پیش‌بینی', category: 'علم داده', isFavorite: true, status: 'active' },
    { id: 'anomaly-detector', name: 'تشخیص ناهنجاری', category: 'علم داده', isFavorite: false, status: 'active' },
    { id: 'language-translator', name: 'مترجم زبان', category: 'NLP', isFavorite: true, status: 'active' },
    { id: 'code-generator', name: 'تولیدکننده کد', category: 'NLP', isFavorite: false, status: 'active' },
    { id: 'image-enhancer', name: 'بهبود تصویر', category: 'بینایی کامپیوتر', isFavorite: true, status: 'active' },
    { id: 'noise-reducer', name: 'کاهش نویز', category: 'پردازش صوت', isFavorite: false, status: 'active' },
    { id: 'trend-analyzer', name: 'تحلیل روند', category: 'علم داده', isFavorite: true, status: 'active' },
    { id: 'pattern-finder', name: 'یابنده الگو', category: 'علم داده', isFavorite: false, status: 'active' },
    { id: 'text-classifier', name: 'دسته‌بند متن', category: 'NLP', isFavorite: true, status: 'active' },
    { id: 'gesture-recognizer', name: 'تشخیص حرکت', category: 'بینایی کامپیوتر', isFavorite: false, status: 'active' },
    { id: 'emotion-detector', name: 'تشخیص احساس', category: 'بینایی کامپیوتر', isFavorite: true, status: 'active' },
    { id: 'audio-enhancer', name: 'بهبود صدا', category: 'پردازش صوت', isFavorite: false, status: 'active' },
    { id: 'data-visualizer', name: 'مصورسازی داده', category: 'علم داده', isFavorite: true, status: 'active' },
    { id: 'speech-recognizer', name: 'تشخیص گفتار', category: 'پردازش صوت', isFavorite: false, status: 'active' },
    { id: 'text-generator', name: 'تولید متن', category: 'NLP', isFavorite: true, status: 'active' },
    { id: 'object-classifier', name: 'دسته‌بندی اشیا', category: 'بینایی کامپیوتر', isFavorite: false, status: 'active' }
  ]);

  const [scale, setScale] = useState<number>(4);
  const [autoStop, setAutoStop] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Stateهای اضافی که استفاده می‌شوند
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [executionHistory, setExecutionHistory] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<string>('name');
  const [activeTab, setActiveTab] = useState<string>('services');
  const [viewMode, setViewMode] = useState<string>('grid');

  // فیلتر سرویس‌ها بر اساس جستجو و دسته‌بندی
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.includes(searchQuery) || 
                         service.category.includes(searchQuery);
    const matchesCategory = selectedCategory === 'همه' || 
                           service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // دسته‌بندی‌های موجود
  const categories = ['همه', 'NLP', 'بینایی کامپیوتر', 'پردازش صوت', 'علم داده'];

  // مرتب‌سازی سرویس‌ها
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'category') return a.category.localeCompare(b.category);
    return 0;
  });

  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(sortedServices.length / itemsPerPage);
  const currentPage = 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = sortedServices.slice(startIndex, startIndex + itemsPerPage);

  // توابع کمکی
  const getServiceIcon = (category: string): string => {
    const icons: {[key: string]: string} = {
      'NLP': '📝',
      'بینایی کامپیوتر': '👁️',
      'پردازش صوت': '🎵',
      'علم داده': '📊'
    };
    return icons[category] || '☁️';
  };

  // توابع event handler
  const handleCheckConnection = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // شبیه‌سازی بررسی اتصال
      await new Promise(resolve => setTimeout(resolve, 1000));
      addNotification('اتصال Gateway برقرار است. وضعیت: آنلاین | پینگ: 42ms', 'success');
    } catch (error) {
      addNotification('خطا در برقراری اتصال Gateway. لطفاً تنظیمات شبکه را بررسی کنید.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScaleUp = (): void => {
    if (scale < 10) {
      setScale(scale + 1);
      addNotification(`مقیاس افزایش یافت. تعداد نمونه: ${scale + 1}`, 'success');
    }
  };

  const handleScaleDown = (): void => {
    if (scale > 1) {
      setScale(scale - 1);
      addNotification(`مقیاس کاهش یافت. تعداد نمونه: ${scale - 1}`, 'success');
    }
  };

  const toggleAutoStop = (): void => {
    setAutoStop(!autoStop);
    addNotification(`توقف اتوماتیک ${!autoStop ? 'فعال' : 'غیرفعال'} شد`, 'info');
  };

  const handleSaveApiKey = (): void => {
    addNotification('کلید API ذخیره شد', 'success');
  };

  const toggleFavorite = (serviceId: string): void => {
    // منطق toggle favorite
    console.log('Toggle favorite for:', serviceId);
  };

  const handleExecuteFromCard = async (serviceId: string): Promise<void> => {
    setIsLoading(true);
    try {
      // شبیه‌سازی اجرای سرویس
      await new Promise(resolve => setTimeout(resolve, 1500));
      addNotification(`سرویس ${serviceId} با موفقیت اجرا شد`, 'success');
    } catch (error) {
      addNotification(`خطا در اجرای سرویس ${serviceId}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number): void => {
    // منطق تغییر صفحه
    console.log('Change to page:', page);
  };

  // تابع اضافه کردن نوتیفیکیشن
  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info'): void => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    
    // حذف خودکار پس از 5 ثانیه
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  // حذف نوتیفیکیشن
  const removeNotification = (id: number): void => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // محاسبه آمار
  const successRate = 95.7;
  const responseTime = 142;
  const activeEnv = 'آماده';
  const cpuUsage = 24.5;
  const memoryUsage = 67.8;
  const networkUsage = 45.2;
  const successRateTrend = 100.0;

  // تعداد کل سرویس‌ها
  const totalServices = services.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-3 md:p-6" dir="rtl">
      {/* نوتیفیکیشن‌ها */}
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up ${
            notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
            notification.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          } border rounded-xl p-4 shadow-lg flex items-start gap-3`}
        >
          <svg 
            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
              notification.type === 'success' ? 'text-emerald-600' :
              notification.type === 'error' ? 'text-rose-600' :
              'text-blue-600'
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {notification.type === 'success' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : notification.type === 'error' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
          <p className="text-sm flex-1">{notification.message}</p>
          <button 
            onClick={() => removeNotification(notification.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      {/* هدر */}
      <header className="mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl md:rounded-2xl shadow-lg">
              <svg className="w-7 h-7 md:w-9 md:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                پلتفرم ابری TetraSaaS v2.3
              </h1>
              <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base flex flex-wrap items-center gap-1 md:gap-2">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
                    <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
                    <line x1="6" x2="6.01" y1="6" y2="6" />
                    <line x1="6" x2="6.01" y1="18" y2="18" />
                  </svg>
                  <span className="font-bold text-blue-600">
                    {totalServices} سرویس ابری
                  </span>
                </span>
                <span> | نرخ موفقیت: <strong>{successRate.toFixed(1)}%</strong></span>
                <span> | زمان پاسخ: <strong>{responseTime}ms</strong></span>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto mt-4 lg:mt-0">
            <div className="relative flex-1 lg:flex-initial min-w-[250px]">
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="7.5" cy="15.5" r="5.5" />
                  <path d="m21 2-9.6 9.6" />
                  <path d="m15.5 7.5 3 3L22 7l-3-3" />
                </svg>
              </span>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="کلید API خود را وارد کنید"
                className="pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-xl bg-white shadow-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
              />
            </div>
            
            <button
              onClick={handleSaveApiKey}
              className="px-4 md:px-5 py-2 md:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 shadow-md text-sm md:text-base"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              ذخیره
            </button>
            
            <button
              onClick={handleCheckConnection}
              disabled={isLoading}
              className="px-4 md:px-5 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 shadow-md text-sm md:text-base"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              {isLoading ? 'در حال بررسی...' : 'بررسی اتصال'}
            </button>
            
            <button
              onClick={() => addNotification('مستندات API در حال بارگذاری...', 'info')}
              className="px-4 md:px-5 py-2 md:py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 hover:border-blue-700 transition-all flex items-center gap-2 text-sm md:text-base"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              مستندات API
            </button>
          </div>
        </div>

        {/* آمار کلی */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-medium">محیط ابری فعال</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{activeEnv}</p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">وضعیت: {getStatusText('active')}</p>
              </div>
              <div className={`p-2 md:p-3 rounded-xl ${getStatusColor('active')} bg-opacity-10`}>
                <svg className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-medium">استفاده از CPU</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{cpuUsage}%</p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">24 هسته</p>
              </div>
              <div className="p-2 md:p-3 rounded-xl bg-blue-50">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-medium">استفاده از حافظه</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{memoryUsage}%</p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">128GB RAM</p>
              </div>
              <div className="p-2 md:p-3 rounded-xl bg-purple-50">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-medium">پهنای باند</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{networkUsage}%</p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">1Gbps شبکه</p>
              </div>
              <div className="p-2 md:p-3 rounded-xl bg-amber-50">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* بخش اصلی - سرویس‌ها */}
      <main>
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* سرویس‌ها */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">سرویس‌های ابری</h2>
                <p className="text-gray-600 text-sm md:text-base mt-1">مدیریت و اجرای سرویس‌های هوش مصنوعی</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleScaleUp}
                  className="px-3 md:px-4 py-1.5 md:py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-xs md:text-sm"
                >
                  افزایش مقیاس +
                </button>
                <button
                  onClick={handleScaleDown}
                  className="px-3 md:px-4 py-1.5 md:py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-xs md:text-sm"
                >
                  کاهش مقیاس -
                </button>
                <button
                  onClick={toggleAutoStop}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm ${
                    autoStop ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  توقف اتوماتیک
                </button>
              </div>
            </div>

            {/* کارت‌های سرویس */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {paginatedServices.map(service => (
                <div 
                  key={service.id}
                  className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                        <span className="text-white text-lg">{getServiceIcon(service.category)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm md:text-base">{service.name}</h3>
                        <p className="text-gray-600 text-xs md:text-sm">{service.category}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(service.id)}
                      className="text-gray-400 hover:text-yellow-500"
                    >
                      {service.isFavorite ? (
                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-xs md:text-sm mb-4">
                    سرویس پیشرفته {service.category} با قابلیت‌های متنوع
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      service.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {service.status === 'active' ? 'فعال' : 'غیرفعال'}
                    </span>
                    
                    <button
                      onClick={() => handleExecuteFromCard(service.id)}
                      disabled={isLoading}
                      className="px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-md transition-all text-xs md:text-sm"
                    >
                      {isLoading ? 'در حال اجرا...' : 'اجرا کنید'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* شماره کل سرویس‌ها در فوتر */}
            <div className="mt-6 text-center text-gray-600 text-sm">
              <p className="font-medium">
                نمایش {paginatedServices.length} از {totalServices} سرویس ابری
              </p>
              <p className="text-xs mt-1">
                آخرین سرویس اضافه شده: {services[services.length - 1]?.name || 'نامشخص'}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* فوتر */}
      <footer className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="font-bold text-base md:text-lg text-gray-900">
              پلتفرم ابری TetraSaaS v2.3
            </p>
            <p className="text-gray-600 text-xs md:text-sm">
              توسعه‌یافته با معیارهای مهندسی نرم‌افزار | مدیریت خطای پیشرفته
            </p>
            <p className="text-xs md:text-sm font-medium mt-2">
              آخرین بروزرسانی: {formatDate(new Date().toString())} | زمان پاسخ: {formatResponseTime(responseTime)}
            </p>
            <p className="text-xs md:text-sm font-bold text-blue-600 mt-1">
              مجموع سرویس‌های NLP: {services.filter(s => s.category === 'NLP').length} سرویس فعال
            </p>
          </div>
          <div className="text-xs md:text-sm text-gray-600">
            <p>© 2024 TetraSaaS Cloud Platform. تمام {totalServices} سرویس تحت نظارت کامل.</p>
            <p className="mt-1 font-medium">آخرین پست صفحه‌ی NLP تمام {services.filter(s => s.category === 'NLP').length} باشد مطلوب است</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
