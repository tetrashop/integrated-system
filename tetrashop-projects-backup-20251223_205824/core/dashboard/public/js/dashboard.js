// تابع به‌روزرسانی زمان
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('fa-IR');
    document.getElementById('current-time').textContent = timeString;
    
    // به‌روزرسانی آخرین بروزرسانی
    const lastUpdate = now.toLocaleString('fa-IR');
    document.getElementById('last-update').textContent = lastUpdate;
}

// تابع ایجاد نمودار
function createChart() {
    const ctx = document.getElementById('servicesChart').getContext('2d');
    
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['هوش مصنوعی', 'گرافیک و رسانه', 'امنیت', 'سیستم و بهینه‌سازی', 'بهره‌وری', 'توسعه'],
            datasets: [{
                data: [3, 6, 3, 8, 2, 1],
                backgroundColor: [
                    '#4CAF50', // هوش مصنوعی
                    '#2196F3', // گرافیک
                    '#F44336', // امنیت
                    '#FF9800', // سیستم
                    '#9C27B0', // بهره‌وری
                    '#607D8B'  // توسعه
                ],
                borderWidth: 2,
                borderColor: 'white'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    rtl: true,
                    labels: {
                        font: {
                            family: 'Tahoma'
                        }
                    }
                },
                tooltip: {
                    rtl: true,
                    bodyFont: {
                        family: 'Tahoma'
                    }
                }
            }
        }
    });
}

// تابع کنترل سرویس
async function controlService(serviceId, action) {
    try {
        const response = await fetch(\`/api/service/\${serviceId}/control\`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: action })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(\`✅ عملیات \${action} برای سرویس \${serviceId} موفق بود\`);
            // ریفرش داده‌ها
            refreshData();
        } else {
            alert(\`❌ خطا در عملیات: \${result.message}\`);
        }
    } catch (error) {
        alert('❌ خطا در ارتباط با سرور');
    }
}

// تابع مشاهده دسته‌بندی
function viewCategory(categoryName) {
    alert(\`مشاهده دسته‌بندی: \${categoryName}\\nاین بخش در حال توسعه است.\`);
}

// تابع مشاهده جزئیات سرویس
function showDetails(serviceId) {
    alert(\`جزئیات سرویس: \${serviceId}\\nاین بخش در حال توسعه است.\`);
}

// تابع به‌روزرسانی داده‌ها
async function refreshData() {
    try {
        const response = await fetch('/api/dashboard-data');
        const data = await response.json();
        
        if (data.success) {
            console.log('Data refreshed:', data);
            // در اینجا می‌توانید UI را به‌روز کنید
            // برای نمونه، یک نوتیفیکیشن نشان دهید
            showNotification('✅ داده‌ها با موفقیت به‌روز شدند');
        }
    } catch (error) {
        console.error('Error refreshing data:', error);
    }
}

// تابع نمایش نوتیفیکیشن
function showNotification(message) {
    // ایجاد یک نوتیفیکیشن موقت
    const notification = document.createElement('div');
    notification.style.cssText = \`
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideDown 0.3s ease;
    \`;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// تابع اولیه‌سازی
function initDashboard() {
    // به‌روزرسانی زمان هر ثانیه
    updateTime();
    setInterval(updateTime, 1000);
    
    // ایجاد نمودار
    createChart();
    
    // به‌روزرسانی خودکار داده‌ها هر 30 ثانیه
    setInterval(refreshData, 30000);
    
    // ریفرش دستی با کلید R
    document.addEventListener('keydown', (e) => {
        if (e.key === 'r' || e.key === 'R') {
            refreshData();
        }
    });
    
    console.log('📊 داشبورد Tetrashop آماده است!');
}

// اجرا هنگام لود صفحه
document.addEventListener('DOMContentLoaded', initDashboard);
