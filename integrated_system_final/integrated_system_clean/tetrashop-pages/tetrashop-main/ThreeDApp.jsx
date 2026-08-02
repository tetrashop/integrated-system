import React, { useState, useEffect } from 'react';

const ThreeDApp = () => {
  const [loading, setLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    // تایمر برای جلوگیری از انتظار بی‌پایان
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setIframeError(true);
      }
    }, 5000); // 5 ثانیه timeout

    return () => clearTimeout(timer);
  }, [loading]);

  const handleIframeLoad = () => {
    setLoading(false);
    setIframeError(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setIframeError(true);
  };

  return (
    <div className="app-page">
      <div className="app-header">
        <h2>🔄 تبدیل 3D</h2>
        <p>ابزار پیشرفته تبدیل فرمت‌های سه‌بعدی</p>
      </div>

      {/* نمایش وضعیت بارگذاری */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner">🔄</div>
          <p>در حال بارگذاری اپلیکیشن 3D...</p>
          <p>لطفاً چند لحظه صبر کنید</p>
        </div>
      )}

      {/* نمایش خطا */}
      {iframeError && (
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>اپلیکیشن 3D در حال حاضر در دسترس نیست</h3>
          <p>ما در حال بهبود این بخش هستیم</p>
          <div className="action-buttons">
            <a 
              href="/3d-app/index.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary"
            >
              بازکردن نسخه مستقل
            </a>
            <a href="/" className="btn-secondary">
              بازگشت به صفحه اصلی
            </a>
          </div>
        </div>
      )}

      {/* iframe با مدیریت خطا */}
      <div 
        className="iframe-container" 
        style={{ display: iframeError ? 'none' : 'block' }}
      >
        <iframe
          src="/3d-app/index.html"
          width="100%"
          height="600px"
          style={{
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            background: 'white',
            display: loading ? 'none' : 'block'
          }}
          title="3D Conversion Tool"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default ThreeDApp;
