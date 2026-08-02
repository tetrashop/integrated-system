import React from 'react';

const SERVICES = [
  {
    id: 'chess',
    name: 'سرویس شطرنج',
    icon: '♟️',
    url: 'https://tetrashop-chess-production-384phhvsz-ramin-edjlal-s-projects.vercel.app',
    status: 'active',
    description: 'پلتفرم پیشرفته شطرنج آنلاین'
  },
  {
    id: '3d-main',
    name: 'سرویس 3D اصلی', 
    icon: '🎮',
    url: 'https://tetrashop-3d-app.surge.sh',
    status: 'active',
    description: 'موتور سه بعدی پیشرفته'
  },
  {
    id: 'fast-service',
    name: 'سرویس سریع',
    icon: '⚡',
    url: 'https://tetrashop-working.surge.sh',
    status: 'active',
    description: 'نسخه بهینه شده برای عملکرد بالا'
  }
];

export function ServicePlatform() {
  const handleServiceClick = (service) => {
    if (service.url && service.status === 'active') {
      window.open(service.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <header style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{
          color: '#4f46e5',
          fontSize: '2.5rem',
          margin: '0 0 10px 0'
        }}>🎮 پلتفرم تتراشاپ</h1>
        <p style={{
          color: '#e5e7eb',
          fontSize: '1.2rem',
          margin: 0,
          opacity: 0.8
        }}>انتخاب سرویس مورد نظر</p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '40px'
      }}>
        {SERVICES.map(service => (
          <div 
            key={service.id}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '15px',
              padding: '25px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onClick={() => handleServiceClick(service)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleServiceClick(service)}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <span style={{ fontSize: '2rem', marginLeft: '15px' }}>{service.icon}</span>
              <h3 style={{
                color: 'white',
                margin: 0,
                fontSize: '1.4rem'
              }}>{service.name}</h3>
            </div>
            <p style={{
              color: '#e5e7eb',
              margin: '0 0 15px 0',
              lineHeight: '1.5',
              opacity: 0.8
            }}>{service.description}</p>
            <div style={{
              color: service.status === 'active' ? '#10b981' : '#ef4444',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              {service.status === 'active' ? 'فعال ✅' : 'غیرفعال ❌'}
            </div>
          </div>
        ))}
      </div>

      <footer style={{
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '0.9rem',
        marginTop: '40px'
      }}>
        <p>سکو‌ی نرم‌افزاری پیشرفته - نسخه پایدار</p>
      </footer>
    </div>
  );
}
