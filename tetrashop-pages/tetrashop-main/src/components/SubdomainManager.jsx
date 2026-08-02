import React from 'react';
import { TETRASHOP_SUBDOMAINS, checkSubdomainStatus } from '../config/subdomains';

const SubdomainManager = () => {
  const activeSubdomains = Object.values(TETRASHOP_SUBDOMAINS).filter(
    sub => sub.status === "active"
  );

  const handleSubdomainClick = (subdomain) => {
    // ثبت آمار کلیک
    console.log(`🌐 کاربر به ${subdomain.name} هدایت شد`);
    
    // باز کردن در تب جدید
    window.open(subdomain.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="subdomain-manager">
      <div className="manager-header">
        <h2>🌐 پلتفرم‌های تتراشاپ</h2>
        <p>دسترسی به تمام سرویس‌های فعال تتراشاپ</p>
      </div>

      <div className="subdomains-grid">
        {activeSubdomains.map((subdomain, index) => (
          <div 
            key={index}
            className="subdomain-card"
            onClick={() => handleSubdomainClick(subdomain)}
          >
            <div className="subdomain-icon">{subdomain.icon}</div>
            <div className="subdomain-info">
              <h3>{subdomain.name}</h3>
              <p>{subdomain.description}</p>
              <div className="subdomain-features">
                {subdomain.features?.map((feature, i) => (
                  <span key={i} className="feature-tag">#{feature}</span>
                ))}
              </div>
              <div className="subdomain-status">
                <span className="status-badge active">فعال</span>
                {subdomain.revenue && (
                  <span className="revenue-badge">💰 درآمدزایی</span>
                )}
              </div>
            </div>
            <div className="subdomain-action">
              <button className="visit-btn">
                🚀 ورود به پلتفرم
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="subdomain-stats">
        <div className="stat-item">
          <strong>{activeSubdomains.length}</strong>
          <span>پلتفرم فعال</span>
        </div>
        <div className="stat-item">
          <strong>{activeSubdomains.filter(s => s.revenue).length}</strong>
          <span>درآمدزایی</span>
        </div>
        <div className="stat-item">
          <strong>۲</strong>
          <span>دسته‌بندی</span>
        </div>
      </div>
    </div>
  );
};

export default SubdomainManager;
