import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth/AuthProvider';
import Head from 'next/head';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalConversions: 0,
    activeUsers: 0,
    storageUsage: 0
  });

  useEffect(() => {
    // در محیط واقعی، آمار از API دریافت می‌شود
    setStats({
      totalConversions: Math.floor(Math.random() * 1000),
      activeUsers: Math.floor(Math.random() * 50),
      storageUsage: Math.floor(Math.random() * 500)
    });
  }, []);

  return (
    <>
      <Head>
        <title>داشبورد | 3D Conversion App</title>
      </Head>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>🎯 داشبورد مدیریت</h1>
          <button 
            onClick={logout}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            خروج
          </button>
        </div>

        {user && (
          <div style={{ marginBottom: '20px' }}>
            <p>خوش آمدید، {user.name} (سطح دسترسی: {user.role === 'admin' ? 'مدیر' : 'کاربر'})</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            <h3>🔄 تبدیل‌های امروز</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalConversions}</p>
          </div>
          
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            <h3>👥 کاربران فعال</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.activeUsers}</p>
          </div>
          
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            <h3>💾 فضای مصرفی</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.storageUsage} MB</p>
          </div>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h2>🔗 دسترسی سریع</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <a href="/converter" style={{ padding: '15px', backgroundColor: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '5px', textAlign: 'center' }}>
              🔄 تبدیل فایل
            </a>
            <a href="/shop" style={{ padding: '15px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px', textAlign: 'center' }}>
              🛒 فروشگاه
            </a>
            <a href="/upload" style={{ padding: '15px', backgroundColor: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: '5px', textAlign: 'center' }}>
              📤 آپلود مدل
            </a>
            <a href="/analytics" style={{ padding: '15px', backgroundColor: '#6f42c1', color: 'white', textDecoration: 'none', borderRadius: '5px', textAlign: 'center' }}>
              📊 آمار و گزارشات
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
