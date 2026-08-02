import React, { useState } from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div style={{
      background: 'white',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}>
      {/* Product Image */}
      <div style={{
        height: '200px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
        position: 'relative'
      }}>
        <span style={{ fontSize: '3rem' }}>🛒</span>
        {product.featured && (
          <div style={{
            position: 'absolute',
            top: '0.5rem',
            left: '0.5rem',
            background: '#f59e0b',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '1rem',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            ویژه
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div>
        <h3 style={{ 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          fontSize: '1.25rem',
          color: '#1f2937'
        }}>
          {product.name}
        </h3>
        
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          {product.description}
        </p>
        
        {/* Product Meta */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <span style={{
            background: '#dbeafe',
            color: '#1e40af',
            padding: '0.25rem 0.75rem',
            borderRadius: '1rem',
            fontSize: '0.75rem',
            fontWeight: '500'
          }}>
            {product.category}
          </span>
          
          <span style={{
            color: product.stock > 10 ? '#059669' : product.stock > 0 ? '#d97706' : '#dc2626',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            {product.stock > 0 ? `${product.stock} عدد` : 'ناموجود'}
          </span>
        </div>
        
        {/* Price */}
        <div style={{ marginBottom: '1.5rem' }}>
          {product.originalPrice && (
            <span style={{
              color: '#9ca3af',
              textDecoration: 'line-through',
              fontSize: '0.875rem',
              marginLeft: '0.5rem'
            }}>
              {product.originalPrice.toLocaleString()} تومان
            </span>
          )}
          <span style={{
            color: '#059669',
            fontWeight: 'bold',
            fontSize: '1.5rem'
          }}>
            {product.price.toLocaleString()} تومان
          </span>
        </div>
        
        {/* Actions */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* Quantity Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            overflow: 'hidden'
          }}>
            <button 
              onClick={decreaseQuantity}
              style={{
                background: '#f3f4f6',
                border: 'none',
                padding: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              -
            </button>
            <span style={{ 
              padding: '0.5rem 1rem',
              minWidth: '3rem',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              {quantity}
            </span>
            <button 
              onClick={increaseQuantity}
              style={{
                background: '#f3f4f6',
                border: 'none',
                padding: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              +
            </button>
          </div>
          
          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              background: product.stock === 0 ? '#9ca3af' : '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              flex: 1,
              opacity: product.stock === 0 ? 0.6 : 1
            }}
          >
            {product.stock === 0 ? 'ناموجود' : 'افزودن به سبد'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
