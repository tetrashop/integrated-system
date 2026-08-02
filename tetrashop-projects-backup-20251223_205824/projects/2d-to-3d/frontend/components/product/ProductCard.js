import React from 'react';

const ProductCard = ({ product }) => {
  const handleAddToCart = () => {
    // TODO: اضافه کردن به سبد خرید
    console.log('Adding to cart:', product);
    alert(`محصول "${product.name}" به سبد خرید اضافه شد`);
  };

  const handleQuickView = () => {
    // TODO: نمایش سریع محصول
    console.log('Quick view:', product);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {/* Product Image */}
      <div className="h-56 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="h-44 w-44 object-contain"
          />
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-2">📦</div>
            <span className="text-gray-400 text-sm">بدون تصویر</span>
          </div>
        )}
        
        {/* Quick View Button */}
        <button 
          onClick={handleQuickView}
          className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
          title="مشاهده سریع"
        >
          👁️
        </button>
        
        {/* Favorite Button */}
        <button 
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
          title="افزودن به علاقه‌مندی‌ها"
        >
          ❤️
        </button>
      </div>
      
      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        <div className="flex justify-between items-start mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {product.category || 'دسته‌بندی'}
          </span>
          {product.stock > 0 ? (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              ✓ موجود
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              ✗ ناموجود
            </span>
          )}
        </div>
        
        {/* Product Name */}
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description || 'توضیحات محصول به زودی اضافه خواهد شد'}
        </p>
        
        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-green-600 font-bold text-xl">
              {product.price ? product.price.toLocaleString() : '۰'} تومان
            </span>
            {product.originalPrice && (
              <span className="text-gray-400 text-sm line-through">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          disabled={!product.stock || product.stock === 0}
          className={`w-full mt-4 py-3 rounded-xl font-bold transition-all ${
            product.stock > 0 
              ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.stock > 0 ? (
            <div className="flex items-center justify-center gap-2">
              <span>🛒</span>
              <span>افزودن به سبد</span>
            </div>
          ) : (
            'ناموجود'
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
