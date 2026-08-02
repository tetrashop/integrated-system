import React, { useState, useRef } from 'react';
import './ThreeDConverter.css';

const ThreeDConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedModel, setConvertedModel] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [renderedImage, setRenderedImage] = useState(null);
  const [freeSampleUsed, setFreeSampleUsed] = useState(false);
  const fileInputRef = useRef(null);

  const plans = {
    free: {
      name: 'رایگان',
      price: 0,
      originalPrice: 0,
      features: [
        '۱ نمونه تبدیل رایگان در ماه',
        '۵ تبدیل اضافی (پس از ثبت نام)',
        'پیش‌نمایش آنلاین',
        'دانلود با واترمارک',
        'رندر پایه'
      ],
      conversions: '۱+۵',
      discount: 'رایگان همیشگی'
    },
    basic: {
      name: 'پایه',
      price: 4,
      originalPrice: 5,
      features: [
        '۵۰ تبدیل در ماه',
        'پیش‌نمایش HD',
        'دانلود بدون واترمارک',
        'رندر حرفه‌ای',
        'پشتیبانی ایمیل',
        'تبدیل دسته‌ای'
      ],
      conversions: 50,
      discount: '۲۰٪ تخفیف'
    },
    pro: {
      name: 'حرفه‌ای',
      price: 12,
      originalPrice: 15,
      features: [
        'تبدیل نامحدود',
        'پیش‌نمایش 4K',
        'دانلود فوری',
        'رندر واقع‌گرا',
        'پشتیبانی اختصاصی',
        'تبدیل دسته‌ای',
        'API دسترسی'
      ],
      conversions: 'نامحدود',
      discount: '۲۰٪ تخفیف'
    }
  };

  // نمونه فایل رایگان برای تست
  const freeSampleFiles = [
    {
      name: "sample-cube.obj",
      size: "2.1 MB",
      preview: "https://via.placeholder.com/400x300/667eea/ffffff?text=مکعب+3D",
      downloadUrl: "#"
    },
    {
      name: "sample-sphere.stl",
      size: "1.8 MB",
      preview: "https://via.placeholder.com/400x300/10b981/ffffff?text=کره+3D",
      downloadUrl: "#"
    }
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      simulateUpload(file);
    }
  };

  const handleFreeSample = (sampleFile) => {
    setSelectedFile(sampleFile);
    setFreeSampleUsed(true);
    simulateUpload(sampleFile, true);
  };

  const simulateUpload = (file, isFreeSample = false) => {
    setIsConverting(true);
    setConversionProgress(0);
    
    const interval = setInterval(() => {
      setConversionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsConverting(false);
          
          const convertedFile = {
            name: file.name.replace(/\.[^/.]+$/, ".glb"),
            size: file.size ? (file.size / 1024 / 1024).toFixed(2) + " MB" : file.size,
            format: "GLB",
            isFreeSample: isFreeSample
          };
          
          setConvertedModel(convertedFile);
          simulateImageRender();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const simulateImageRender = () => {
    setTimeout(() => {
      setRenderedImage("https://via.placeholder.com/400x300/8b5cf6/ffffff?text=مدل+3D+تبدیل+شده");
    }, 1000);
  };

  const handleConvert = () => {
    if (!selectedFile) {
      alert('لطفاً یک فایل انتخاب کنید');
      return;
    }
    
    if (selectedPlan === 'free' && freeSampleUsed) {
      alert('🎉 نمونه رایگان شما استفاده شد! برای تبدیل‌های بیشتر، یکی از طرح‌ها را انتخاب کنید.');
      return;
    }
    
    simulateUpload(selectedFile);
  };

  const handleDownload = () => {
    if (convertedModel) {
      if (convertedModel.isFreeSample) {
        alert('🎁 دانلود نمونه رایگان آغاز شد! این نمونه برای آشنایی با سرویس ماست.');
      } else {
        alert(`دانلود فایل ${convertedModel.name} آغاز شد!`);
      }
      
      // شبیه‌سازی دانلود
      const link = document.createElement('a');
      link.href = '#';
      link.download = convertedModel.name;
      link.click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
      simulateUpload(files[0]);
    }
  };

  return (
    <div className="converter-container">
      {/* هدر با تخفیف ویژه */}
      <div className="converter-header">
        <div className="special-offer">
          <span className="offer-badge">🎁 تخفیف ویژه</span>
          <h1>🎮 تبدیل و رندر 3D تتراشاپ</h1>
          <p>۱ نمونه تبدیل <strong>رایگان</strong> + تخفیف ۲۰٪ روی تمام پلن‌ها!</p>
        </div>
      </div>

      <div className="converter-layout">
        {/* سمت چپ: آپلود و تبدیل */}
        <div className="upload-section">
          {/* نمونه‌های رایگان */}
          <div className="free-samples">
            <h3>🎁 نمونه‌های رایگان برای تست</h3>
            <p>می‌توانید از این نمونه‌ها برای آشنایی با سرویس استفاده کنید:</p>
            <div className="samples-grid">
              {freeSampleFiles.map((sample, index) => (
                <div key={index} className="sample-card">
                  <div className="sample-preview">
                    <img src={sample.preview} alt={sample.name} />
                  </div>
                  <div className="sample-info">
                    <h4>{sample.name}</h4>
                    <p>حجم: {sample.size}</p>
                    <button 
                      className="sample-btn"
                      onClick={() => handleFreeSample(sample)}
                      disabled={freeSampleUsed}
                    >
                      {freeSampleUsed ? '✅ استفاده شده' : '🆓 استفاده رایگان'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div 
            className="upload-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-icon">📁</div>
            <h3>فایل خود را اینجا رها کنید یا کلیک کنید</h3>
            <p>فرمت‌های پشتیبانی شده: OBJ, FBX, STL, GLTF, GLB</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".obj,.fbx,.stl,.gltf,.glb"
              style={{ display: 'none' }}
            />
          </div>

          {selectedFile && (
            <div className="file-info">
              <h4>📄 فایل انتخاب شده:</h4>
              <p>نام: {selectedFile.name}</p>
              <p>حجم: {selectedFile.size || '2.1 MB'}</p>
              {selectedFile.isFreeSample && (
                <p style={{color: '#10b981', fontWeight: 'bold'}}>🎁 نمونه رایگان</p>
              )}
            </div>
          )}

          {isConverting && (
            <div className="conversion-progress">
              <h4>🔄 در حال تبدیل...</h4>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${conversionProgress}%` }}
                ></div>
              </div>
              <span>{conversionProgress}%</span>
            </div>
          )}

          <button 
            className="convert-btn"
            onClick={handleConvert}
            disabled={!selectedFile || isConverting || (selectedPlan === 'free' && freeSampleUsed)}
          >
            {isConverting ? '⏳ در حال تبدیل...' : 
             selectedPlan === 'free' && freeSampleUsed ? '🎁 نمونه استفاده شده' : '🚀 شروع تبدیل'}
          </button>

          {selectedPlan === 'free' && freeSampleUsed && (
            <div className="free-limit-message">
              <p>🎉 نمونه رایگان شما استفاده شد!</p>
              <p>برای تبدیل‌های بیشتر، یکی از طرح‌های زیر را انتخاب کنید:</p>
            </div>
          )}
        </div>

        {/* سمت راست: پیش‌نمایش و نتایج */}
        <div className="preview-section">
          {/* پیش‌نمایش مدل 3D */}
          <div className="model-preview">
            <h3>👁️ پیش‌نمایش مدل</h3>
            {renderedImage ? (
              <div className="image-preview">
                <img src={renderedImage} alt="3D Model Preview" />
                <div className="preview-controls">
                  <button className="control-btn">🔄 چرخش</button>
                  <button className="control-btn">🔍 زوم</button>
                  <button className="control-btn">⚡ نور</button>
                </div>
              </div>
            ) : (
              <div className="preview-placeholder">
                <div className="placeholder-icon">🎭</div>
                <p>پس از تبدیل، پیش‌نمایش مدل اینجا نمایش داده می‌شود</p>
                <p style={{fontSize: '0.9rem', color: '#6b7280', marginTop: '1rem'}}>
                  🎁 می‌توانید از نمونه‌های رایگان استفاده کنید
                </p>
              </div>
            )}
          </div>

          {/* اطلاعات مدل تبدیل شده */}
          {convertedModel && (
            <div className="conversion-result">
              <h3>
                {convertedModel.isFreeSample ? '🎁 تبدیل نمونه رایگان' : '✅ تبدیل موفق'}
              </h3>
              <div className="result-info">
                <p><strong>نام فایل:</strong> {convertedModel.name}</p>
                <p><strong>حجم:</strong> {convertedModel.size}</p>
                <p><strong>فرمت:</strong> {convertedModel.format}</p>
                <p><strong>کیفیت:</strong> 🟢 عالی</p>
                {convertedModel.isFreeSample && (
                  <p style={{color: '#10b981', fontWeight: 'bold'}}>
                    🎁 این یک نمونه رایگان است
                  </p>
                )}
              </div>
              
              <div className="action-buttons">
                <button className="download-btn" onClick={handleDownload}>
                  {convertedModel.isFreeSample ? '🎁 دانلود رایگان' : '⬇️ دانلود فایل'}
                </button>
                <button className="share-btn">
                  🔗 اشتراک‌گذاری
                </button>
              </div>

              {convertedModel.isFreeSample && (
                <div className="free-sample-notice">
                  <p>💡 این نمونه رایگان برای آشنایی با کیفیت سرویس ماست</p>
                  <p>برای تبدیل فایل‌های خود، یکی از طرح‌ها را انتخاب کنید</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* بخش انتخاب پلن با تخفیف */}
      <div className="plans-section">
        <div className="section-header">
          <h2>🎯 انتخاب طرح مناسب با تخفیف ویژه</h2>
          <div className="discount-banner">
            <span className="discount-text">🔥 تخفیف ۲۰٪ برای همه پلن‌ها!</span>
            <span className="discount-time">⏰ این پیشنهاد محدود است</span>
          </div>
        </div>
        
        <div className="plans-grid">
          {Object.entries(plans).map(([key, plan]) => (
            <div 
              key={key}
              className={`plan-card ${selectedPlan === key ? 'selected' : ''} ${key === 'free' ? 'free-plan' : ''}`}
              onClick={() => setSelectedPlan(key)}
            >
              {plan.discount && (
                <div className="discount-badge">
                  {plan.discount}
                </div>
              )}
              
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  {plan.price === 0 ? (
                    <span className="free-price">رایگان</span>
                  ) : (
                    <div className="price-with-discount">
                      <span className="current-price">${plan.price}</span>
                      {plan.originalPrice > plan.price && (
                        <span className="original-price">${plan.originalPrice}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="plan-conversions">
                {plan.conversions} تبدیل در ماه
              </div>
              
              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index}>✅ {feature}</li>
                ))}
              </ul>
              
              <button className={`plan-select-btn ${selectedPlan === key ? 'selected' : ''}`}>
                {selectedPlan === key ? '✓ انتخاب شده' : 
                 key === 'free' ? '🆓 شروع رایگان' : '💳 انتخاب طرح'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ویژگی‌های پیشرفته */}
      <div className="features-showcase">
        <h2>✨ چرا سرویس تبدیل 3D ما؟</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">🎁</div>
            <h4>نمونه رایگان</h4>
            <p>۱ تبدیل رایگان در ماه برای تست سرویس</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <h4>تبدیل سریع</h4>
            <p>تبدیل فایل‌ها در کمترین زمان ممکن</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🎯</div>
            <h4>کیفیت بالا</h4>
            <p>تبدیل با بالاترین کیفیت و دقت</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💰</div>
            <h4>قیمت مناسب</h4>
            <p>تخفیف‌های ویژه و قیمت‌های رقابتی</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDConverter;
