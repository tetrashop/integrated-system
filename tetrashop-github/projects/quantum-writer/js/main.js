// نویسنده کوانتومی - تتراشاپ

document.addEventListener('DOMContentLoaded', function() {
    console.log('نویسنده کوانتومی بارگذاری شد');
    
    // راه‌اندازی ذرات کوانتومی
    initQuantumParticles();
    
    // راه‌اندازی کیوبیت‌ها
    initQubits();
    
    // راه‌اندازی کنترل‌ها
    initQuantumControls();
    
    // راه‌اندازی شبیه‌ساز
    initQuantumSimulator();
});

function initQuantumParticles() {
    console.log('راه‌اندازی ذرات کوانتومی...');
    
    const canvas = document.getElementById('quantum-particles');
    const ctx = canvas.getContext('2d');
    
    // تنظیم اندازه کانواس
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // ایجاد ذرات
    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            color: `hsl(${Math.random() * 60 + 180}, 100%, 70%)`,
            alpha: Math.random() * 0.5 + 0.3
        });
    }
    
    // تابع انیمیشن
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // بروزرسانی و رسم ذرات
        particles.forEach(p => {
            // حرکت ذرات
            p.x += p.speedX;
            p.y += p.speedY;
            
            // برخورد با دیوارها
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
            
            // رسم ذره
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
            
            // اتصالات کوانتومی بین ذرات نزدیک
            particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = p.color;
                    ctx.globalAlpha = 0.1 * (1 - distance/150);
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        
        ctx.globalAlpha = 1;
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

function initQubits() {
    console.log('راه‌اندازی کیوبیت‌ها...');
    
    const qubits = document.querySelectorAll('.qbit');
    qubits.forEach(qbit => {
        qbit.addEventListener('click', function() {
            const state = this.getAttribute('data-state');
            const type = this.classList.contains('superposition') ? 'superposition' : 
                        this.classList.contains('entangled') ? 'entangled' : 'basic';
            
            manipulateQubit(state, type);
            showQuantumEffect(this);
        });
    });
}

function manipulateQubit(state, type) {
    console.log(`دستکاری کیوبیت: ${state} - نوع: ${type}`);
    
    // به‌روزرسانی وضعیت کوانتومی
    updateQuantumStatus(state, type);
    
    // به‌روزرسانی نوارهای احتمال
    updateProbabilityBars();
    
    // پخش افکت صوتی (شبیه‌سازی)
    playQuantumSound();
}

function showQuantumEffect(element) {
    // ایجاد افکت بصری
    element.style.transform = 'scale(1.2)';
    element.style.boxShadow = '0 0 30px #00d4ff';
    
    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.boxShadow = 'none';
    }, 300);
}

function initQuantumControls() {
    console.log('راه‌اندازی کنترل‌های کوانتومی...');
    
    // دکمه تولید کوانتومی
    document.getElementById('quantum-generate').addEventListener('click', quantumGenerate);
    
    // دکمه برهم‌نهی
    document.getElementById('superposition-btn').addEventListener('click', createSuperposition);
    
    // دکمه درهم‌تنیدگی
    document.getElementById('entanglement-btn').addEventListener('click', createEntanglement);
    
    // دکمه اندازه‌گیری
    document.getElementById('measure-btn').addEventListener('click', quantumMeasure);
    
    // دکمه بازنشانی
    document.getElementById('reset-btn').addEventListener('click', resetQuantumSystem);
}

function initQuantumSimulator() {
    console.log('راه‌اندازی شبیه‌ساز کوانتومی...');
    
    // راه‌اندازی اولیه نوارهای احتمال
    updateProbabilityBars();
    
    // راه‌اندازی ورودی متن
    setupTextInput();
}

function quantumGenerate() {
    console.log('شروع تولید کوانتومی...');
    
    const input = document.getElementById('quantum-input').value.trim();
    if (!input) {
        showQuantumMessage('لطفاً یک ایده یا متن وارد کنید', 'warning');
        return;
    }
    
    // نمایش حالت تولید
    const generateBtn = document.getElementById('quantum-generate');
    const originalText = generateBtn.innerHTML;
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> محاسبه کوانتومی...';
    
    // شبیه‌سازی محاسبات کوانتومی
    simulateQuantumComputation(input);
    
    // بازنشانی دکمه بعد از تأخیر
    setTimeout(() => {
        generateBtn.disabled = false;
        generateBtn.innerHTML = originalText;
    }, 3000);
}

function simulateQuantumComputation(input) {
    console.log('شبیه‌سازی محاسبات کوانتومی برای:', input);
    
    // مراحل محاسبه کوانتومی
    const steps = [
        'آماده‌سازی کیوبیت‌ها...',
        'ایجاد برهم‌نهی...',
        'اعمال گیت‌های کوانتومی...',
        'ایجاد درهم‌تنیدگی...',
        'انجام اندازه‌گیری...',
        'فروریختن تابع موج...'
    ];
    
    let step = 0;
    const interval = setInterval(() => {
        if (step < steps.length) {
            updateQuantumStatus('محاسبه', steps[step]);
            updateProbabilityBars(step * 15);
            step++;
        } else {
            clearInterval(interval);
            completeQuantumComputation(input);
        }
    }, 500);
}

function completeQuantumComputation(input) {
    // تولید متن کوانتومی
    const quantumText = generateQuantumText(input);
    
    // نمایش نتیجه
    document.getElementById('quantum-output').textContent = quantumText;
    
    // به‌روزرسانی نوارهای احتمال نهایی
    updateProbabilityBars(100);
    
    // نمایش پیام موفقیت
    showQuantumMessage('✅ تولید کوانتومی با موفقیت انجام شد!', 'success');
    
    // پخش افکت
    playQuantumCompletion();
}

function generateQuantumText(input) {
    const quantumStyles = [
        "از منظر کوانتومی،",
        "در فضای برهم‌نهی،",
        "با توجه به اصل عدم قطعیت،",
        "در حالت درهم‌تنیده،",
        "با عبور از گیت‌های کوانتومی،",
        "در محاسبات موازی کوانتومی،"
    ];
    
    const quantumConcepts = [
        "تابع موجی",
        "کیوبیت",
        "برهم‌نهی",
        "درهم‌تنیدگی",
        "گیت کوانتومی",
        "الگوریتم کوانتومی"
    ];
    
    const quantumResults = [
        "به نتایج شگفت‌انگیزی دست یافتیم.",
        "تحولی در درک ما ایجاد کرد.",
        "افق جدیدی گشود.",
        "محدودیت‌های کلاسیک را درنوردید.",
        "امکان‌های بی‌پایانی ارائه داد."
    ];
    
    const randomStyle = quantumStyles[Math.floor(Math.random() * quantumStyles.length)];
    const randomConcept = quantumConcepts[Math.floor(Math.random() * quantumConcepts.length)];
    const randomResult = quantumResults[Math.floor(Math.random() * quantumResults.length)];
    
    return `${randomStyle} موضوع "${input}" با استفاده از ${randomConcept} مورد بررسی قرار گرفت و ${randomResult}\n\n` +
           `🎯 نتیجه کوانتومی: تولید محتوایی با خلاقیت بی‌نهایت و عمق کوانتومی.`;
}

function createSuperposition() {
    console.log('ایجاد برهم‌نهی کوانتومی...');
    
    // شبیه‌سازی برهم‌نهی
    document.querySelectorAll('.qbit').forEach(qbit => {
        if (!qbit.classList.contains('entangled')) {
            qbit.classList.add('superposition');
            qbit.querySelector('.qbit-state').textContent = '|0⟩ + |1⟩';
        }
    });
    
    showQuantumMessage('✅ برهم‌نهی کوانتومی ایجاد شد!', 'success');
    updateQuantumStatus('برهم‌نهی', 'حالت ترکیبی');
}

function createEntanglement() {
    console.log('ایجاد درهم‌تنیدگی کوانتومی...');
    
    // شبیه‌سازی درهم‌تنیدگی
    const qubits = document.querySelectorAll('.qbit');
    qubits.forEach(qbit => {
        qbit.classList.add('entangled');
        qbit.classList.remove('superposition');
        qbit.querySelector('.qbit-state').textContent = 'درهم‌تنیده';
    });
    
    showQuantumMessage('🔗 درهم‌تنیدگی کوانتومی ایجاد شد!', 'success');
    updateQuantumStatus('درهم‌تنیده', 'اتصال کوانتومی');
}

function quantumMeasure() {
    console.log('انجام اندازه‌گیری کوانتومی...');
    
    // شبیه‌سازی اندازه‌گیری
    const qubits = document.querySelectorAll('.qbit');
    qubits.forEach(qbit => {
        qbit.classList.remove('superposition', 'entangled');
        const result = Math.random() > 0.5 ? '|0⟩' : '|1⟩';
        qbit.querySelector('.qbit-state').textContent = result;
        
        // افکت اندازه‌گیری
        qbit.style.animation = 'none';
        setTimeout(() => {
            qbit.style.animation = '';
        }, 10);
    });
    
    showQuantumMessage('📏 اندازه‌گیری کوانتومی انجام شد!', 'info');
    updateQuantumStatus('اندازه‌گیری', 'فروریختن تابع موج');
}

function resetQuantumSystem() {
    if (confirm('آیا مطمئن هستید که می‌خواهید سیستم کوانتومی را بازنشانی کنید؟')) {
        console.log('بازنشانی سیستم کوانتومی...');
        
        // بازنشانی کیوبیت‌ها
        document.querySelectorAll('.qbit').forEach((qbit, index) => {
            qbit.classList.remove('superposition', 'entangled');
            qbit.querySelector('.qbit-state').textContent = index % 2 === 0 ? '|0⟩' : '|1⟩';
        });
        
        // پاک کردن خروجی
        document.getElementById('quantum-output').textContent = 'منتظر فروریختن تابع موج...';
        
        // پاک کردن ورودی
        document.getElementById('quantum-input').value = '';
        
        // بازنشانی نوارهای احتمال
        updateProbabilityBars(0);
        
        showQuantumMessage('🔄 سیستم کوانتومی بازنشانی شد!', 'info');
        updateQuantumStatus('آماده', 'حالت اولیه');
    }
}

function updateProbabilityBars(progress = 0) {
    // به‌روزرسانی نوارهای احتمال
    const probabilities = [
        { id: 'article-prob', value: 40 + progress / 2, label: 'مقاله علمی' },
        { id: 'story-prob', value: 25 + progress / 4, label: 'داستان' },
        { id: 'poem-prob', value: 20 + progress / 5, label: 'شعر' },
        { id: 'tech-prob', value: 15 + progress / 3, label: 'متن فنی' }
    ];
    
    probabilities.forEach(prob => {
        const bar = document.getElementById(prob.id);
        const fill = bar.querySelector('.probability-fill');
        const label = bar.querySelector('.probability-label span:first-child');
        
        const value = Math.min(100, prob.value);
        fill.style.width = value + '%';
        label.textContent = prob.label + ` (${Math.round(value)}%)`;
    });
}

function updateQuantumStatus(state, description) {
    document.getElementById('quantum-state').textContent = `حالت: ${state}`;
    document.getElementById('entanglement-level').textContent = `سطح: ${description}`;
}

function showQuantumMessage(message, type) {
    // ایجاد پیام
    const messageDiv = document.createElement('div');
    messageDiv.className = `quantum-message quantum-${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // استایل‌دهی پویا
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(0, 212, 255, 0.2)' : 
                     type === 'warning' ? 'rgba(255, 165, 0, 0.2)' : 'rgba(138, 43, 226, 0.2)'};
        border: 1px solid ${type === 'success' ? '#00d4ff' : 
                         type === 'warning' ? '#ffa500' : '#8a2be2'};
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        backdrop-filter: blur(10px);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 15px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // اضافه کردن به صفحه
    document.body.appendChild(messageDiv);
    
    // حذف خودکار بعد از 5 ثانیه
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 5000);
}

function setupTextInput() {
    const textarea = document.getElementById('quantum-input');
    
    textarea.addEventListener('input', function() {
        const length = this.value.length;
        const wordCount = this.value.trim().split(/\s+/).filter(w => w.length > 0).length;
        
        // به‌روزرسانی آمار
        document.getElementById('char-count').textContent = length + ' حرف';
        document.getElementById('word-count').textContent = wordCount + ' کلمه';
    });
}

function playQuantumSound() {
    // شبیه‌سازی صدا با Web Audio API (ساده)
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Web Audio API پشتیبانی نمی‌شود');
    }
}

function playQuantumCompletion() {
    // افکت تکمیل محاسبات
    const particles = document.querySelectorAll('.qbit');
    particles.forEach((particle, index) => {
        setTimeout(() => {
            particle.style.boxShadow = '0 0 30px #ff00ff';
            setTimeout(() => {
                particle.style.boxShadow = 'none';
            }, 300);
        }, index * 100);
    });
}

// اضافه کردن استایل‌های پویا برای انیمیشن‌ها
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateY(-100px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(-100px); opacity: 0; }
    }
    
    .quantum-message {
        position: fixed;
        top: 20px;
        left: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 15px;
    }
`;
document.head.appendChild(style);
