// باغ رازآلود - تتراشاپ

document.addEventListener('DOMContentLoaded', function() {
    console.log('باغ رازآلود بارگذاری شد');
    
    // راه‌اندازی ذرات جادویی
    initMagicParticles();
    
    // راه‌اندازی گیاهان
    initPlants();
    
    // راه‌اندازی معماها
    initPuzzles();
    
    // راه‌اندازی موجودات
    initCreatures();
    
    // راه‌اندازی کنترل‌ها
    initGardenControls();
    
    // بارگذاری وضعیت اولیه
    loadGardenState();
});

function initMagicParticles() {
    console.log('راه‌اندازی ذرات جادویی...');
    
    const canvas = document.getElementById('magic-particles');
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
    const particleCount = 80;
    
    const colors = ['#27ae60', '#2ecc71', '#3498db', '#9b59b6', '#f1c40f'];
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 4 + 1,
            speedX: (Math.random() - 0.5) * 1,
            speedY: (Math.random() - 0.5) * 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.5 + 0.3,
            wave: Math.random() * Math.PI * 2
        });
    }
    
    // تابع انیمیشن
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // بروزرسانی و رسم ذرات
        particles.forEach(p => {
            // حرکت موجی
            p.wave += 0.02;
            p.x += p.speedX + Math.sin(p.wave) * 0.5;
            p.y += p.speedY + Math.cos(p.wave) * 0.5;
            
            // بازگشت به صفحه
            if (p.x < -100) p.x = canvas.width + 100;
            if (p.x > canvas.width + 100) p.x = -100;
            if (p.y < -100) p.y = canvas.height + 100;
            if (p.y > canvas.height + 100) p.y = -100;
            
            // رسم ذره
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
            
            // ترسیم خطوط اتصال
            particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = p.color;
                    ctx.globalAlpha = 0.1 * (1 - distance/120);
                    ctx.lineWidth = 0.3;
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

function initPlants() {
    console.log('راه‌اندازی گیاهان...');
    
    const plants = [
        { id: 'rose', name: 'رز اسرار', icon: '🌹', level: 1 },
        { id: 'orchid', name: 'ارکیده جادو', icon: '🌺', level: 2 },
        { id: 'fern', name: 'سرخس باستانی', icon: '🌿', level: 1 },
        { id: 'mushroom', name: 'قارچ درخشنده', icon: '🍄', level: 3 },
        { id: 'lotus', name: 'نیلوفر طلایی', icon: '🌸', level: 2 },
        { id: 'crystal', name: 'بلور زنده', icon: '🔮', level: 4 },
        { id: 'vine', name: 'پیچک خزنده', icon: '🌱', level: 1 },
        { id: 'sunflower', name: 'آفتابگردان سخنگو', icon: '🌻', level: 2 }
    ];
    
    const plantsContainer = document.getElementById('plants-grid');
    plantsContainer.innerHTML = '';
    
    plants.forEach(plant => {
        const plantElement = document.createElement('div');
        plantElement.className = 'plant';
        plantElement.dataset.plantId = plant.id;
        plantElement.innerHTML = `
            <div class="plant-icon">${plant.icon}</div>
            <div class="plant-name">${plant.name}</div>
            <div class="plant-level">سطح ${plant.level}</div>
        `;
        
        plantElement.addEventListener('click', () => interactWithPlant(plant));
        plantsContainer.appendChild(plantElement);
    });
}

function initPuzzles() {
    console.log('راه‌اندازی معماها...');
    
    const puzzles = [
        {
            id: 'puzzle1',
            title: 'درخت خاموش',
            difficulty: 'easy',
            description: 'چرا درخت باستانی دیگر آواز نمی‌خواند؟',
            progress: 30
        },
        {
            id: 'puzzle2',
            title: 'آبنمای گمشده',
            difficulty: 'medium',
            description: 'آب‌نمای مرکزی ناپدید شده است. نشانه‌ها را پیدا کنید.',
            progress: 60
        },
        {
            id: 'puzzle3',
            title: 'بلورهای هماهنگ',
            difficulty: 'hard',
            description: 'بلورها را به ترتیب درست بنوازید تا در باز شود.',
            progress: 10
        },
        {
            id: 'puzzle4',
            title: 'باغ آینه‌ای',
            difficulty: 'medium',
            description: 'راه درست را در میان انعکاس‌ها پیدا کنید.',
            progress: 45
        }
    ];
    
    const puzzlesContainer = document.getElementById('puzzles-container');
    puzzlesContainer.innerHTML = '';
    
    puzzles.forEach(puzzle => {
        const puzzleElement = document.createElement('div');
        puzzleElement.className = 'puzzle';
        puzzleElement.dataset.puzzleId = puzzle.id;
        
        puzzleElement.innerHTML = `
            <div class="puzzle-header">
                <div class="puzzle-title">${puzzle.title}</div>
                <div class="puzzle-difficulty difficulty-${puzzle.difficulty}">
                    ${puzzle.difficulty === 'easy' ? 'آسان' : 
                      puzzle.difficulty === 'medium' ? 'متوسط' : 'سخت'}
                </div>
            </div>
            <div class="puzzle-description">
                ${puzzle.description}
            </div>
            <div class="puzzle-progress">
                <div class="progress-fill" style="width: ${puzzle.progress}%"></div>
            </div>
        `;
        
        puzzleElement.addEventListener('click', () => startPuzzle(puzzle));
        puzzlesContainer.appendChild(puzzleElement);
    });
}

function initCreatures() {
    console.log('راه‌اندازی موجودات جادویی...');
    
    const creatures = [
        {
            id: 'fairy',
            name: 'پری باغ',
            icon: '🧚',
            description: 'نگهبان رازهای باغ. به کسانی که مهربان هستند کمک می‌کند.'
        },
        {
            id: 'owl',
            name: 'جغد خردمند',
            icon: '🦉',
            description: 'صدها سال در این باغ زندگی کرده است. همه رازها را می‌داند.'
        },
        {
            id: 'fox',
            name: 'روباه نقره‌ای',
            icon: '🦊',
            description: 'راهنمای مسیرهای مخفی. فقط شب‌ها ظاهر می‌شود.'
        },
        {
            id: 'dragonfly',
            name: 'سنجاقک کریستالی',
            icon: '🐉',
            description: 'نورهای رقصان ایجاد می‌کند. پیام‌رسان بین دنیاهاست.'
        }
    ];
    
    const creaturesContainer = document.getElementById('creatures-grid');
    creaturesContainer.innerHTML = '';
    
    creatures.forEach(creature => {
        const creatureElement = document.createElement('div');
        creatureElement.className = 'creature';
        
        creatureElement.innerHTML = `
            <div class="creature-icon">${creature.icon}</div>
            <div class="creature-name">${creature.name}</div>
            <div class="creature-description">${creature.description}</div>
        `;
        
        creatureElement.addEventListener('click', () => interactWithCreature(creature));
        creaturesContainer.appendChild(creatureElement);
    });
}

function initGardenControls() {
    console.log('راه‌اندازی کنترل‌های باغ...');
    
    // دکمه کشف راز
    document.getElementById('discover-secret').addEventListener('click', discoverSecret);
    
    // دکمه تقویت باغ
    document.getElementById('enhance-garden').addEventListener('click', enhanceGarden);
    
    // دکمه دعوت دوست
    document.getElementById('invite-friend').addEventListener('click', inviteFriend);
    
    // دکمه بازنشانی
    document.getElementById('reset-garden').addEventListener('click', resetGarden);
}

function loadGardenState() {
    console.log('بارگذاری وضعیت باغ...');
    
    // بارگذاری آمار
    updateGardenStats();
    
    // بارگذاری پیشرفت
    updateProgress();
    
    // نمایش پیام خوش‌آمد
    showGardenMessage('به باغ رازآلود خوش آمدید! رازهای پنهان را کشف کنید.', 'info');
}

function interactWithPlant(plant) {
    console.log(`تعامل با گیاه: ${plant.name}`);
    
    // نمایش پیام
    const messages = [
        `${plant.name} به آرامی تکان می‌خورد...`,
        `نوری از ${plant.name} ساطع می‌شود.`,
        `${plant.name} رازی را زمزمه می‌کند.`,
        `شما ${plant.name} را تقویت کردید!`
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showGardenMessage(randomMessage, 'success');
    
    // افکت بصری
    const plantElement = document.querySelector(`[data-plant-id="${plant.id}"]`);
    if (plantElement) {
        plantElement.style.transform = 'scale(1.1)';
        plantElement.style.boxShadow = '0 0 20px #27ae60';
        
        setTimeout(() => {
            plantElement.style.transform = 'scale(1)';
            plantElement.style.boxShadow = 'none';
        }, 300);
    }
    
    // افزایش آمار
    updateStat('plants-interacted', 1);
}

function startPuzzle(puzzle) {
    console.log(`شروع معما: ${puzzle.title}`);
    
    // نمایش پنجره معما
    showPuzzleModal(puzzle);
}

function showPuzzleModal(puzzle) {
    // ایجاد مودال
    const modal = document.createElement('div');
    modal.className = 'puzzle-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(10px);
    `;
    
    modal.innerHTML = `
        <div style="
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            width: 90%;
            color: #2c3e50;
            direction: rtl;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h2 style="color: #8e44ad; margin: 0;">${puzzle.title}</h2>
                <button id="close-puzzle" style="
                    background: none;
                    border: none;
                    font-size: 1.5em;
                    cursor: pointer;
                    color: #2c3e50;
                ">×</button>
            </div>
            
            <div style="margin-bottom: 30px;">
                <p>${puzzle.description}</p>
                <div style="margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                    <p><strong>راهنمایی:</strong> ${getPuzzleHint(puzzle.id)}</p>
                </div>
            </div>
            
            <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                <input type="text" id="puzzle-answer" placeholder="پاسخ خود را وارد کنید..." style="
                    flex: 1;
                    padding: 15px;
                    border: 2px solid #ddd;
                    border-radius: 10px;
                    font-size: 1em;
                    min-width: 200px;
                ">
                <button id="submit-answer" style="
                    padding: 15px 30px;
                    background: #27ae60;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 1em;
                    cursor: pointer;
                    font-weight: 600;
                ">بررسی پاسخ</button>
                <button id="skip-puzzle" style="
                    padding: 15px 20px;
                    background: #95a5a6;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 1em;
                    cursor: pointer;
                ">ردش کن</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // رویدادها
    document.getElementById('close-puzzle').addEventListener('click', () => {
        modal.remove();
    });
    
    document.getElementById('submit-answer').addEventListener('click', () => {
        const answer = document.getElementById('puzzle-answer').value;
        checkPuzzleAnswer(puzzle, answer, modal);
    });
    
    document.getElementById('skip-puzzle').addEventListener('click', () => {
        modal.remove();
        showGardenMessage('معما را برای بعد گذاشتید.', 'info');
    });
    
    // بستن با کلیک خارج
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function getPuzzleHint(puzzleId) {
    const hints = {
        'puzzle1': 'به صدای باد گوش دهید...',
        'puzzle2': 'آینه‌ها را بررسی کنید.',
        'puzzle3': 'ترتیب رنگ‌ها مهم است.',
        'puzzle4': 'انعکاس مسیر واقعی را نشان می‌دهد.'
    };
    
    return hints[puzzleId] || 'به محیط اطراف دقت کنید.';
}

function checkPuzzleAnswer(puzzle, answer, modal) {
    // شبیه‌سازی بررسی پاسخ
    const correctAnswers = {
        'puzzle1': 'آواز',
        'puzzle2': 'آینه',
        'puzzle3': 'رنگین کمان',
        'puzzle4': 'انعکاس'
    };
    
    const correct = answer.toLowerCase().includes(correctAnswers[puzzle.id]?.toLowerCase() || '');
    
    if (correct) {
        showGardenMessage(`آفرین! معما "${puzzle.title}" را حل کردید!`, 'success');
        updateStat('puzzles-solved', 1);
        modal.remove();
    } else {
        document.getElementById('puzzle-answer').style.borderColor = '#e74c3c';
        showGardenMessage('پاسخ صحیح نیست. دوباره تلاش کنید.', 'warning');
    }
}

function interactWithCreature(creature) {
    console.log(`تعامل با موجود: ${creature.name}`);
    
    const messages = [
        `${creature.name} به شما نگاه می‌کند...`,
        `${creature.name} پیامی برای شما دارد.`,
        `شما با ${creature.name} دوست شدید!`,
        `${creature.name} شما را راهنمایی می‌کند.`
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showGardenMessage(randomMessage, 'info');
    
    // افکت بصری
    const creatureElement = event.target.closest('.creature');
    if (creatureElement) {
        creatureElement.style.transform = 'scale(1.05)';
        creatureElement.style.borderColor = '#3498db';
        
        setTimeout(() => {
            creatureElement.style.transform = 'scale(1)';
            creatureElement.style.borderColor = 'transparent';
        }, 500);
    }
    
    // افزایش آمار
    updateStat('creatures-met', 1);
}

function discoverSecret() {
    console.log('کشف راز جدید...');
    
    // شبیه‌سازی کشف راز
    const secrets = [
        'یک درخت قدیمی راز قدیمی را فاش کرد!',
        'آب‌نمای مخفی پیدا شد!',
        'گذرگاه مخفی به باغ دیگر کشف شد!',
        'کتاب طلسم‌های گمشده پیدا شد!'
    ];
    
    const randomSecret = secrets[Math.floor(Math.random() * secrets.length)];
    
    // نمایش انیمیشن
    showDiscoveryAnimation();
    
    // نمایش پیام با تأخیر
    setTimeout(() => {
        showGardenMessage(`🎉 راز کشف شد: ${randomSecret}`, 'success');
        updateStat('secrets-discovered', 1);
    }, 1500);
}

function showDiscoveryAnimation() {
    // ایجاد انیمیشن کشف
    const animation = document.createElement('div');
    animation.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 5em;
        z-index: 1000;
        animation: discover-pop 1.5s ease-out;
        pointer-events: none;
    `;
    
    animation.innerHTML = '✨';
    document.body.appendChild(animation);
    
    // حذف بعد از انیمیشن
    setTimeout(() => {
        animation.remove();
    }, 1500);
}

function enhanceGarden() {
    console.log('تقویت باغ...');
    
    // شبیه‌سازی تقویت
    const enhancements = [
        'گیاهان سریع‌تر رشد می‌کنند!',
        'نورهای جادویی درخشنده‌تر شدند!',
        'راه‌های مخفی بیشتری ظاهر شد!',
        'موجودات دوستانه‌تر شدند!'
    ];
    
    const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
    
    showGardenMessage(`🌿 باغ تقویت شد: ${randomEnhancement}`, 'success');
    updateStat('garden-enhanced', 1);
    
    // افکت روی گیاهان
    document.querySelectorAll('.plant').forEach((plant, index) => {
        setTimeout(() => {
            plant.style.boxShadow = '0 0 15px #f1c40f';
            setTimeout(() => {
                plant.style.boxShadow = 'none';
            }, 500);
        }, index * 100);
    });
}

function inviteFriend() {
    console.log('دعوت دوست به باغ...');
    
    showGardenMessage('📨 دعوت‌نامه برای دوست شما ارسال شد!', 'info');
    updateStat('friends-invited', 1);
}

function resetGarden() {
    if (confirm('آیا مطمئن هستید که می‌خواهید باغ را بازنشانی کنید؟ همه پیشرفت‌ها از بین می‌رود.')) {
        console.log('بازنشانی باغ...');
        
        // بازنشانی آمار
        resetStats();
        
        showGardenMessage('باغ به حالت اولیه بازگشت. سفر جدیدی آغاز کنید!', 'info');
    }
}

function updateGardenStats() {
    // به‌روزرسانی آمار نمایش
    const stats = {
        'secrets-count': Math.floor(Math.random() * 10),
        'plants-count': 8,
        'puzzles-count': 4,
        'creatures-count': 4,
        'level': 1,
        'experience': Math.floor(Math.random() * 100)
    };
    
    for (const [id, value] of Object.entries(stats)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

function updateStat(stat, increment = 1) {
    // افزایش آمار داخلی
    console.log(`افزایش آمار ${stat} به مقدار ${increment}`);
    
    // در نسخه واقعی اینجا به localStorage یا سرور متصل می‌شود
}

function updateProgress() {
    // به‌روزرسانی نوارهای پیشرفت
    document.querySelectorAll('.progress-fill').forEach(bar => {
        const currentWidth = parseInt(bar.style.width) || 0;
        const newWidth = Math.min(100, currentWidth + Math.random() * 10);
        
        setTimeout(() => {
            bar.style.width = newWidth + '%';
        }, 500);
    });
}

function resetStats() {
    console.log('بازنشانی تمام آمار...');
    
    // بازنشانی نوارهای پیشرفت
    document.querySelectorAll('.progress-fill').forEach(bar => {
        bar.style.width = '0%';
    });
    
    // بازنشانی آمار نمایش
    updateGardenStats();
}

function showGardenMessage(message, type) {
    // حذف پیام قبلی
    const oldMessage = document.querySelector('.garden-message');
    if (oldMessage) {
        oldMessage.remove();
    }
    
    // ایجاد پیام جدید
    const messageDiv = document.createElement('div');
    messageDiv.className = `garden-message garden-${type}`;
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
        background: ${type === 'success' ? 'rgba(39, 174, 96, 0.9)' : 
                     type === 'warning' ? 'rgba(241, 196, 15, 0.9)' : 'rgba(52, 152, 219, 0.9)'};
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 15px;
        animation: slideIn 0.3s ease-out;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
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

// اضافه کردن استایل‌های انیمیشن
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
    
    @keyframes discover-pop {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
`;
document.head.appendChild(style);
