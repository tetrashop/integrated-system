// داشبورد تعاملی TetraSaaS
document.addEventListener('DOMContentLoaded', function() {
    // عناصر DOM
    const servicesContainer = document.getElementById('servicesContainer');
    const categoryItems = document.querySelectorAll('.category-list li');
    const btnRefresh = document.querySelector('.btn-refresh');
    const searchInput = document.querySelector('.search-box input');
    const detailPanel = document.getElementById('detailPanel');
    const detailContent = document.getElementById('detailContent');
    const closeDetailsBtn = document.getElementById('closeDetails');
    const updateTimeEl = document.getElementById('updateTime');
    
    // متغیرهای وضعیت
    let currentCategory = 'all';
    let currentSearch = '';
    let charts = {};
    
    // راه‌اندازی اولیه
    initializeDashboard();
    renderServices(currentCategory);
    initializeCharts();
    
    // رویدادها
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // حذف کلاس active از همه
            categoryItems.forEach(i => i.classList.remove('active'));
            // اضافه کردن به آیتم فعلی
            this.classList.add('active');
            // تغییر دسته‌بندی
            currentCategory = this.dataset.category;
            renderServices(currentCategory);
        });
    });
    
    btnRefresh.addEventListener('click', function() {
        refreshDashboard();
    });
    
    searchInput.addEventListener('input', function(e) {
        currentSearch = e.target.value.toLowerCase();
        renderServices(currentCategory);
    });
    
    closeDetailsBtn.addEventListener('click', function() {
        detailPanel.classList.remove('active');
    });
    
    // توابع اصلی
    function initializeDashboard() {
        // به‌روزرسانی زمان
        updateTime();
        setInterval(updateTime, 60000); // هر دقیقه
        
        // نمایش آمار
        updateStats();
    }
    
    function renderServices(categoryId) {
        // فیلتر سرویس‌ها
        let services = filterServicesByCategory(categoryId);
        
        // جستجو
        if (currentSearch) {
            services = services.filter(service => 
                service.name.toLowerCase().includes(currentSearch) ||
                service.description.toLowerCase().includes(currentSearch) ||
                service.code.toLowerCase().includes(currentSearch)
            );
        }
        
        // رندر سرویس‌ها
        servicesContainer.innerHTML = '';
        
        if (services.length === 0) {
            servicesContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>سرویسی یافت نشد</h3>
                    <p>لطفا جستجوی خود را تغییر دهید</p>
                </div>
            `;
            return;
        }
        
        services.forEach(service => {
            const serviceElement = createServiceCard(service);
            servicesContainer.appendChild(serviceElement);
        });
        
        // به‌روزرسانی شمارنده
        updateCategoryCounts();
    }
    
    function createServiceCard(service) {
        const categoryColor = getCategoryColor(service.parent);
        const categoryName = getCategoryName(service.parent);
        
        // رنگ‌های وضعیت
        let statusClass = 'status-active';
        let statusText = 'فعال';
        
        if (service.health < 80) {
            statusClass = 'status-warning';
            statusText = 'نیاز به توجه';
        } else if (service.health < 50) {
            statusClass = 'status-danger';
            statusText = 'مشکل';
        }
        
        const card = document.createElement('div');
        card.className = `service-card category-${service.parent}`;
        card.dataset.serviceId = service.id;
        
        card.innerHTML = `
            <div class="service-header">
                <div class="service-title">
                    <h3>${service.name}</h3>
                    <span class="service-category">${categoryName}</span>
                </div>
                <div class="service-status">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                    <span class="service-port">:${service.port}</span>
                </div>
            </div>
            
            <div class="service-icon" style="background: ${categoryColor}20; color: ${categoryColor}">
                <i class="${service.icon || 'fas fa-cube'}"></i>
            </div>
            
            <p class="service-description">${service.description}</p>
            
            <div class="service-metrics">
                <div class="metric">
                    <div class="metric-label">سلامت</div>
                    <div class="metric-value">${service.health}%</div>
                </div>
                <div class="metric">
                    <div class="metric-label">زمان پاسخ</div>
                    <div class="metric-value">${service.responseTime}ms</div>
                </div>
                <div class="metric">
                    <div class="metric-label">کاربرد</div>
                    <div class="metric-value">${service.usage.toLocaleString()}</div>
                </div>
            </div>
            
            <div class="service-actions">
                <button class="action-btn" onclick="showServiceDetails(${service.id})">
                    <i class="fas fa-info-circle"></i> جزئیات
                </button>
                <button class="action-btn primary" onclick="simulateService(${service.id})">
                    <i class="fas fa-play"></i> شبیه‌سازی
                </button>
                <button class="action-btn" onclick="restartService(${service.id})">
                    <i class="fas fa-redo"></i> راه‌اندازی
                </button>
            </div>
        `;
        
        // رویداد کلیک برای نمایش جزئیات
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button')) {
                showServiceDetails(service.id);
            }
        });
        
        return card;
    }
    
    function updateCategoryCounts() {
        // به‌روزرسانی شمارنده‌های دسته‌بندی
        tetraServices.categories.forEach(category => {
            const count = category.children.length;
            const countElement = document.querySelector(`[data-category="${category.id}"] .count`);
            if (countElement) {
                countElement.textContent = count;
            }
        });
        
        // به‌روزرسانی همه
        const allCountElement = document.querySelector('[data-category="all"] .count');
        if (allCountElement) {
            allCountElement.textContent = allServices.length;
        }
    }
    
    function updateStats() {
        // محاسبه آمار کل
        const totalHealth = allServices.reduce((sum, service) => sum + service.health, 0) / allServices.length;
        const avgResponse = allServices.reduce((sum, service) => sum + service.responseTime, 0) / allServices.length;
        const totalUsage = allServices.reduce((sum, service) => sum + service.usage, 0);
        
        // به‌روزرسانی نوار سلامت
        const healthBar = document.querySelector('.health-progress');
        const healthPercent = document.querySelector('.health-percent');
        if (healthBar && healthPercent) {
            healthBar.style.width = `${totalHealth}%`;
            healthPercent.textContent = `${Math.round(totalHealth)}%`;
        }
        
        // به‌روزرسانی کارت‌های آماری
        document.querySelectorAll('.stat-card')[0].querySelector('.stat-value').textContent = 
            `${Math.round(totalHealth)}/${Math.round(totalHealth)}`;
        
        document.querySelectorAll('.stat-card')[1].querySelector('.stat-value').textContent = 
            `${allServices.length}/${allServices.length}`;
        
        document.querySelectorAll('.stat-card')[2].querySelector('.stat-value').textContent = 
            `${Math.round(avgResponse)}ms`;
        
        document.querySelectorAll('.stat-card')[3].querySelector('.stat-value').textContent = 
            totalUsage.toLocaleString();
    }
    
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('fa-IR');
        const dateString = now.toLocaleDateString('fa-IR');
        
        if (updateTimeEl) {
            updateTimeEl.textContent = `${dateString} - ${timeString}`;
        }
    }
    
    function refreshDashboard() {
        // انیمیشن دکمه
        btnRefresh.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال بروزرسانی...';
        btnRefresh.disabled = true;
        
        // شبیه‌سازی بروزرسانی
        setTimeout(() => {
            // به‌روزرسانی تصادفی وضعیت سرویس‌ها
            allServices.forEach(service => {
                // تغییرات جزئی در آمار
                service.health = Math.min(100, Math.max(80, service.health + (Math.random() * 4 - 2)));
                service.responseTime = Math.max(50, service.responseTime + (Math.random() * 10 - 5));
                service.usage += Math.floor(Math.random() * 100);
            });
            
            // رندر مجدد
            renderServices(currentCategory);
            updateStats();
            updateCharts();
            
            // بازنشانی دکمه
            btnRefresh.innerHTML = '<i class="fas fa-sync-alt"></i> بروزرسانی';
            btnRefresh.disabled = false;
            
            // پیام موفقیت
            showNotification('داشبورد با موفقیت بروزرسانی شد', 'success');
        }, 1500);
    }
    
    function initializeCharts() {
        // نمودار توزیع
        const distCtx = document.getElementById('processingChart').getContext('2d');
        charts.distribution = new Chart(distCtx, {
            type: 'doughnut',
            data: {
                labels: tetraServices.categories.map(cat => cat.name),
                datasets: [{
                    data: tetraServices.categories.map(cat => cat.children.length),
                    backgroundColor: tetraServices.categories.map(cat => cat.color),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        rtl: true
                    }
                }
            }
        });
        
        // نمودار زمانی
        const timeCtx = document.getElementById('timelineChart').getContext('2d');
        charts.timeline = new Chart(timeCtx, {
            type: 'line',
            data: {
                labels: ['ساعت ۸', 'ساعت ۱۰', 'ساعت ۱۲', 'ساعت ۱۴', 'ساعت ۱۶', 'ساعت ۱۸', 'ساعت ۲۰'],
                datasets: [
                    {
                        label: 'میانگین زمان پاسخ (ms)',
                        data: [75, 72, 71, 70, 69, 71, 73],
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'درصد سلامت',
                        data: [98, 99, 100, 100, 100, 100, 100],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        rtl: true
                    }
                }
            }
        });
    }
    
    function updateCharts() {
        if (charts.distribution) {
            // به‌روزرسانی داده‌های توزیع
            charts.distribution.data.datasets[0].data = 
                tetraServices.categories.map(cat => cat.children.length);
            charts.distribution.update();
        }
        
        if (charts.timeline) {
            // به‌روزرسانی داده‌های زمانی
            const avgResponse = Math.round(allServices.reduce((sum, s) => sum + s.responseTime, 0) / allServices.length);
            const avgHealth = Math.round(allServices.reduce((sum, s) => sum + s.health, 0) / allServices.length);
            
            // اضافه کردن نقطه جدید
            charts.timeline.data.labels.push(`ساعت ${new Date().getHours()}`);
            charts.timeline.data.datasets[0].data.push(avgResponse);
            charts.timeline.data.datasets[1].data.push(avgHealth);
            
            // محدود کردن به 10 نقطه
            if (charts.timeline.data.labels.length > 10) {
                charts.timeline.data.labels.shift();
                charts.timeline.data.datasets[0].data.shift();
                charts.timeline.data.datasets[1].data.shift();
            }
            
            charts.timeline.update();
        }
    }
    
    function showNotification(message, type = 'info') {
        // ایجاد عنصر نوتیفیکیشن
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // اضافه کردن به صفحه
        document.body.appendChild(notification);
        
        // نمایش
        setTimeout(() => notification.classList.add('show'), 10);
        
        // بستن خودکار
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // بستن دستی
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    // توابع عمومی (قابل دسترسی از HTML)
    window.showServiceDetails = function(serviceId) {
        const service = getServiceById(serviceId);
        if (!service) return;
        
        const categoryColor = getCategoryColor(service.parent);
        const categoryName = getCategoryName(service.parent);
        
        detailContent.innerHTML = `
            <div class="service-detail">
                <div class="detail-header" style="border-color: ${categoryColor}">
                    <div class="detail-title">
                        <div class="detail-icon" style="background: ${categoryColor}">
                            <i class="${service.icon || 'fas fa-cube'}"></i>
                        </div>
                        <div>
                            <h2>${service.name}</h2>
                            <p class="detail-subtitle">${categoryName} • پورت ${service.port}</p>
                        </div>
                    </div>
                    <div class="detail-status">
                        <span class="status-badge status-active">فعال</span>
                        <span class="health-score">${service.health}% سلامت</span>
                    </div>
                </div>
                
                <div class="detail-body">
                    <p class="detail-description">${service.description}</p>
                    
                    <div class="detail-metrics">
                        <div class="metric-card">
                            <i class="fas fa-heartbeat" style="color: ${categoryColor}"></i>
                            <div>
                                <h4>سلامت سرویس</h4>
                                <div class="metric-value">${service.health}%</div>
                                <div class="metric-progress">
                                    <div class="progress-bar" style="width: ${service.health}%; background: ${categoryColor}"></div>
                                </div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <i class="fas fa-tachometer-alt" style="color: ${categoryColor}"></i>
                            <div>
                                <h4>زمان پاسخ</h4>
                                <div class="metric-value">${service.responseTime}ms</div>
                                <div class="metric-label">میانگین</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <i class="fas fa-chart-line" style="color: ${categoryColor}"></i>
                            <div>
                                <h4>کاربرد روزانه</h4>
                                <div class="metric-value">${service.usage.toLocaleString()}</div>
                                <div class="metric-label">درخواست</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-list-check"></i> قابلیت‌ها</h3>
                        <ul class="feature-list">
                            ${service.features.map(feature => `<li><i class="fas fa-check" style="color: ${categoryColor}"></i> ${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-chart-bar"></i> آمار فنی</h3>
                        <div class="stats-grid">
                            ${Object.entries(service.metrics).map(([key, value]) => `
                                <div class="stat-item">
                                    <div class="stat-label">${key}</div>
                                    <div class="stat-value">${value}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="detail-actions">
                        <button class="btn-action primary" onclick="simulateService(${service.id})">
                            <i class="fas fa-play"></i> شبیه‌سازی پردازش
                        </button>
                        <button class="btn-action" onclick="restartService(${service.id})">
                            <i class="fas fa-redo"></i> راه‌اندازی مجدد
                        </button>
                        <button class="btn-action" onclick="viewLogs(${service.id})">
                            <i class="fas fa-file-alt"></i> مشاهده لاگ‌ها
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // نمایش پنل
        detailPanel.classList.add('active');
    };
    
    window.simulateService = function(serviceId) {
        const service = getServiceById(serviceId);
        if (!service) return;
        
        showNotification(`در حال شبیه‌سازی ${service.name}...`, 'info');
        
        // شبیه‌سازی پردازش
        setTimeout(() => {
            const success = Math.random() > 0.1; // 90% شانس موفقیت
            
            if (success) {
                service.usage += 1;
                showNotification(`${service.name}: پردازش با موفقیت انجام شد!`, 'success');
                renderServices(currentCategory);
                updateStats();
            } else {
                showNotification(`${service.name}: خطا در پردازش. دوباره تلاش کنید.`, 'warning');
            }
        }, 1500);
    };
    
    window.restartService = function(serviceId) {
        const service = getServiceById(serviceId);
        if (!service) return;
        
        showNotification(`در حال راه‌اندازی مجدد ${service.name}...`, 'info');
        
        setTimeout(() => {
            service.health = 100;
            service.responseTime = 50 + Math.floor(Math.random() * 50);
            showNotification(`${service.name}: با موفقیت راه‌اندازی مجدد شد`, 'success');
            renderServices(currentCategory);
            updateStats();
        }, 2000);
    };
    
    window.viewLogs = function(serviceId) {
        const service = getServiceById(serviceId);
        if (!service) return;
        
        detailContent.innerHTML = `
            <div class="logs-viewer">
                <div class="logs-header">
                    <h3><i class="fas fa-file-alt"></i> لاگ‌های ${service.name}</h3>
                    <button class="btn-action small" onclick="showServiceDetails(${serviceId})">
                        <i class="fas fa-arrow-right"></i> بازگشت
                    </button>
                </div>
                <div class="logs-content">
                    <div class="log-entry success">
                        <span class="log-time">${new Date().toLocaleTimeString('fa-IR')}</span>
                        <span class="log-message">سرویس با موفقیت راه‌اندازی شد</span>
                    </div>
                    <div class="log-entry info">
                        <span class="log-time">${new Date(Date.now() - 300000).toLocaleTimeString('fa-IR')}</span>
                        <span class="log-message">۱۰۰ درخواست با موفقیت پردازش شد</span>
                    </div>
                    <div class="log-entry">
                        <span class="log-time">${new Date(Date.now() - 600000).toLocaleTimeString('fa-IR')}</span>
                        <span class="log-message">بررسی سلامت: ۱۰۰%</span>
                    </div>
                    <div class="log-entry warning">
                        <span class="log-time">${new Date(Date.now() - 1200000).toLocaleTimeString('fa-IR')}</span>
                        <span class="log-message">زمان پاسخ به ۷۱ms بهبود یافت</span>
                    </div>
                    <div class="log-entry">
                        <span class="log-time">${new Date(Date.now() - 1800000).toLocaleTimeString('fa-IR')}</span>
                        <span class="log-message">شروع مانیتورینگ خودکار</span>
                    </div>
                </div>
            </div>
        `;
    };
});

// اضافه کردن استایل نوتیفیکیشن
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        left: 20px;
        right: 20px;
        background: white;
        padding: 16px 20px;
        border-radius: var(--radius-sm);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 1000;
        transform: translateY(-100px);
        opacity: 0;
        transition: all 0.3s ease;
        border-right: 4px solid var(--primary);
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notification-success {
        border-right-color: var(--success);
    }
    
    .notification-warning {
        border-right-color: var(--warning);
    }
    
    .notification i {
        font-size: 1.2rem;
    }
    
    .notification-success i {
        color: var(--success);
    }
    
    .notification-warning i {
        color: var(--warning);
    }
    
    .notification span {
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--gray);
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    }
    
    .notification-close:hover {
        background: var(--light);
    }
    
    /* استایل‌های پنل جزئیات */
    .service-detail {
        padding: 1rem;
    }
    
    .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 3px solid;
    }
    
    .detail-title {
        display: flex;
        gap: 1rem;
        align-items: center;
    }
    
    .detail-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        color: white;
    }
    
    .detail-subtitle {
        color: var(--gray);
        font-size: 0.9rem;
        margin-top: 4px;
    }
    
    .health-score {
        background: var(--light);
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.9rem;
        color: var(--success);
        font-weight: 600;
    }
    
    .detail-description {
        color: var(--gray);
        margin-bottom: 2rem;
        line-height: 1.6;
    }
    
    .detail-metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .metric-card {
        background: var(--light);
        padding: 1rem;
        border-radius: var(--radius-sm);
        display: flex;
        gap: 1rem;
        align-items: center;
    }
    
    .metric-card i {
        font-size: 1.8rem;
    }
    
    .metric-card h4 {
        font-size: 0.9rem;
        color: var(--gray);
        margin-bottom: 4px;
    }
    
    .metric-value {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 4px;
    }
    
    .metric-label {
        font-size: 0.8rem;
        color: var(--gray);
    }
    
    .metric-progress {
        height: 6px;
        background: var(--gray-light);
        border-radius: 3px;
        overflow: hidden;
        margin-top: 8px;
    }
    
    .progress-bar {
        height: 100%;
        border-radius: 3px;
        transition: width 0.5s ease;
    }
    
    .detail-section {
        margin-bottom: 2rem;
    }
    
    .detail-section h3 {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 1rem;
        color: var(--dark);
        font-size: 1.1rem;
    }
    
    .feature-list {
        list-style: none;
        padding-right: 1rem;
    }
    
    .feature-list li {
        padding: 8px 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .feature-list li i {
        font-size: 0.9rem;
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
    }
    
    .stat-item {
        background: var(--light);
        padding: 1rem;
        border-radius: var(--radius-sm);
        text-align: center;
    }
    
    .stat-label {
        font-size: 0.8rem;
        color: var(--gray);
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .stat-value {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--dark);
    }
    
    .detail-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-top: 2rem;
    }
    
    .btn-action {
        flex: 1;
        min-width: 150px;
        padding: 12px 20px;
        border: 1px solid var(--border);
        background: white;
        border-radius: var(--radius-sm);
        cursor: pointer;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.3s ease;
    }
    
    .btn-action:hover {
        background: var(--light);
    }
    
    .btn-action.primary {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
    }
    
    .btn-action.primary:hover {
        background: var(--primary-dark);
    }
    
    .btn-action.small {
        padding: 8px 16px;
        font-size: 0.9rem;
    }
    
    /* استایل‌های لاگ‌ها */
    .logs-viewer {
        padding: 1rem;
    }
    
    .logs-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--gray-light);
    }
    
    .logs-header h3 {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--dark);
    }
    
    .logs-content {
        max-height: 400px;
        overflow-y: auto;
        padding: 1rem;
        background: var(--light);
        border-radius: var(--radius-sm);
    }
    
    .log-entry {
        padding: 12px;
        margin-bottom: 8px;
        background: white;
        border-radius: var(--radius-sm);
        border-right: 4px solid var(--gray);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .log-entry.success {
        border-right-color: var(--success);
    }
    
    .log-entry.info {
        border-right-color: var(--info);
    }
    
    .log-entry.warning {
        border-right-color: var(--warning);
    }
    
    .log-time {
        font-size: 0.8rem;
        color: var(--gray);
        min-width: 80px;
    }
    
    .log-message {
        flex: 1;
        margin-right: 1rem;
    }
    
    /* واکنشگرایی */
    @media (max-width: 768px) {
        .notification {
            left: 10px;
            right: 10px;
        }
        
        .detail-metrics {
            grid-template-columns: 1fr;
        }
        
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .detail-actions {
            flex-direction: column;
        }
        
        .btn-action {
            min-width: auto;
        }
    }
`;

document.head.appendChild(style);
