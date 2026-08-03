function loadServices() {
    const grid = document.getElementById('servicesGrid');
    const statusText = document.getElementById('statusText');

    if (!SERVICES_CONFIG || SERVICES_CONFIG.length === 0) {
        grid.innerHTML = '<p style="color:#e16162;text-align:center;padding:40px;">❌ هیچ سرویسی تعریف نشده است.</p>';
        statusText.textContent = '❌ خطا در بارگذاری';
        return;
    }

    let html = '';
    let onlineCount = 0;

    SERVICES_CONFIG.forEach(service => {
        const isOnline = service.status === 'online';
        const statusClass = isOnline ? 'online' : service.status === 'pending' ? 'pending' : 'offline';
        const statusTextLabel = isOnline ? '✅ فعال' :
                               service.status === 'pending' ? '⏳ در انتظار' : '⛔ غیرفعال';
        const link = service.url && service.url !== '#' ? service.url : '#';

        if (isOnline) onlineCount++;

        html += `
            <div class="service-card" onclick="if('${link}' !== '#') window.open('${link}', '_blank')">
                <div class="icon">${service.name.split(' ')[0]}</div>
                <h3>${service.name}</h3>
                <p>${service.desc}</p>
                <span class="status ${statusClass}">${statusTextLabel}</span>
                ${link !== '#' ? `<small style="display:block;color:#6c7086;font-size:0.7rem;margin-top:8px;direction:ltr;">${link}</small>` : ''}
            </div>
        `;
    });

    grid.innerHTML = html;
    statusText.textContent = `✅ ${onlineCount} از ${SERVICES_CONFIG.length} سرویس فعال هستند.`;
}

document.addEventListener('DOMContentLoaded', loadServices);
