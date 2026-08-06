async function loadServices() {
    const grid = document.getElementById('servicesGrid');
    const statusText = document.getElementById('statusText');
    const serviceCount = document.getElementById('serviceCount');
    const activeCount = document.getElementById('activeCount');
    const lastUpdate = document.getElementById('lastUpdate');
    try {
        const services = SERVICES_CONFIG;
        if (!services || services.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#a7a9be;"><p style="font-size:1.5rem;">📋 هیچ سرویسی تعریف نشده است</p></div>';
            statusText.textContent = '⚠️ هیچ سرویسی یافت نشد';
            return;
        }
        let online = 0, html = '';
        services.forEach(service => {
            if (service.status === 'online') online++;
            const statusClass = service.status === 'online' ? 'online' : 'offline';
            const statusLabel = service.status === 'online' ? '✅ فعال' : '⛔ غیرفعال';
            html += `
                <div class="service-card" onclick="window.open('${service.url}', '_blank')">
                    <div class="icon">${service.name.split(' ')[0]}</div>
                    <h3>${service.name}</h3>
                    <p>${service.desc || ''}</p>
                    <span class="status ${statusClass}">${statusLabel}</span>
                </div>
            `;
        });
        grid.innerHTML = html;
        serviceCount.textContent = services.length;
        activeCount.textContent = online;
        lastUpdate.textContent = new Date().toLocaleString('fa-IR');
        statusText.textContent = `✅ ${online} از ${services.length} سرویس فعال هستند`;
    } catch (error) {
        console.error('خطا:', error);
        statusText.textContent = '❌ خطا در بارگذاری';
        grid.innerHTML = `<p style="color:#e16162;text-align:center;padding:40px;">❌ خطا: ${error.message}</p>`;
    }
}
document.addEventListener('DOMContentLoaded', loadServices);
