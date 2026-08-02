const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

// Middlewareهای امنیتی
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));

app.use(cors({
  origin: [
    'https://tetrashop.vercel.app',
    'https://tetrashop100.vercel.app', 
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
});
app.use(limiter);

// متغیرهای محیطی
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// داده‌های نمونه
const tetrashopData = {
  message: "🎯 به Tetrashop100 خوش آمدید",
  version: "3.0.0",
  timestamp: new Date().toISOString(),
  environment: NODE_ENV,
  endpoints: [
    "/api/health",
    "/api/products", 
    "/api/users",
    "/api/quantum-nlp",
    "/api/rhetoric-analysis",
    "/api/secret-cluster",
    "/api/chess-engine"
  ],
  documentation: "https://github.com/tetrashop/tetrashop-projects",
  features: {
    quantum_nlp: true,
    rhetoric_engine: true,
    secret_cluster: true,
    chess_ai: true,
    api_gateway: true
  }
};

// Routes

// 🏠 صفحه اصلی
app.get('/', (req, res) => {
  res.json({
    ...tetrashopData,
    server: "API Gateway - Tetrashop100",
    status: "operational",
    uptime: process.uptime()
  });
});

// 🔍 سلامت سرویس
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: tetrashopData.version,
    environment: NODE_ENV,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  });
});

// 📦 محصولات
app.get('/api/products', (req, res) => {
  const products = [
    {
      id: 1,
      name: "نگار کوانتوم",
      description: "سیستم NLP تشخیص و تصحیح خطای فوق المپیک",
      category: "ai",
      status: "active",
      version: "1.0.0",
      endpoints: ["/api/quantum-nlp/analyze", "/api/quantum-nlp/correct"]
    },
    {
      id: 2, 
      name: "نطق مصطلح",
      description: "موتور بیان قدرتمندتر از نگار کوانتوم",
      category: "ai",
      status: "active",
      version: "1.0.0",
      endpoints: ["/api/rhetoric/analyze", "/api/rhetoric/enhance"]
    },
    {
      id: 3,
      name: "آمان راز", 
      description: "سیستم خوشه‌ای همسطح با امنیت پیشرفته",
      category: "security",
      status: "active",
      version: "1.0.0",
      endpoints: ["/api/secret/create", "/api/secret/share"]
    },
    {
      id: 4,
      name: "شطرنج کوانتومی",
      description: "موتور آموزشی با معماری استوک فیش",
      category: "ai",
      status: "development", 
      version: "0.9.0",
      endpoints: ["/api/chess/move", "/api/chess/analyze"]
    }
  ];

  res.json({
    success: true,
    count: products.length,
    products: products
  });
});

// 👥 کاربران
app.get('/api/users', (req, res) => {
  const users = [
    {
      id: 1,
      username: "admin-master",
      role: "super_admin",
      department: "management",
      permissions: ["all"],
      status: "active"
    },
    {
      id: 2,
      username: "finance-chief", 
      role: "finance_manager",
      department: "finance",
      permissions: ["financial_reports", "transactions"],
      status: "active"
    },
    {
      id: 3,
      username: "crypto-manager",
      role: "crypto_admin", 
      department: "crypto",
      permissions: ["wallet_management", "transactions"],
      status: "active"
    },
    {
      id: 4,
      username: "tech-lead",
      role: "technical_lead",
      department: "technical", 
      permissions: ["system_management", "monitoring"],
      status: "active"
    }
  ];

  res.json({
    success: true,
    count: users.length,
    users: users
  });
});

// 🧠 Quantum NLP API
app.post('/api/quantum-nlp/analyze', (req, res) => {
  const { text, options = {} } = req.body;
  
  if (!text) {
    return res.status(400).json({
      success: false,
      error: "Text parameter is required"
    });
  }

  // شبیه‌سازی تحلیل کوانتومی
  const analysis = {
    quantum_coherence: Math.random() * 0.8 + 0.2,
    semantic_entanglement: Math.random() * 0.7 + 0.3,
    superposition_score: Math.random() * 0.9 + 0.1,
    error_probability: Math.random() * 0.3,
    word_count: text.split(/\s+/).length,
    reading_level: "advanced",
    suggestions: [
      "بهبود ساختار جملات",
      "استفاده از کلمات دقیق‌تر",
      "افزودن ارتباط معنایی"
    ]
  };

  res.json({
    success: true,
    analysis: analysis,
    metadata: {
      model: "quantum-calligraphy-v3",
      processing_time: "25ms",
      timestamp: new Date().toISOString()
    }
  });
});

// 💪 Rhetoric Analysis API
app.post('/api/rhetoric/analyze', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      success: false, 
      error: "Text parameter is required"
    });
  }

  const analysis = {
    power_level: Math.random() * 0.9 + 0.1,
    clarity_score: Math.random() * 0.8 + 0.2,
    emotional_impact: Math.random() * 0.7 + 0.3,
    persuasion_score: Math.random() * 0.85 + 0.15,
    enhancement_suggestions: [
      "استفاده از کلمات قدرتمندتر",
      "بهبود ساختار جملات", 
      "افزودن تأکید بر نکات کلیدی"
    ]
  };

  res.json({
    success: true,
    analysis: analysis,
    metadata: {
      engine: "rhetoric-pro-v2",
      processing_time: "18ms",
      timestamp: new Date().toISOString()
    }
  });
});

// 🔐 Secret Cluster API
app.post('/api/secret/create', (req, res) => {
  const { content, security_level = "high" } = req.body;

  if (!content) {
    return res.status(400).json({
      success: false,
      error: "Content parameter is required"
    });
  }

  const secret = {
    id: `secret_${Date.now()}`,
    content_preview: content.substring(0, 50) + "...",
    security_level: security_level,
    created_at: new Date().toISOString(),
    cluster_nodes: 4,
    encryption_level: "quantum_256"
  };

  res.json({
    success: true,
    secret: secret,
    message: "Secret created and distributed across cluster"
  });
});

// ♟️ Chess Engine API
app.post('/api/chess/move', (req, res) => {
  const { fen, difficulty = "medium" } = req.body;

  const difficulties = {
    easy: { depth: 8, time: 1000 },
    medium: { depth: 12, time: 2000 }, 
    hard: { depth: 16, time: 5000 },
    expert: { depth: 20, time: 10000 }
  };

  const bestMove = {
    from: "e2",
    to: "e4",
    piece: "pawn",
    score: 0.15,
    depth: difficulties[difficulty].depth,
    evaluation: "slightly better for white",
    alternatives: [
      { from: "d2", to: "d4", score: 0.12 },
      { from: "g1", to: "f3", score: 0.14 }
    ]
  };

  res.json({
    success: true,
    move: bestMove,
    metadata: {
      engine: "quantum-stockfish-v1",
      processing_time: `${difficulties[difficulty].time}ms`,
      difficulty: difficulty
    }
  });
});

// 📊 آمار و مانیتورینگ
app.get('/api/stats', (req, res) => {
  res.json({
    requests_processed: Math.floor(Math.random() * 10000) + 5000,
    active_users: Math.floor(Math.random() * 500) + 100,
    average_response_time: "45ms",
    system_uptime: process.uptime(),
    memory_usage: process.memoryUsage(),
    api_versions: {
      quantum_nlp: "1.2.0",
      rhetoric: "1.1.0", 
      secret_cluster: "1.0.0",
      chess: "0.9.0"
    }
  });
});

// 🔒 احراز هویت (نمونه)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  const users = {
    'admin-master': 'Tetrashop100-SuperAdmin-2024!',
    'finance-chief': 'Finance-Secure-2024!',
    'crypto-manager': 'Crypto-Secure-2024!',
    'tech-lead': 'Tech-Secure-2024!'
  };

  if (users[username] && users[username] === password) {
    const token = Buffer.from(JSON.stringify({
      username,
      role: username.split('-')[0],
      exp: Date.now() + 24 * 60 * 60 * 1000
    })).toString('base64');

    res.json({
      success: true,
      token,
      user: {
        username,
        role: username.split('-')[0],
        permissions: ['api_access', 'data_read', 'system_monitor']
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: "Invalid credentials"
    });
  }
});

// ❌ مدیریت خطاها
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 🔍 مسیرهای ناموجود
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    available_endpoints: tetrashopData.endpoints,
    documentation: tetrashopData.documentation
  });
});

// 🚀 راه‌اندازی سرور
app.listen(PORT, () => {
  console.log(`
🎯 Tetrashop100 API Gateway v${tetrashopData.version}
🚀 Server running on port ${PORT}
🌍 Environment: ${NODE_ENV}
📚 Documentation: ${tetrashopData.documentation}
✅ Ready to process requests!
  `);
});

module.exports = app;
