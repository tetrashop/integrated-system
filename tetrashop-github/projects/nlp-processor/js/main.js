// پروژه NLP Processor
document.addEventListener('DOMContentLoaded', function() {
    console.log('پروژه NLP با ۲۲۵ پست بارگذاری شد');
    
    // شمارنده پست‌ها
    const counter = document.createElement('div');
    counter.className = 'counter';
    counter.textContent = '۲۲۵ پست';
    document.querySelector('.header').appendChild(counter);
    
    // اضافه کردن قابلیت جستجو
    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = 'جستجو در پست‌ها...';
    searchBox.style.cssText = `
        width: 100%;
        padding: 12px;
        margin: 20px 0;
        border-radius: 10px;
        border: none;
        font-size: 16px;
        text-align: right;
    `;
    
    document.querySelector('.header').appendChild(searchBox);
    
    // فیلتر کردن پست‌ها
    searchBox.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const posts = document.querySelectorAll('.post-card');
        
        posts.forEach(post => {
            const text = post.textContent.toLowerCase();
            post.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    });
});
