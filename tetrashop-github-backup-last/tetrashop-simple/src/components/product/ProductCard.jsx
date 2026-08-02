import React from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useApp();

  const cartItem = cart.find(item => item.id === product.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative">
        <div className="text-center">
          <span className="text-4xl mb-2">🛒</span>
          <span className="text-gray-600 text-sm">{product.category}</span>
        </div>
        
        {product.featured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
            ویژه
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-green-600 font-bold text-xl">
            {product.price.toLocaleString()} تومان
          </span>
          <span className={`text-sm ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} عدد در انبار` : 'ناموجود'}
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-blue-600 text-sm bg-blue-50 px-2 py-1 rounded">
            {product.category}
          </span>
          
          {cartQuantity > 0 && (
            <span className="text-sm text-gray-600">
              {cartQuantity} عدد در سبد
            </span>
          )}
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className="w-full"
          disabled={product.stock === 0}
          variant={cartQuantity > 0 ? 'success' : 'primary'}
        >
          {product.stock === 0 ? 'ناموجود' : 
           cartQuantity > 0 ? `افزودن بیشتر (${cartQuantity})` : 'افزودن به سبد خرید'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
