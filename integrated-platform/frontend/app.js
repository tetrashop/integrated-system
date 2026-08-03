const SERVICES = {
    '3d': { name: '🎨 تبدیل 2D به 3D', desc: 'تبدیل تصاویر به مدل‌های سه‌بعدی' },
    'nlp': { name: '🧠 پردازش زبان طبیعی', desc: 'تحلیل متن، خلاصه‌سازی و پاسخ‌گویی' },
    'shop': { name: '🛍️ فروشگاه آنلاین', desc: 'مدیریت محصولات، سبد خرید و پرداخت' },
    'admin': { name: '📊 داشبورد مدیریتی', desc: 'نظارت بر عملکرد و مدیریت کاربران' },
    'chess': { name: '♟️ موتور شطرنج', desc: 'بازی شطرنج با هوش مصنوعی' },
    'olympic': { name: '🏅 بازی‌های المپیک', desc: 'بازی‌های تعاملی المپیکی' },
    'ai-manager': { name: '🤖 مدیریت پروژه با AI', desc: 'پیش‌بینی و اولویت‌بندی پروژه‌ها' },
    'probability': { name: '📈 ابزارهای احتمالات', desc: 'محاسبات آماری و احتمالاتی' }
};

async function loadServices() {
    const grid = document.getElementById('servicesGrid');
    const statusText = document.getElementById('statusText');

    try {
        const res = await fetch('/api/status');
        const statuses = await res.json();

        let html = '';
        Object.entries(SERVICES).forEach(([key, service]) => {
            const status = statuses[key] || 'stopped';
            const statusClass = status === 'running' ? 'running' :
                              status === 'unhealthy' ? 'unhealthy' : 'stopped';
            html += `
                <div class="service-card" onclick="window.location.href='/${key}'">
                    <div class="icon">${service.name.split(' ')[0]}</div>
                    <h3>${service.name}</h3>
                    <p>${service.desc}</p>
                    <span class="status ${statusClass}">${status === 'running' ? '✅ فعال' :
                                                          status === 'unhealthy' ? '⚠️ نامناسب' : '⛔ متوقف'}</span>
                </div>
            `;
        });
        grid.innerHTML = html;

        const total = Object.keys(SERVICES).length;
        const running = Object.values(statuses).filter(s => s === 'running').length;
        statusText.textContent = `✅ ${running} از ${total} سرویس فعال هستند.`;

    } catch (error) {
        statusText.textContent = '❌ خطا در ارتباط با Gateway. مطمئن شوید سرور در حال اجراست.';
    }
}

document.addEventListener('DOMContentLoaded', loadServices);
