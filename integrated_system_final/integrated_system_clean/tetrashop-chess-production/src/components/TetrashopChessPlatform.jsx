import React, { useState, useEffect } from 'react';
import SimpleChess2D from './SimpleChess2D';
import Chess3DOptimized from './Chess3DOptimized';
import ChessAcademy from './ChessAcademy';
import PricingPlans from './PricingPlans';
import TetrashopWallet from './TetrashopWallet';
import TetrashopLeaderboard from './TetrashopLeaderboard';
import { chess3dRevenue } from '../utils/chess3dRevenue';

const TetrashopChessPlatform = () => {
  const [activeTab, setActiveTab] = useState('play');
  const [gameMode, setGameMode] = useState('2d');
  const [user, setUser] = useState(null);
  const [tetraCoins, setTetraCoins] = useState(0);
  const [performanceReport, setPerformanceReport] = useState(null);

  useEffect(() => {
    const mockUser = {
      id: 'user_123',
      wallet: 'TT1234567890',
      subscriptionTier: 'pro', // کاربران pro به 3D دسترسی دارند
      referralCode: 'TETRA_CHESS_2024',
      coins: 1500
    };
    
    setUser(mockUser);
    setTetraCoins(mockUser.coins);
    setPerformanceReport(chess3dRevenue.getPerformanceReport());
  }, []);

  const earnCoins = (amount, reason) => {
    setTetraCoins(prev => {
      const newAmount = prev + amount;
      console.log(`💰 کسب ${amount} سکه تترا - دلیل: ${reason}`);
      
      // ثبت در سیستم درآمدزایی 3D
      if (reason.includes('3D')) {
        const activity = reason.includes('انتخاب') ? 'piece_select' : 
                        reason.includes('چرخش') ? 'camera_move' : 'piece_move';
        chess3dRevenue.recordActivity(activity);
        setPerformanceReport(chess3dRevenue.getPerformanceReport());
      }
      
      return newAmount;
    });
  };

  const pricingPlans = {
    free: {
      name: "مبتدی",
      price: 0,
      tetraPrice: 0,
      features: [
        "بازی شطرنج 2D پایه",
        "آموزش مقدماتی",
        "نمای 3D محدود",
        "کسب 5 سکه تترا به ازای هر بازی"
      ],
      color: "#10b981"
    },
    pro: {
      name: "حرفه‌ای",
      price: 10,
      tetraPrice: 1000,
      features: [
        "شطرنج 3D پیشرفته با Three.js",
        "آنالیز حرفه‌ای بازی‌ها",
        "کنترل‌های کامل دوربین 3D",
        "سیستم درآمدزایی پیشرفته",
        "کسب 20 سکه تترا به ازای هر بازی"
      ],
      color: "#f59e0b"
    },
    master: {
      name: "استاد",
      price: 30,
      tetraPrice: 3000,
      features: [
        "مربی هوش مصنوعی شخصی",
        "شطرنج 3D با گرافیک فوق‌العاده",
        "ابزارهای تحلیل پیشرفته",
        "پشتیبانی VIP",
        "کسب 50 سکه تترا به ازای هر بازی"
      ],
      color: "#ef4444"
    }
  };

  return (
    <div className="tetrashop-chess-platform">
      <header className="tetrashop-header">
        <div className="header-brand">
          <div className="logo">
            <span className="tetra-icon">₮</span>
            <h1>شطرنج تتراشاپ - پلتفرم 3D</h1>
          </div>
          <p>تجربه بازی شطرنج سه‌بعدی با درآمدزایی هوشمند • نسخه بهینه‌شده</p>
        </div>
        
        <div className="header-wallet">
          <TetrashopWallet 
            coins={tetraCoins} 
            userId={user?.id}
            onEarnCoins={earnCoins}
          />
        </div>
      </header>

      <nav className="platform-nav">
        <button 
          className={activeTab === 'play' ? 'active' : ''}
          onClick={() => setActiveTab('play')}
        >
          🎮 بازی شطرنج
        </button>
        <button 
          className={activeTab === 'learn' ? 'active' : ''}
          onClick={() => setActiveTab('learn')}
        >
          📚 آکادمی 3D
        </button>
        <button 
          className={activeTab === 'performance' ? 'active' : ''}
          onClick={() => setActiveTab('performance')}
        >
          📊 عملکرد مالی
        </button>
        <button 
          className={activeTab === 'pricing' ? 'active' : ''}
          onClick={() => setActiveTab('pricing')}
        >
          💰 طرح‌های درآمدی
        </button>
      </nav>

      <main className="platform-main">
        {activeTab === 'play' && (
          <div className="play-section">
            <div className="game-mode-selector">
              <button 
                className={gameMode === '2d' ? 'active' : ''}
                onClick={() => setGameMode('2d')}
              >
                🎨 شطرنج 2D
              </button>
              <button 
                className={gameMode === '3d' ? 'active' : ''}
                onClick={() => {
                  if (user?.subscriptionTier === 'free') {
                    alert('💎 برای دسترسی به شطرنج 3D، طرح حرفه‌ای را انتخاب کنید!');
                    setActiveTab('pricing');
                  } else {
                    setGameMode('3d');
                  }
                }}
                style={{
                  opacity: user?.subscriptionTier === 'free' ? 0.6 : 1
                }}
              >
                {user?.subscriptionTier === 'free' ? '🔒 شطرنج 3D (پرمیوم)' : '🎮 شطرنج 3D پیشرفته'}
              </button>
            </div>

            <div className="game-container">
              {gameMode === '2d' ? 
                <SimpleChess2D onEarnCoins={earnCoins} /> : 
                <Chess3DOptimized onEarnCoins={earnCoins} />
              }
            </div>

            {gameMode === '3d' && performanceReport && (
              <div className="performance-widget">
                <h4>📊 عملکرد مالی 3D:</h4>
                <div className="performance-stats">
                  <div>کل درآمد: <strong>{performanceReport.totalEarnings} سکه</strong></div>
                  <div>تعاملات: <strong>{performanceReport.interactions} مورد</strong></div>
                  <div>پتانسیل درآمد: <strong>{performanceReport.potentialEarnings} سکه</strong></div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'performance' && performanceReport && (
          <div className="performance-dashboard">
            <h2>📊 داشبورد عملکرد مالی 3D</h2>
            <div className="performance-grid">
              <div className="stat-card">
                <h3>💰 کل درآمد</h3>
                <p className="stat-value">{performanceReport.totalEarnings} سکه</p>
              </div>
              <div className="stat-card">
                <h3>🕒 مدت session</h3>
                <p className="stat-value">{performanceReport.sessionDuration}</p>
              </div>
              <div className="stat-card">
                <h3>📈 درآمد هر دقیقه</h3>
                <p className="stat-value">{performanceReport.earningsPerMinute} سکه</p>
              </div>
              <div className="stat-card">
                <h3>🎯 امتیاز تعامل</h3>
                <p className="stat-value">{performanceReport.engagementScore}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learn' && <ChessAcademy onEarnCoins={earnCoins} />}
        {activeTab === 'pricing' && <PricingPlans plans={pricingPlans} user={user} />}
      </main>
    </div>
  );
};

export default TetrashopChessPlatform;
