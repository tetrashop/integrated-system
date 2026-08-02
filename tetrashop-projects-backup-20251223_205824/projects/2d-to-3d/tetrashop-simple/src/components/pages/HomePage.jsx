import React, { useEffect } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { apiService } from '../../services/apiService.jsx'
import ProductCard from '../product/ProductCard.jsx'
import Header from '../layout/Header.jsx'

const HomePage = () => {
  const { products, setProducts, setLoading, isLoading, cartItemsCount } = useApp()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await apiService.products.getAll()
        const productsData = response.data.data?.products || response.data.products || []
        setProducts(productsData)
      } catch (error) {
        console.error('Error fetching products:', error)
        // استفاده از داده‌های نمونه
        const sampleProducts = [
          {
            id: 1,
            name: 'لپ‌تاپ گیمینگ',
            price: 25000000,
            category: 'الکترونیک',
            stock: 15,
            featured: true
          },
          {
            id: 2,
            name: 'هدفون بی‌سیم',
            price: 3500000,
            category: 'صوتی',
            stock: 30,
            featured: true
          }
        ]
        setProducts(sampleProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [setProducts, setLoading])

  const availableProducts = products.filter(product => product.stock > 0)

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '2px solid #2563eb',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#4b5563' }}>در حال بارگذاری فروشگاه...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />

      <main style={{ minHeight: '100vh', background: '#f9fafb' }}>
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(to right, #2563eb, #7c3aed)',
          color: 'white',
          padding: '4rem 0'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
            <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
              <h1 style={{ 
                fontSize: '2.25rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem'
              }}>
                به <span style={{ color: '#fbbf24' }}>Tetrashop100</span> خوش آمدید
              </h1>
              <p style={{ 
                fontSize: '1.25rem', 
                marginBottom: '2rem', 
                opacity: 0.9
              }}>
                تجربه‌ای متفاوت از خرید آنلاین
              </p>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '1rem',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.5rem',
                  padding: '1rem'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{availableProducts.length}+</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>محصول فعال</div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.5rem',
                  padding: '1rem'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{cartItemsCount}</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>در سبد شما</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section style={{ padding: '3rem 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                محصولات ما
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1.5rem'
            }}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer style={{ background: '#1f2937', color: 'white', padding: '2rem 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>🚀 Tetrashop100</h3>
          <p style={{ color: '#9ca3af' }}>فروشگاه اینترنتی با کیفیت و قیمت مناسب</p>
        </div>
      </footer>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (min-width: 768px) {
          main section > div > div:last-child {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (min-width: 1024px) {
          main section > div > div:last-child {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </>
  )
}

export default HomePage
