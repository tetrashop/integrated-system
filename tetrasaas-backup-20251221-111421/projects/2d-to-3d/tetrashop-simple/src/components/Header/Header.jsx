import React from 'react';

const Header = ({ cartCount, onShowCart }) => {
  return (
    <header style={{
      background: 'white',
      padding: '1rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <div>
          <h1 style={{ 
            color: '#2563eb', 
            fontWeight: 'bold', 
            fontSize: '1.5rem',
            margin: 0
          }}>
            🚀 Tetrashop100
          </h1>
          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            فروشگاه اینترنتی پیشرو
          </span>
        </div>
        
        {/* Navigation */}
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <a href="#products" style={{ 
            color: '#4b5563', 
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            محصولات
          </a>
          <a href="#about" style={{ 
            color: '#4b5563', 
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            درباره ما
          </a>
          <a href="#contact" style={{ 
            color: '#4b5563', 
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            تماس با ما
          </a>
        </nav>
        
        {/* Cart Button */}
        <button 
          onClick={onShowCart}
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '500',
            position: 'relative'
          }}
        >
          🛒 سبد خرید
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
