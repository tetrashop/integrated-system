import React, { useState } from 'react';

const ThreeDApp = () => {
  const [selectedPlan, setSelectedPlan] = useState('free');

  const plans = {
    free: {
      name: 'رایگان',
      price: 0,
      features: ['۵ تبدیل در ماه', 'پیش‌نمایش آنلاین', 'دانلود با واترمارک', 'رندر پایه'],
      conversions: 5
    },
    basic: {
      name: 'پایه',
      price: 5,
      features: ['۵۰ تبدیل در ماه', 'پیش‌نمایش HD', 'دانلود بدون واترمارک', 'رندر حرفه‌ای', 'پشتیبانی ایمیل'],
      conversions: 50
    },
    pro: {
      name: 'حرفه‌ای',
      price: 15,
      features: ['تبدیل نامحدود', 'پیش‌نمایش 4K', 'دانلود فوری', 'رندر واقع‌گرا', 'پشتیبانی اختصاصی', 'تبدیل دسته‌ای'],
      conversions: 'نامحدود'
    }
  };

  // آدرس نهایی اپلیکیشن 3D
  const threeDAppUrl = "https://tetrashop-3d-converter.netlify.app";

  return (
    <div className="app-page">
      <div className="app-header">
        <h2>🔄 سرویس تبدیل 3D تتراشاپ</h2>
        <p>با موتور تبدیل اختصاصی ما - سریع، امن، اقتصادی</p>
      </div>

      {/* نمایش اپلیکیشن واقعی */}
      <div style={{
        background: 'white', 
        padding: '1rem', 
        borderRadius: '12px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h4 style={{textAlign: 'center', marginBottom: '1rem'}}>🎮 اپلیکیشن تبدیل 3D ما</h4>
        <iframe
          src={threeDAppUrl}
          width="100%"
          height="600px"
          style={{
            border: 'none', 
            borderRadius: '8px',
            background: '#f8fafc'
          }}
          title="تبدیل 3D تتراشاپ"
          loading="lazy"
        />
        <p style={{textAlign: 'center', marginTop: '1rem', color: '#6b7280'}}>
          💡 از اپلیکیشن بالا مستقیماً استفاده کنید - تبدیل فایل‌های 3D در لحظه
        </p>
      </div>

      {/* قیمت‌گذاری */}
      <div style={{textAlign: 'center'}}>
        <h3>🎯 انتخاب طرح مناسب</h3>
        <p>برای دسترسی کامل به تمامی ویژگی‌ها، یکی از طرح‌های زیر را انتخاب کنید:</p>
        
        <div style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem', 
          margin: '2rem 0'
        }}>
          {Object.entries(plans).map(([key, plan]) => (
            <div 
              key={key}
              style={{
                padding: '2rem 1.5rem',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: selectedPlan === key ? '2px solid #2563eb' : '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                transform: selectedPlan === key ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <h4 style={{color: '#1f2937', marginBottom: '1rem'}}>{plan.name}</h4>
              <div style={{
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: plan.price === 0 ? '#10b981' : '#2563eb',
                marginBottom: '0.5rem'
              }}>
                {plan.price === 0 ? 'رایگان' : `$${plan.price}`}
              </div>
              <p style={{color: '#6b7280', marginBottom: '1.5rem'}}>
                {plan.conversions} تبدیل در ماه
              </p>
              <ul style={{
                textAlign: 'right', 
                padding: '0', 
                listStyle: 'none',
                marginBottom: '1.5rem'
              }}>
                {plan.features.map((feature, i) => (
                  <li key={i} style={{
                    margin: '0.5rem 0',
                    padding: '0.3rem 0',
                    fontSize: '0.9rem'
                  }}>✅ {feature}</li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedPlan(key)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: selectedPlan === key ? '#10b981' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                {selectedPlan === key ? '✓ انتخاب شده' : 'انتخاب این طرح'}
              </button>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div style={{
            padding: '2.5rem',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            borderRadius: '12px',
            marginTop: '2rem',
            border: '1px solid #bae6fd'
          }}>
            <h4 style={{color: '#0369a1', marginBottom: '1rem'}}>
              🎉 طرح {plans[selectedPlan].name} انتخاب شد!
            </h4>
            <p style={{marginBottom: '1.5rem', color: '#0c4a6e'}}>
              برای تکمیل خرید و فعال‌سازی سرویس، روی دکمه زیر کلیک کنید:
            </p>
            
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button style={{
                padding: '1rem 2rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}>
                💳 {plans[selectedPlan].price === 0 ? 'فعال‌سازی رایگان' : `پرداخت $${plans[selectedPlan].price}`}
              </button>
              
              <button 
                onClick={() => setSelectedPlan('free')}
                style={{
                  padding: '1rem 2rem',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                تغییر طرح
              </button>
            </div>
            
            <p style={{
              marginTop: '1.5rem',
              fontSize: '0.8rem',
              color: '#475569'
            }}>
              ✅ پرداخت امن • فعال‌سازی آنی • پشتیبانی ۲۴ ساعته
            </p>
          </div>
        )}
      </div>

      {/* اطلاعات اضافی */}
      <div style={{
        marginTop: '3rem',
        padding: '2rem',
        background: '#f8fafc',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h4>📞 نیاز به کمک دارید؟</h4>
        <p style={{marginBottom: '1rem', color: '#6b7280'}}>
          تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست
        </p>
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button style={{
            padding: '0.8rem 1.5rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            📧 تماس با پشتیبانی
          </button>
          <button style={{
            padding: '0.8rem 1.5rem',
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            📚 راهنمای استفاده
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThreeDApp;
