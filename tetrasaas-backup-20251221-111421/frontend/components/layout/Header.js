import React from 'react';
import { useApp } from '../../context/AppContext';

const Header = () => {
  const { user, cartItemsCount } = useApp();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">🚀 Tetrashop100</h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-600">خانه</a>
            <a href="/products" className="text-gray-700 hover:text-blue-600">محصولات</a>
            <a href="/about" className="text-gray-700 hover:text-blue-600">درباره ما</a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <div className="relative">
              <button className="p-2 text-gray-700 hover:text-blue-600">
                🛒 سبد خرید
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>

            {/* User */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">خوش آمدید، {user.name}</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  پروفایل
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <a href="/login" className="text-gray-700 hover:text-blue-600">ورود</a>
                <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  ثبت نام
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
