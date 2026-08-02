// نویسنده هوشمند - تتراشاپ

document.addEventListener('DOMContentLoaded', function() {
    console.log('نویسنده هوشمند بارگذاری شد');
    
    // راه‌اندازی اولیه
    initializeWriter();
    setupEventListeners();
    loadSampleContent();
});

function initializeWriter() {
    console.log('راه‌اندازی نویسنده هوشمند...');
    
    // تنظیم مقداردهی اولیه کنترل‌ها
    updateWordCount();
    setupWritingStyles();
    
    // نمایش پیام خوش‌آمد
    showAlert('به نویسنده هوشمند خوش آمدید! موضوع یا ایده خود را وارد کنید.', 'info');
}

function setupEventListeners() {
    // دکمه تولید محتوا
    document.getElementById('generate-btn').addEventListener('click', generateContent);
    
    // دکمه بهبود متن
    document.getElementById('improve-btn').addEventListener('click', improveText);
    
    // دکمه خلاصه‌سازی
    document.getElementById('summarize-btn').addEventListener('click', summarizeText);
    
    // دکمه بازنشانی
    document.getElementById('reset-btn').addEventListener('click', resetWriter);
    
    // دکمه کپی
    document.getElementById('copy-btn').addEventListener('click', copyOutput);
    
    // دکمه ذخیره
    document.getElementById('save-btn').addEventListener('click', saveContent);
    
    // ردیابی تغییرات در ورودی
    document.getElementById('text-input').addEventListener('input', function() {
        updateWordCount();
        updateReadingTime();
    });
    
    // تغییر سبک نوشتاری
    document.querySelectorAll('.style-card').forEach(card => {
        card.addEventListener('click', function() {
            selectWritingStyle(this);
        });
    });
    
    // تغییر طول متن
    document.getElementById('length-slider').addEventListener('input', function() {
        document.getElementById('length-value').textContent = this.value + ' کلمه';
    });
    
    // تغییر سطح خلاقیت
    document.getElementById('creativity-slider').addEventListener('input', function() {
        const value = parseInt(this.value);
        let label = 'معمولی';
        if (value > 70) label = 'بسیار خلاق';
        else if (value > 40) label = 'خلاق';
        else if (value < 30) label = 'محافظه‌کار';
        
        document.getElementById('creativity-value').textContent = label;
    });
}

function loadSampleContent() {
    const sampleTopics = [
        "تکنولوژی هوش مصنوعی و آینده آن",
        "تأثیر شبکه‌های اجتماعی بر زندگی ما",
        "اهمیت آموزش دیجیتال در قرن ۲۱",
        "راه‌های کاهش استرس در زندگی مدرن",
        "نقش کارآفرینی در توسعه اقتصادی"
    ];
    
    const randomTopic = sampleTopics[Math.floor(Math.random() * sampleTopics.length)];
    document.getElementById('topic-input').value = randomTopic;
}

function updateWordCount() {
    const input = document.getElementById('text-input').value;
    const words = input.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const charCount = input.length;
    
    document.getElementById('word-count').textContent = wordCount.toLocaleString();
    document.getElementById('char-count').textContent = charCount.toLocaleString();
    
    // به‌روزرسانی نوار پیشرفت
    const progress = Math.min(wordCount, 1000) / 10;
    document.getElementById('progress-fill').style.width = progress + '%';
}

function updateReadingTime() {
    const input = document.getElementById('text-input').value;
    const wordCount = input.trim().split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200); // 200 کلمه در دقیقه
    
    document.getElementById('reading-time').textContent = readingTime + ' دقیقه';
}

function setupWritingStyles() {
    const styles = [
        {
            id: 'article',
            icon: 'fas fa-newspaper',
            title: 'مقاله',
            description: 'متن رسمی و ساختاریافته مناسب مقالات'
        },
        {
            id: 'story',
            icon: 'fas fa-book',
            title: 'داستان',
            description: 'سبک روایی و داستانی با توصیفات'
        },
        {
            id: 'blog',
            icon: 'fas fa-blog',
            title: 'وبلاگ',
            description: 'سبک غیررسمی و دوستانه برای وبلاگ'
        },
        {
            id: 'poem',
            icon: 'fas fa-feather-alt',
            title: 'شعر',
            description: 'شعر و اشعار با وزن و قافیه'
        },
        {
            id: 'ad',
            icon: 'fas fa-ad',
            title: 'تبلیغاتی',
            description: 'متن متقاعدکننده برای تبلیغات'
        },
        {
            id: 'technical',
            icon: 'fas fa-cogs',
            title: 'فنی',
            description: 'متن تخصصی با اصطلاحات فنی'
        }
    ];
    
    const stylesContainer = document.getElementById('writing-styles');
    stylesContainer.innerHTML = '';
    
    styles.forEach(style => {
        const styleCard = document.createElement('div');
        styleCard.className = 'style-card';
        styleCard.dataset.style = style.id;
        
        styleCard.innerHTML = `
            <div class="style-icon">
                <i class="${style.icon}"></i>
            </div>
            <h3>${style.title}</h3>
            <p>${style.description}</p>
        `;
        
        stylesContainer.appendChild(styleCard);
    });
    
    // انتخاب اولین سبک به صورت پیش‌فرض
    document.querySelector('.style-card').classList.add('active');
}

function selectWritingStyle(card) {
    // حذف active از همه
    document.querySelectorAll('.style-card').forEach(c => {
        c.classList.remove('active');
    });
    
    // اضافه کردن active به کارت انتخاب شده
    card.classList.add('active');
    
    const style = card.dataset.style;
    console.log(`سبک انتخاب شده: ${style}`);
    
    showAlert(`سبک "${card.querySelector('h3').textContent}" انتخاب شد`, 'success');
}

function generateContent() {
    const topic = document.getElementById('topic-input').value.trim();
    const length = document.getElementById('length-slider').value;
    const creativity = document.getElementById('creativity-slider').value;
    
    if (!topic) {
        showAlert('لطفاً موضوعی برای تولید محتوا وارد کنید.', 'warning');
        return;
    }
    
    // نمایش پیشرفت
    const generateBtn = document.getElementById('generate-btn');
    const originalText = generateBtn.innerHTML;
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال تولید...';
    
    // شبیه‌سازی فرآیند تولید
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        document.getElementById('progress-fill').style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            
            // فعال کردن دکمه
            generateBtn.disabled = false;
            generateBtn.innerHTML = originalText;
            
            // تولید محتوای نمونه
            const generatedText = generateSampleContent(topic, length, creativity);
            document.getElementById('text-output').innerHTML = generatedText;
            
            // نمایش پیام موفقیت
            showAlert('محتوای شما با موفقیت تولید شد!', 'success');
            updateStatsAfterGeneration();
        }
    }, 100);
}

function generateSampleContent(topic, length, creativity) {
    const sentences = [
        `در این مقاله به بررسی موضوع "${topic}" می‌پردازیم.`,
        `این موضوع در دنیای امروز از اهمیت ویژه‌ای برخوردار است.`,
        `با توجه به پیشرفت‌های اخیر در این زمینه، شاهد تحولات بزرگی بوده‌ایم.`,
        `از جمله مزایای این موضوع می‌توان به بهبود کیفیت زندگی اشاره کرد.`,
        `تحقیقات نشان می‌دهد که این رویکرد تأثیر مثبتی بر جامعه دارد.`,
        `در ادامه به بررسی دقیق‌تر جنبه‌های مختلف این موضوع خواهیم پرداخت.`,
        `نتایج مطالعات حاکی از آن است که این روش کارآمدتر است.`,
        `با استفاده از این تکنیک می‌توان به نتایج بهتری دست یافت.`,
        `این نوآوری مسیر جدیدی را در این حوزه گشوده است.`,
        `در نهایت می‌توان گفت که آینده روشنی در انتظار این حوزه است.`
    ];
    
    const creativityLevel = parseInt(creativity);
    let content = '';
    const wordCount = parseInt(length);
    
    // تولید متن بر اساس سطح خلاقیت
    for (let i = 0; i < Math.min(wordCount / 20, sentences.length); i++) {
        let sentence = sentences[i];
        
        // افزودن خلاقیت
        if (creativityLevel > 70 && Math.random() > 0.5) {
            sentence = addCreativity(sentence);
        }
        
        // افزودن ادبیات
        if (creativityLevel > 50) {
            sentence = addLiteraryElements(sentence);
        }
        
        content += `<p>${sentence}</p>`;
    }
    
    // اضافه کردن عنوان
    content = `<h3>${topic}</h3>` + content;
    
    // اضافه کردن نتیجه‌گیری
    content += `<div class="conclusion">
        <h4>نتیجه‌گیری</h4>
        <p>در پایان، می‌توان گفت که موضوع "${topic}" از جنبه‌های مختلفی حائز اهمیت است 
        و درک عمیق آن می‌تواند راهگشای بسیاری از چالش‌های پیش رو باشد.</p>
    </div>`;
    
    return content;
}

function addCreativity(sentence) {
    const creativePhrases = [
        "به جرأت می‌توان گفت",
        "بدون شک",
        "از منظر نوینی",
        "در پرتو یافته‌های جدید",
        "با نگاهی آینده‌نگرانه",
        "به صورت بی‌سابقه‌ای"
    ];
    
    const phrase = creativePhrases[Math.floor(Math.random() * creativePhrases.length)];
    return phrase + " " + sentence;
}

function addLiteraryElements(sentence) {
    const literaryElements = [
        "همان‌گونه که",
        "چنانچه",
        "گویا",
        "به مثابه",
        "درست مانند",
        "شاید بتوان گفت"
    ];
    
    if (Math.random() > 0.7) {
        const element = literaryElements[Math.floor(Math.random() * literaryElements.length)];
        return element + " " + sentence;
    }
    return sentence;
}

function improveText() {
    const input = document.getElementById('text-input').value.trim();
    
    if (!input) {
        showAlert('لطفاً متنی برای بهبود وارد کنید.', 'warning');
        return;
    }
    
    // شبیه‌سازی بهبود متن
    let improvedText = input;
    
    // بهبود گرامر
    improvedText = improvedText.replace(/ می شود /g, ' می‌شود ');
    improvedText = improvedText.replace(/ می گردد /g, ' می‌گردد ');
    
    // بهبود علائم نگارشی
    improvedText = improvedText.replace(/ ,/g, '،');
    improvedText = improvedText.replace(/ \./g, '.');
    
    // اضافه کردن پیچیدگی ادبی
    const sentences = improvedText.split('. ');
    if (sentences.length > 2) {
        sentences[1] = "علاوه بر این، " + sentences[1];
    }
    improvedText = sentences.join('. ');
    
    document.getElementById('text-output').innerHTML = `<p>${improvedText}</p>`;
    showAlert('متن شما بهبود یافت!', 'success');
}

function summarizeText() {
    const input = document.getElementById('text-input').value.trim();
    
    if (!input) {
        showAlert('لطفاً متنی برای خلاصه‌سازی وارد کنید.', 'warning');
        return;
    }
    
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const summaryLength = Math.ceil(sentences.length * 0.3); // 30% خلاصه
    
    let summary = '';
    for (let i = 0; i < Math.min(summaryLength, sentences.length); i++) {
        summary += `<p>${sentences[i].trim()}.</p>`;
    }
    
    document.getElementById('text-output').innerHTML = `
        <div class="summary">
            <h4>خلاصه متن:</h4>
            ${summary}
            <div class="summary-info">
                <i class="fas fa-chart-line"></i>
                <span>متن اصلی: ${sentences.length} جمله | خلاصه: ${summaryLength} جمله</span>
            </div>
        </div>
    `;
    
    showAlert(`متن شما به ${summaryLength} جمله خلاصه شد!`, 'success');
}

function resetWriter() {
    if (confirm('آیا مطمئن هستید که می‌خواهید همه چیز را بازنشانی کنید؟')) {
        document.getElementById('text-input').value = '';
        document.getElementById('text-output').innerHTML = '<div class="output-placeholder">محتوای تولید شده اینجا نمایش داده می‌شود...</div>';
        document.getElementById('topic-input').value = '';
        document.getElementById('length-slider').value = 500;
        document.getElementById('creativity-slider').value = 50;
        
        updateWordCount();
        updateReadingTime();
        document.getElementById('length-value').textContent = '500 کلمه';
        document.getElementById('creativity-value').textContent = 'معمولی';
        
        showAlert('همه موارد بازنشانی شدند.', 'success');
    }
}

function copyOutput() {
    const output = document.getElementById('text-output').textContent;
    
    if (!output || output.includes('محتوای تولید شده')) {
        showAlert('هیچ متنی برای کپی کردن وجود ندارد.', 'warning');
        return;
    }
    
    navigator.clipboard.writeText(output).then(() => {
        showAlert('متن با موفقیت کپی شد!', 'success');
    });
}

function saveContent() {
    const output = document.getElementById('text-output').textContent;
    
    if (!output || output.includes('محتوای تولید شده')) {
        showAlert('هیچ متنی برای ذخیره کردن وجود ندارد.', 'warning');
        return;
    }
    
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'محتوا-تولید-شده.txt';
    a.click();
    
    showAlert('فایل با موفقیت ذخیره شد!', 'success');
}

function updateStatsAfterGeneration() {
    // افزایش آمار
    const generatedCount = document.getElementById('generated-count');
    const current = parseInt(generatedCount.textContent.replace(/,/g, ''));
    generatedCount.textContent = (current + 1).toLocaleString();
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    const container = document.querySelector('.smart-writer-container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // حذف خودکار بعد از 5 ثانیه
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// تابع کمکی برای ایجاد تأخیر
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
