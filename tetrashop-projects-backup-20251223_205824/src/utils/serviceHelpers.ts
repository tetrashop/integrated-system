// ابزارهای کمکی برای مدیریت سرویس‌ها

// تعریف نوع Service اینجا
interface Service {
  id: number
  name: string
  description: string
  status: 'active' | 'inactive'
  endpoint: string
  category: string
  icon: string
  usageCount: number
  lastUsed: string
}

// ذخیره‌سازی در localStorage
export const STORAGE_KEYS = {
  FAVORITES: 'tetrasaas_favorites',
  API_KEY: 'tetrasaas_api_key',
  THEME: 'tetrasaas_theme',
  RECENT_SERVICES: 'tetrasaas_recent_services'
};

// مدیریت علاقه‌مندی‌ها
export const favoritesManager = {
  get(): number[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  set(favorites: number[]): void {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  },

  toggle(serviceId: number): number[] {
    const current = this.get();
    const updated = current.includes(serviceId)
      ? current.filter(id => id !== serviceId)
      : [...current, serviceId];
    this.set(updated);
    return updated;
  },

  isFavorite(serviceId: number): boolean {
    return this.get().includes(serviceId);
  }
};

// مدیریت سرویس‌های اخیر
export const recentServicesManager = {
  get(): number[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RECENT_SERVICES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  add(serviceId: number): void {
    const current = this.get();
    const updated = [serviceId, ...current.filter(id => id !== serviceId)].slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.RECENT_SERVICES, JSON.stringify(updated));
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.RECENT_SERVICES);
  }
};

// فیلتر و جستجوی سرویس‌ها
export const serviceFilter = {
  byName(services: Service[], query: string): Service[] {
    if (!query.trim()) return services;
    
    const lowerQuery = query.toLowerCase();
    return services.filter(service =>
      service.name.toLowerCase().includes(lowerQuery) ||
      service.description.toLowerCase().includes(lowerQuery) ||
      service.category.toLowerCase().includes(lowerQuery)
    );
  },

  byCategory(services: Service[], category: string): Service[] {
    if (category === 'همه') return services;
    return services.filter(service => service.category === category);
  },

  byStatus(services: Service[], status: 'active' | 'inactive' | 'all'): Service[] {
    if (status === 'all') return services;
    return services.filter(service => service.status === status);
  },

  sort(services: Service[], sortBy: 'name' | 'usage' | 'recent'): Service[] {
    const sorted = [...services];
    
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
        
      case 'usage':
        return sorted.sort((a, b) => b.usageCount - a.usageCount);
        
      case 'recent':
        return sorted.sort((a, b) => 
          new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
        );
        
      default:
        return sorted;
    }
  }
};

// تولید داده‌های تست
export const generateMockServices = (count: number = 23): Service[] => {
  const categories = ['ai', 'compute', 'security', 'network', 'system', 'media', 'graphics', 'development', 'science'];
  const icons = ['brain', 'cpu', 'lock', 'wifi', 'server', 'database', 'code', 'palette', 'eye'];
  
  return Array.from({ length: count }, (_, i) => {
    const category = categories[i % categories.length];
    const icon = icons[i % icons.length];
    
    return {
      id: i + 1,
      name: `سرویس ${i + 1}`,
      description: `توضیحات نمونه برای سرویس ${i + 1}`,
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      endpoint: `/api/${category}/service-${i + 1}`,
      category,
      icon,
      usageCount: Math.floor(Math.random() * 2000),
      lastUsed: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
    };
  });
};

// فرمت‌دهی اعداد
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fa-IR').format(num);
};

// فرمت‌دهی تاریخ
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) {
    return `${diffMins} دقیقه پیش`;
  } else if (diffHours < 24) {
    return `${diffHours} ساعت پیش`;
  } else if (diffDays < 7) {
    return `${diffDays} روز پیش`;
  } else {
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};

// محاسبه آمار
export const calculateStats = (services: Service[]) => {
  const totalServices = services.length;
  const activeServices = services.filter(s => s.status === 'active').length;
  const totalRequests = services.reduce((sum, service) => sum + service.usageCount, 0);
  const avgUsage = Math.round(totalRequests / totalServices);
  const mostUsedService = [...services].sort((a, b) => b.usageCount - a.usageCount)[0];
  
  return {
    totalServices,
    activeServices,
    totalRequests,
    avgUsage,
    mostUsedService: mostUsedService ? mostUsedService.name : 'هیچ'
  };
};
