// داده‌های کامل ۲۳ سرویس TetraSaaS - ساختار پدر-فرزندی
const tetraServices = {
    categories: [
        {
            id: "ai",
            name: "هوش مصنوعی",
            icon: "fas fa-brain",
            color: "#8b5cf6",
            children: [
                {
                    id: 1,
                    name: "نویسنده کوانتومی",
                    code: "quantum-writer",
                    port: 3001,
                    description: "سیستم نوشتن پیشرفته با الگوریتم‌های کوانتومی",
                    status: "active",
                    health: 100,
                    responseTime: 89,
                    usage: 1247,
                    parent: "ai",
                    icon: "fas fa-question",
                    features: ["پردازش کوانتومی", "تولید محتوای هوشمند", "بهینه‌سازی SEO"],
                    metrics: {
                        accuracy: "98%",
                        speed: "0.8s",
                        capacity: "10K/day"
                    }
                },
                {
                    id: 2,
                    name: "نویسنده هوش مصنوعی",
                    code: "ai-writer",
                    port: 3002,
                    description: "تولید محتوای خودکار با مدل‌های زبانی پیشرفته",
                    status: "active",
                    health: 100,
                    responseTime: 71,
                    usage: 2156,
                    parent: "ai",
                    icon: "fas fa-robot",
                    features: ["GPT-4 Integration", "Multi-language", "Content Optimization"],
                    metrics: {
                        accuracy: "95%",
                        speed: "1.2s",
                        capacity: "15K/day"
                    }
                },
                {
                    id: 6,
                    name: "تحلیلگر محتوا",
                    code: "content-analyzer",
                    port: 3006,
                    description: "آنالیز و بهینه‌سازی محتوای متنی و چندرسانه‌ای",
                    status: "active",
                    health: 100,
                    responseTime: 93,
                    usage: 1789,
                    parent: "ai",
                    icon: "fas fa-chart-bar",
                    features: ["Sentiment Analysis", "SEO Scoring", "Content Grading"],
                    metrics: {
                        accuracy: "96%",
                        speed: "0.9s",
                        capacity: "12K/day"
                    }
                }
            ]
        },
        {
            id: "graphics",
            name: "گرافیک و رسانه",
            icon: "fas fa-palette",
            color: "#06b6d4",
            children: [
                {
                    id: 4,
                    name: "مبدل سه بعدی",
                    code: "3d-converter",
                    port: 3004,
                    description: "تبدیل مدل‌های دو بعدی به سه بعدی با کیفیت بالا",
                    status: "active",
                    health: 100,
                    responseTime: 91,
                    usage: 987,
                    parent: "graphics",
                    icon: "fas fa-cube",
                    features: ["3D Modeling", "Texture Mapping", "Animation Support"],
                    metrics: {
                        accuracy: "94%",
                        speed: "2.5s",
                        capacity: "5K/day"
                    }
                },
                {
                    id: 5,
                    name: "تبدیل دو بعدی به سه بعدی",
                    code: "2d-to-3d",
                    port: 3005,
                    description: "تبدیل تصاویر 2D به مدل‌های 3D واقع‌گرایانه",
                    status: "active",
                    health: 100,
                    responseTime: 81,
                    usage: 845,
                    parent: "graphics",
                    icon: "fas fa-vector-square",
                    features: ["Depth Estimation", "Light Simulation", "Material Generation"],
                    metrics: {
                        accuracy: "92%",
                        speed: "3.2s",
                        capacity: "4K/day"
                    }
                },
                {
                    id: 10,
                    name: "گرافیک دو بعدی",
                    code: "graphic-2d",
                    port: 3010,
                    description: "ابزارهای طراحی و ویرایش گرافیک دو بعدی",
                    status: "active",
                    health: 100,
                    responseTime: 69,
                    usage: 1567,
                    parent: "graphics",
                    icon: "fas fa-draw-polygon",
                    features: ["Vector Editing", "Image Processing", "Export Formats"],
                    metrics: {
                        accuracy: "98%",
                        speed: "0.5s",
                        capacity: "8K/day"
                    }
                },
                {
                    id: 14,
                    name: "پردازشگر تصویر",
                    code: "image-processor",
                    port: 3014,
                    description: "پردازش و بهینه‌سازی تصاویر با الگوریتم‌های هوشمند",
                    status: "active",
                    health: 100,
                    responseTime: 117,
                    usage: 2345,
                    parent: "graphics",
                    icon: "fas fa-image",
                    features: ["Compression", "Enhancement", "Format Conversion"],
                    metrics: {
                        accuracy: "97%",
                        speed: "1.1s",
                        capacity: "20K/day"
                    }
                },
                {
                    id: 15,
                    name: "مبدل صوتی",
                    code: "audio-converter",
                    port: 3015,
                    description: "تبدیل و پردازش فایل‌های صوتی با کیفیت استودیویی",
                    status: "active",
                    health: 100,
                    responseTime: 77,
                    usage: 1123,
                    parent: "graphics",
                    icon: "fas fa-music",
                    features: ["Format Conversion", "Noise Reduction", "Audio Enhancement"],
                    metrics: {
                        accuracy: "99%",
                        speed: "1.8s",
                        capacity: "6K/day"
                    }
                },
                {
                    id: 16,
                    name: "ویرایشگر ویدیو",
                    code: "video-editor",
                    port: 3016,
                    description: "ویرایش و پردازش ویدیو با قابلیت‌های حرفه‌ای",
                    status: "active",
                    health: 100,
                    responseTime: 85,
                    usage: 876,
                    parent: "graphics",
                    icon: "fas fa-video",
                    features: ["Timeline Editing", "Effects Library", "Export Optimization"],
                    metrics: {
                        accuracy: "95%",
                        speed: "4.5s",
                        capacity: "3K/day"
                    }
                }
            ]
        },
        {
            id: "security",
            name: "امنیت",
            icon: "fas fa-shield-alt",
            color: "#10b981",
            children: [
                {
                    id: 17,
                    name: "رمزگذار داده",
                    code: "data-encryptor",
                    port: 3017,
                    description: "رمزنگاری پیشرفته داده‌ها با استانداردهای امنیتی",
                    status: "active",
                    health: 100,
                    responseTime: 79,
                    usage: 1987,
                    parent: "security",
                    icon: "fas fa-lock",
                    features: ["AES-256", "RSA Encryption", "Key Management"],
                    metrics: {
                        accuracy: "100%",
                        speed: "0.3s",
                        capacity: "50K/day"
                    }
                },
                {
                    id: 18,
                    name: "اسکنر شبکه",
                    code: "network-scanner",
                    port: 3018,
                    description: "مانیتورینگ و تحلیل امنیت شبکه‌های کامپیوتری",
                    status: "active",
                    health: 100,
                    responseTime: 82,
                    usage: 1564,
                    parent: "security",
                    icon: "fas fa-network-wired",
                    features: ["Vulnerability Detection", "Traffic Analysis", "Threat Alerts"],
                    metrics: {
                        accuracy: "97%",
                        speed: "2.1s",
                        capacity: "100K/day"
                    }
                },
                {
                    id: 21,
                    name: "تولیدکننده رمز",
                    code: "password-generator",
                    port: 3021,
                    description: "تولید رمزهای عبور امن و تصادفی با الگوریتم‌های پیچیده",
                    status: "active",
                    health: 100,
                    responseTime: 91,
                    usage: 3123,
                    parent: "security",
                    icon: "fas fa-key",
                    features: ["Custom Rules", "Password Strength", "Secure Storage"],
                    metrics: {
                        accuracy: "100%",
                        speed: "0.1s",
                        capacity: "100K/day"
                    }
                }
            ]
        },
        {
            id: "system",
            name: "سیستم و بهینه‌سازی",
            icon: "fas fa-cogs",
            color: "#f59e0b",
            children: [
                {
                    id: 7,
                    name: "ضد تکه تکه شدن",
                    code: "anti-fragmentation",
                    port: 3007,
                    description: "بهینه‌سازی حافظه و جلوگیری از تکه‌تکه شدن داده‌ها",
                    status: "active",
                    health: 100,
                    responseTime: 82,
                    usage: 1345,
                    parent: "system",
                    icon: "fas fa-puzzle-piece",
                    features: ["Memory Optimization", "Defragmentation", "Performance Boost"],
                    metrics: {
                        accuracy: "93%",
                        speed: "1.5s",
                        capacity: "15K/day"
                    }
                },
                {
                    id: 12,
                    name: "طراحی تلسکوپ",
                    code: "telescope-design",
                    port: 3012,
                    description: "شبیه‌سازی و طراحی سیستم‌های اپتیکی پیشرفته",
                    status: "active",
                    health: 100,
                    responseTime: 83,
                    usage: 567,
                    parent: "system",
                    icon: "fas fa-satellite",
                    features: ["Optical Simulation", "3D Rendering", "Performance Analysis"],
                    metrics: {
                        accuracy: "96%",
                        speed: "3.8s",
                        capacity: "2K/day"
                    }
                },
                {
                    id: 13,
                    name: "سیستم انتقال",
                    code: "teleport-system",
                    port: 3013,
                    description: "انتقال داده‌های حجیم با سرعت بالا بین سرورها",
                    status: "active",
                    health: 100,
                    responseTime: 83,
                    usage: 2876,
                    parent: "system",
                    icon: "fas fa-broadcast-tower",
                    features: ["High-speed Transfer", "Data Compression", "Error Correction"],
                    metrics: {
                        accuracy: "99.9%",
                        speed: "10Gbps",
                        capacity: "1PB/day"
                    }
                },
                {
                    id: 19,
                    name: "بهینه‌ساز باتری",
                    code: "battery-optimizer",
                    port: 3019,
                    description: "مدیریت و بهینه‌سازی مصرف انرژی در سیستم‌ها",
                    status: "active",
                    health: 100,
                    responseTime: 84,
                    usage: 1789,
                    parent: "system",
                    icon: "fas fa-battery-full",
                    features: ["Power Management", "Energy Saving", "Battery Analytics"],
                    metrics: {
                        accuracy: "95%",
                        speed: "0.7s",
                        capacity: "25K/day"
                    }
                },
                {
                    id: 22,
                    name: "مانیتور سیستم",
                    code: "system-monitor",
                    port: 3022,
                    description: "مانیتورینگ جامع منابع سیستم و عملکرد سرورها",
                    status: "active",
                    health: 100,
                    responseTime: 84,
                    usage: 4231,
                    parent: "system",
                    icon: "fas fa-desktop",
                    features: ["Real-time Monitoring", "Alert System", "Performance Reports"],
                    metrics: {
                        accuracy: "99%",
                        speed: "0.2s",
                        capacity: "1M/day"
                    }
                },
                {
                    id: 23,
                    name: "مدیریت پشتیبان",
                    code: "backup-manager",
                    port: 3023,
                    description: "سیستم مدیریت پشتیبان‌گیری خودکار و امن",
                    status: "active",
                    health: 100,
                    responseTime: 90,
                    usage: 1567,
                    parent: "system",
                    icon: "fas fa-hdd",
                    features: ["Automated Backup", "Incremental Save", "Recovery Tools"],
                    metrics: {
                        accuracy: "100%",
                        speed: "5.2s",
                        capacity: "500K/day"
                    }
                },
                {
                    id: 11,
                    name: "ضد دود",
                    code: "anti-smoke",
                    port: 3011,
                    description: "سیستم تشخیص و جلوگیری از آسیب‌های احتمالی",
                    status: "active",
                    health: 100,
                    responseTime: 88,
                    usage: 987,
                    parent: "system",
                    icon: "fas fa-smog",
                    features: ["Risk Detection", "Preventive Actions", "System Protection"],
                    metrics: {
                        accuracy: "94%",
                        speed: "1.3s",
                        capacity: "8K/day"
                    }
                },
                {
                    id: 8,
                    name: "حل کننده فرمول",
                    code: "formula-solver",
                    port: 3008,
                    description: "حل مسائل پیچیده ریاضی و فرمول‌های علمی",
                    status: "active",
                    health: 100,
                    responseTime: 86,
                    usage: 1678,
                    parent: "system",
                    icon: "fas fa-square-root-alt",
                    features: ["Math Engine", "Symbolic Computation", "Equation Solving"],
                    metrics: {
                        accuracy: "99%",
                        speed: "2.3s",
                        capacity: "10K/day"
                    }
                }
            ]
        },
        {
            id: "productivity",
            name: "بهره‌وری",
            icon: "fas fa-chart-line",
            color: "#3b82f6",
            children: [
                {
                    id: 3,
                    name: "باغ مخفی",
                    code: "secret-garden",
                    port: 3003,
                    description: "سیستم مدیریت کارها و پروژه‌های محرمانه",
                    status: "active",
                    health: 100,
                    responseTime: 78,
                    usage: 1456,
                    parent: "productivity",
                    icon: "fas fa-seedling",
                    features: ["Task Management", "Encrypted Notes", "Project Tracking"],
                    metrics: {
                        accuracy: "96%",
                        speed: "0.6s",
                        capacity: "5K/day"
                    }
                },
                {
                    id: 20,
                    name: "سازماندهی فایل",
                    code: "file-organizer",
                    port: 3020,
                    description: "سیستم خودکار سازماندهی و دسته‌بندی فایل‌ها",
                    status: "active",
                    health: 100,
                    responseTime: 77,
                    usage: 2987,
                    parent: "productivity",
                    icon: "fas fa-folder-tree",
                    features: ["Auto-categorization", "Duplicate Detection", "Smart Sorting"],
                    metrics: {
                        accuracy: "97%",
                        speed: "1.4s",
                        capacity: "30K/day"
                    }
                }
            ]
        },
        {
            id: "development",
            name: "توسعه",
            icon: "fas fa-code",
            color: "#ec4899",
            children: [
                {
                    id: 9,
                    name: "پاک کننده کد",
                    code: "code-cleaner",
                    port: 3009,
                    description: "بهینه‌سازی و پاکسازی کدهای برنامه‌نویسی",
                    status: "active",
                    health: 100,
                    responseTime: 82,
                    usage: 1876,
                    parent: "development",
                    icon: "fas fa-broom",
                    features: ["Code Linting", "Formatting", "Quality Analysis"],
                    metrics: {
                        accuracy: "98%",
                        speed: "1.7s",
                        capacity: "20K/day"
                    }
                }
            ]
        }
    ]
};

// تمام سرویس‌ها در یک آرایه
const allServices = tetraServices.categories.flatMap(category => category.children);

// تابع‌های کمکی
function getCategoryName(categoryId) {
    const category = tetraServices.categories.find(cat => cat.id === categoryId);
    return category ? category.name : "نامشخص";
}

function getCategoryColor(categoryId) {
    const category = tetraServices.categories.find(cat => cat.id === categoryId);
    return category ? category.color : "#6b7280";
}

function getCategoryIcon(categoryId) {
    const category = tetraServices.categories.find(cat => cat.id === categoryId);
    return category ? category.icon : "fas fa-question";
}

function filterServicesByCategory(categoryId) {
    if (categoryId === "all") return allServices;
    const category = tetraServices.categories.find(cat => cat.id === categoryId);
    return category ? category.children : [];
}

function getServiceById(serviceId) {
    return allServices.find(service => service.id === serviceId);
}

function getServiceByCode(serviceCode) {
    return allServices.find(service => service.code === serviceCode);
}
