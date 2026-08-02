import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import ProductCard from './components/ProductCard/ProductCard';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  // داده‌های نمونه پیشرفته
  const sampleProducts = [
    {
      id: 1,
      name: 'لپ‌تاپ گیمینگ ASUS ROG',
      description: 'لپ‌تاپ گیمینگ با پردازنده Core i7 و کارت گرافیک RTX 4060',
      price: 45000000,
      originalPrice: 52000000,
      category: 'الکترونیک',
      stock: 8,
      featured: true
    },
    {
      id: 2,
      name: 'هدفون بی‌سیم Sony WH-1000XM4',
      description: 'هدفون نویز کانسلینگ با کیفیت صدای استثنایی',
      price: 12500000,
      category: 'صوتی',
      stock: 15,
      featured: true
    },
    {
      id: 3,
      name: 'کتاب آموزش React.js پیشرفته',
      description: 'کتاب جامع آموزش React.js از پایه تا پیشرفته',
      price: 350000,
      category: 'کتاب',
      stock: 25,
      featured: false
    },
    {
      id: 4,
      name: 'ماوس گیمینگ Razer DeathAdder',
      description: 'ماوس گیمینگ با DPI قابل تنظیم و طراحی ارگونومیک',
      price: 2800000,
      category: 'الکترونیک',
      stock: 0,
      featured: false
    },
    {
      id: 5,
      name: 'کیبورد مکانیکی Logitech',
      description: 'کیبورد مکانیکی با نور RGB و سوییچ‌های Blue',
      price: 4200000,
      category: 'الکترونیک',
      stock: 12,
      featured: true
    },
    {
      id: 6,
      name: 'شارژر سریع 65 وات',
      description: 'شارژر سریع با قابلیت Power Delivery',
      price: 850000,
      category: 'الکترونیک',
      stock: 30,
      featured: false
    }
  ];

  useEffect(() => {
    // شبیه‌سازی بارگذاری از API
    setTimeout(() => {
      setProducts(sampleProducts);
      setLoading(false);
    }, 1500);
  }, []);

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    
    // نمایش نوتیفیکیشن
    alert(`✅ ${quantity} عدد ${product.name} به سبد خرید اضافه شد`);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f9fafb',
        flexDirection: 'column'
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '2px solid #2563eb',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}></div>
        <h2 style={{ color: '#4b5563', marginBottom: '0.5rem' }}>در حال بارگذاری فروشگاه...</h2>
        <p style={{ color: '#6b7280' }}>لطفاً چند لحظه صبر کنید</p>
      </div>
    );
  }

  return (
    <div style={{ direction: 'rtl', minHeight: '100vh', background: '#f9fafb' }}>
      <Header 
        cartCount={cartItemsCount} 
        onShowCart={() => setShowCart(true)} 
      />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            به دنیای خرید آنلاین خوش آمدید
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '2rem' }}>
            با تنوع بی‌نظیر محصولات و قیمت‌های استثنایی
          </p>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: '3rem',
            marginTop: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fbbf24' }}>
                {products.length}+
              </div>
              <div style={{ opacity: 0.9 }}>محصول متنوع</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fbbf24' }}>
                {products.filter(p => p.stock > 0).length}+
              </div>
              <div style={{ opacity: 0.9 }}>محصول موجود</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fbbf24' }}>
                {products.filter(p => p.featured).length}+
              </div>
              <div style={{ opacity: 0.9 }}>محصول ویژه</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" style={{ padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem',
              color: '#1f2937'
            }}>
              محصولات ما
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
              منتخبی از بهترین محصولات با گارانتی کیفیت
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {showCart && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'flex-start'
          }}
          onClick={() => setShowCart(false)}
        >
          <div 
            style={{
              background: 'white',
              width: '400px',
              maxWidth: '90vw',
              height: '100vh',
              overflowY: 'auto',
              boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0 }}>سبد خرید شما</h3>
              <button 
                onClick={() => setShowCart(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ padding: '1rem' }}>
              {cart.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '2rem',
                  color: '#64748b'
                }}>
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🛒</span>
                  <p>سبد خرید شما خالی است</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <h4 style={{ marginBottom: '0.5rem', color: '#1e293b' }}>{item.name}</h4>
                      <p style={{ color: '#059669', fontWeight: '600' }}>
                        {item.price.toLocaleString()} تومان
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          style={{
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            width: '30px',
                            height: '30px',
                            borderRadius: '0.25rem',
                            cursor: 'pointer'
                          }}
                        >
                          -
                        </button>
                        <span style={{ minWidth: '2rem', textAlign: 'center' }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          style={{
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            width: '30px',
                            height: '30px',
                            borderRadius: '0.25rem',
                            cursor: 'pointer'
                          }}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {cart.length > 0 && (
              <div style={{
                padding: '1.5rem',
                borderTop: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  fontWeight: '600',
                  fontSize: '1.125rem'
                }}>
                  <span>جمع کل:</span>
                  <span>{cartTotal.toLocaleString()} تومان</span>
                </div>
                <button style={{
                  background: '#059669',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  width: '100%',
                  fontSize: '1rem'
                }}>
                  ادامه فرآیند خرید
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        background: '#1f2937',
        color: 'white',
        padding: '3rem 1rem 1rem',
        marginTop: '4rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h3 style={{ color: '#fbbf24', marginBottom: '1rem' }}>🚀 Tetrashop100</h3>
              <p style={{ color: '#cbd5e1' }}>فروشگاه اینترنتی با کیفیت و قیمت مناسب</p>
            </div>
            <div>
              <h4 style={{ color: '#fbbf24', marginBottom: '1rem' }}>دسترسی سریع</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="#products" style={{ color: '#cbd5e1', textDecoration: 'none' }}>محصولات</a>
                <a href="#about" style={{ color: '#cbd5e1', textDecoration: 'none' }}>درباره ما</a>
                <a href="#contact" style={{ color: '#cbd5e1', textDecoration: 'none' }}>تماس با ما</a>
              </div>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid #374151',
            paddingTop: '2rem',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            <p>© 2024 Tetrashop100 - تمام حقوق محفوظ است</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          section > div > div:last-child {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
