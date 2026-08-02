const API_URL = 'http://localhost:5000/api';
let projects = [];
let statusChart, priorityChart;

async function fetchProjects() {
    try {
        const res = await fetch(`${API_URL}/projects`);
        projects = await res.json();
        renderProjects();
        updateAnalytics();
        updateCharts();
    } catch (error) {
        console.error('خطا در دریافت پروژه‌ها:', error);
    }
}

function renderProjects() {
    const tbody = document.getElementById('projectsBody');
    if (!projects || projects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="color:#a7a9be;padding:20px;">هیچ پروژه‌ای یافت نشد</td></tr>';
        return;
    }
    tbody.innerHTML = projects.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>${p.status}</td>
            <td>${p.progress}%</td>
            <td>${p.team}</td>
            <td>${p.priority}</td>
            <td>${p.predicted_days !== null ? p.predicted_days : '---'}</td>
            <td style="color:#00b894;">${p.suggested_priority || '---'}</td>
            <td class="actions">
                <button onclick="editProject(${p.id})">✏️</button>
                <button onclick="deleteProject(${p.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

async function updateAnalytics() {
    try {
        const res = await fetch(`${API_URL}/analytics`);
        const data = await res.json();
        document.getElementById('totalProjects').textContent = data.total || 0;
        document.getElementById('avgProgress').textContent = (data.avg_progress || 0) + '%';
        const statusSummary = document.getElementById('statusSummary');
        statusSummary.innerHTML = Object.entries(data.status_counts || {}).map(([k,v]) => `<div>${k}: ${v}</div>`).join('');
    } catch (error) {
        console.error('خطا در دریافت آنالیز:', error);
    }
}

async function updateCharts() {
    try {
        const res = await fetch(`${API_URL}/analytics`);
        const data = await res.json();
        const statusLabels = Object.keys(data.status_counts || {});
        const statusValues = Object.values(data.status_counts || {});
        const priorityLabels = Object.keys(data.priority_counts || {});
        const priorityValues = Object.values(data.priority_counts || {});

        if (statusChart) statusChart.destroy();
        if (priorityChart) priorityChart.destroy();

        const ctx1 = document.getElementById('statusChart').getContext('2d');
        statusChart = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: statusLabels,
                datasets: [{
                    data: statusValues,
                    backgroundColor: ['#ff8906', '#00b894', '#e16162', '#6c5ce7'],
                    borderColor: '#0f0e17',
                    borderWidth: 2
                }]
            },
            options: { responsive: true, plugins: { legend: { labels: { color: '#fffffe' } } } }
        });

        const ctx2 = document.getElementById('priorityChart').getContext('2d');
        priorityChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: priorityLabels,
                datasets: [{
                    label: 'اولویت',
                    data: priorityValues,
                    backgroundColor: ['#ff8906', '#00b894', '#e16162'],
                    borderColor: '#0f0e17',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { color: '#fffffe' } },
                    x: { ticks: { color: '#fffffe' } }
                }
            }
        });
    } catch (error) {
        console.error('خطا در رسم نمودار:', error);
    }
}

document.getElementById('projectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newProject = {
        name: document.getElementById('projectName').value,
        status: document.getElementById('projectStatus').value,
        progress: parseInt(document.getElementById('projectProgress').value),
        team: document.getElementById('projectTeam').value,
        priority: document.getElementById('projectPriority').value,
        deadline: document.getElementById('projectDeadline').value
    };
    try {
        const res = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProject)
        });
        if (res.ok) {
            document.getElementById('projectModal').style.display = 'none';
            fetchProjects();
        }
    } catch (error) {
        console.error('خطا در افزودن پروژه:', error);
    }
});

async function deleteProject(id) {
    if (!confirm('آیا مطمئن هستید؟')) return;
    try {
        await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
        fetchProjects();
    } catch (error) {
        console.error('خطا در حذف:', error);
    }
}

function editProject(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    alert(`ویرایش پروژه: ${project.name}\nپیشرفت: ${project.progress}%\nوضعیت: ${project.status}\nپیش‌بینی: ${project.predicted_days || 'نامشخص'} روز`);
}

document.getElementById('addProjectBtn').addEventListener('click', () => {
    document.getElementById('projectModal').style.display = 'flex';
});
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('projectModal').style.display = 'none';
});
window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('projectModal')) {
        document.getElementById('projectModal').style.display = 'none';
    }
});

fetchProjects();
