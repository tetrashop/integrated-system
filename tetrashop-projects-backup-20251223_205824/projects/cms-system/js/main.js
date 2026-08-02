// سیستم مدیریت محتوا - تتراشاپ

document.addEventListener('DOMContentLoaded', function() {
    console.log('سیستم مدیریت محتوا بارگذاری شد');
    
    // مدیریت منو
    const menuLinks = document.querySelectorAll('.menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // حذف کلاس active از همه
            menuLinks.forEach(l => l.classList.remove('active'));
            
            // اضافه کردن active به لینک کلیک شده
            this.classList.add('active');
            
            // بارگذاری محتوای صفحه
            const page = this.getAttribute('data-page');
            loadPage(page);
        });
    });
    
    // بارگذاری اولیه داشبورد
    loadPage('dashboard');
    
    // شبیه‌سازی آمار
    updateStats();
    
    // مدیریت فرم‌ها
    setupForms();
});

function loadPage(page) {
    const content = document.getElementById('content');
    
    const pages = {
        'dashboard': `
            <div class="dashboard-header">
                <h2><i class="fas fa-tachometer-alt"></i> داشبورد مدیریت</h2>
                <button class="btn btn-primary">
                    <i class="fas fa-plus"></i> ایجاد محتوای جدید
                </button>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>کل مطالب</h3>
                    <div class="number">۱۲۸</div>
                    <div class="trend up">
                        <i class="fas fa-arrow-up"></i>
                        <span>۱۵ مورد جدید این ماه</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <h3>کاربران</h3>
                    <div class="number">۲,۴۵۶</div>
                    <div class="trend up">
                        <i class="fas fa-arrow-up"></i>
                        <span>۲۳۴ کاربر جدید</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <h3>بازدید امروز</h3>
                    <div class="number">۳,۸۹۲</div>
                    <div class="trend down">
                        <i class="fas fa-arrow-down"></i>
                        <span>۱۲٪ کاهش نسبت به دیروز</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <h3>نظرات جدید</h3>
                    <div class="number">۴۲</div>
                    <div class="trend up">
                        <i class="fas fa-arrow-up"></i>
                        <span>در انتظار تایید</span>
                    </div>
                </div>
            </div>
            
            <h3><i class="fas fa-newspaper"></i> مطالب اخیر</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>عنوان</th>
                            <th>نویسنده</th>
                            <th>دسته‌بندی</th>
                            <th>تاریخ</th>
                            <th>وضعیت</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>آموزش سیستم مدیریت محتوا</td>
                            <td>مدیر سایت</td>
                            <td>آموزشی</td>
                            <td>۱۴۰۲/۱۰/۱۵</td>
                            <td><span class="status published">منتشر شده</span></td>
                            <td class="actions">
                                <button class="action-btn view-btn"><i class="fas fa-eye"></i> مشاهده</button>
                                <button class="action-btn edit-btn"><i class="fas fa-edit"></i> ویرایش</button>
                            </td>
                        </tr>
                        <tr>
                            <td>بهینه‌سازی برای موتورهای جستجو</td>
                            <td>کارشناس سئو</td>
                            <td>سئو</td>
                            <td>۱۴۰۲/۱۰/۱۴</td>
                            <td><span class="status draft">پیش‌نویس</span></td>
                            <td class="actions">
                                <button class="action-btn edit-btn"><i class="fas fa-edit"></i> ویرایش</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `,
        
        'content': `
            <div class="dashboard-header">
                <h2><i class="fas fa-edit"></i> مدیریت محتوا</h2>
                <button class="btn btn-primary" onclick="showNewContentForm()">
                    <i class="fas fa-plus"></i> مطلب جدید
                </button>
            </div>
            
            <div id="content-management">
                <p>سیستم مدیریت محتوا در حال توسعه است...</p>
            </div>
        `,
        
        'users': `
            <div class="dashboard-header">
                <h2><i class="fas fa-users"></i> مدیریت کاربران</h2>
                <button class="btn btn-primary">
                    <i class="fas fa-user-plus"></i> کاربر جدید
                </button>
            </div>
            
            <div id="user-management">
                <p>مدیریت کاربران در حال توسعه است...</p>
            </div>
        `
    };
    
    content.innerHTML = pages[page] || '<p>صفحه مورد نظر یافت نشد</p>';
}

function updateStats() {
    // به‌روزرسانی آمار به صورت پویا
    setInterval(() => {
        const visitorElement = document.querySelector('.stat-card:nth-child(3) .number');
        if (visitorElement) {
            const current = parseInt(visitorElement.textContent.replace(/,/g, ''));
            const change = Math.floor(Math.random() * 100) - 50;
            const newValue = Math.max(1000, current + change);
            visitorElement.textContent = newValue.toLocaleString();
        }
    }, 5000);
}

function setupForms() {
    console.log('فرم‌ها راه‌اندازی شدند');
}

function showNewContentForm() {
    alert('فرم ایجاد محتوای جدید باز خواهد شد');
}
