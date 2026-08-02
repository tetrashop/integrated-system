import { verifyToken } from '../utils/auth.js';

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'دسترسی غیرمجاز. توکن ارائه نشده.'
      });
    }

    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'توکن نامعتبر'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    // بعداً با مدل کاربر کامل می‌شود
    if (!roles.includes('user')) {
      return res.status(403).json({
        success: false,
        error: 'دسترسی غیرمجاز'
      });
    }
    next();
  };
};
