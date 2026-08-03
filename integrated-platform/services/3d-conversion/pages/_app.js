import { useState, useEffect } from 'react';
import { ThemeProvider } from '../lib/contexts/ThemeContext';

function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setMounted(true);
  }, []);

  // جلوگیری از hydration mismatch
  if (!mounted) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'system-ui'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <h2>در حال بارگذاری سیستم...</h2>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
