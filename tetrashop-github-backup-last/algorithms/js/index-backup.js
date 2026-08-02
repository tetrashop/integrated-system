/**
 * 🚀 سرور اصلی Tetrashop100 با قابلیت‌های کامل
 */

import mongoose from 'mongoose';
import { hashPassword, comparePassword, generateToken } from './utils/auth.js';
import { authenticate } from './middleware/auth.js';
import { paymentService } from './services/paymentService.js';

// اتصال به دیتابیس MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tetrashop';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.log('❌ MongoDB connection failed, using in-memory data');
  }
};

connectDB();

// داده‌های نمونه
const sampleProducts = [
  {
    _id: '1',
    name: 'لپ‌تاپ گیمینگ ASUS',
    description: 'لپ‌تاپ گیمینگ با کارایی بالا',
    price: 25000000,
    category: 'الکترونیک',
    stock: 15,
    featured: true
  },
  {
    _id: '2', 
    name: 'هدفون بی‌سیم Sony',
    description: 'هدفون با کیفیت صدای عالی',
    price: 3500000,
    category: 'صوتی',
    stock: 30,
    featured: true
  },
  {
    _id: '3',
    name: 'کتاب برنامه‌نویسی JavaScript',
    description: 'کتاب جامع آموزش JavaScript',
    price: 450000,
    category: 'کتاب',
    stock: 100,
    featured: false
  }
];

export default async function handler(request, response) {
  // تنظیم headers
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // مدیریت CORS preflight
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  const { pathname } = new URL(request.url, `http://${request.headers.host}`);

  try {
    // 📊 سلامت سرویس
    if (pathname === '/api/health' || pathname === '/api/health/') {
      const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
      
      return response.status(200).json({
        status: 'healthy',
        service: 'Tetrashop100',
        version: '3.0.0',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        features: ['auth', 'products', 'payments', 'orders']
      });
    }

    // 🛒 محصولات
    else if (pathname === '/api/products' || pathname === '/api/products/') {
      return response.status(200).json({
        success: true,
        data: {
          products: sampleProducts,
          count: sampleProducts.length,
          pagination: { page: 1, limit: 10, total: sampleProducts.length }
        }
      });
    }

    // 👥 ثبت نام کاربر
    else if (pathname === '/api/auth/register' && request.method === 'POST') {
      const { name, email, password } = await readBody(request);
      
      // شبیه‌سازی ثبت نام
      const hashedPassword = await hashPassword(password);
      const user = {
        _id: Date.now().toString(),
        name,
        email,
        password: hashedPassword,
        createdAt: new Date()
      };

      const token = generateToken(user._id);

      return response.status(201).json({
        success: true,
        message: 'ثبت نام موفقیت‌آمیز بود',
        data: {
          user: { id: user._id, name: user.name, email: user.email },
          token
        }
      });
    }

    // 🔐 ورود کاربر
    else if (pathname === '/api/auth/login' && request.method === 'POST') {
      const { email, password } = await readBody(request);
      
      // شبیه‌سازی کاربر
      const user = {
        _id: '1',
        name: 'کاربر تست',
        email: 'test@example.com',
        password: await hashPassword('password123')
      };

      const isValid = await comparePassword(password, user.password);
      
      if (!isValid) {
        return response.status(401).json({
          success: false,
          error: 'ایمیل یا رمز عبور نادرست'
        });
      }

      const token = generateToken(user._id);

      return response.status(200).json({
        success: true,
        message: 'ورود موفقیت‌آمیز بود',
        data: {
          user: { id: user._id, name: user.name, email: user.email },
          token
        }
      });
    }

    // 💳 ایجاد پرداخت
    else if (pathname === '/api/payments/create' && request.method === 'POST') {
      const { amount, description } = await readBody(request);
      
      const payment = await paymentService.createPayment(
        amount,
        description,
        'https://tetrashop-projects-alpha.vercel.app/api/payments/verify'
      );

      if (!payment.success) {
        return response.status(400).json({
          success: false,
          error: payment.error
        });
      }

      return response.status(200).json({
        success: true,
        data: payment
      });
    }

    // 🏠 صفحه اصلی
    else if (pathname === '/' || pathname === '/api') {
      return response.status(200).json({
        success: true,
        message: '🎯 به Tetrashop100 خوش آمدید',
        data: {
          version: '3.0.0',
          timestamp: new Date().toISOString(),
          endpoints: [
            'GET /api/health',
            'GET /api/products',
            'POST /api/auth/register',
            'POST /api/auth/login', 
            'POST /api/payments/create'
          ],
          documentation: 'https://github.com/tetrashop/tetrashop-projects'
        }
      });
    }

    // ❌ مسیر یافت نشد
    else {
      return response.status(404).json({
        success: false,
        error: 'Endpoint یافت نشد',
        message: 'مسیر درخواستی موجود نیست'
      });
    }

  } catch (error) {
    console.error('❌ خطا در پردازش درخواست:', error);
    return response.status(500).json({
      success: false,
      error: 'خطای سرور داخلی',
      message: error.message
    });
  }
}

// تابع کمکی برای خواندن body
async function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', chunk => body += chunk);
    request.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}
