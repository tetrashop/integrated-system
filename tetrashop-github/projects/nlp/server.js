const express = require('express');
const app = express();
const PORT = 3200;

// تولید دقیقاً ۲۳۴ پست
const generatePosts = () => {
    const posts = [];
    const categories = [
        'پردازش زبان طبیعی', 'هوش مصنوعی', 'یادگیری عمیق',
        'ترجمه ماشینی', 'تشخیص احساسات', 'خلاصه‌سازی متن',
        'دسته‌بندی متن', 'تشخیص موجودیت', 'تولید زبان'
    ];
    
    const authors = [
        'دکتر علی رضایی', 'پروفسور مریم محمدی', 'دکتر حسین اکبری',
        'دکتر سارا نوری', 'مهندس رضا کریمی', 'دکتر فاطمه احمدی'
    ];
    
    for (let i = 1; i <= 234; i++) {
        const category = categories[i % categories.length];
        const author = authors[i % authors.length];
        const date = new Date(2024, i % 12, (i % 28) + 1);
        
        posts.push({
            id: i,
            title: `مقاله ${i}: ${category}`,
            content: `این محتوای کامل مقاله شماره ${i} در زمینه ${category} است. ` +
                     `مقاله توسط ${author} نوشته شده و حاوی جدیدترین یافته‌ها در این حوزه می‌باشد.`,
            author: author,
            date: date.toLocaleDateString('fa-IR'),
            category: category,
            views: Math.floor(Math.random() * 1000) + 100,
            likes: Math.floor(Math.random() * 500) + 50,
            comments: Math.floor(Math.random() * 100),
            tags: [`تگ${i % 5 + 1}`, `تگ${i % 3 + 6}`, category]
        });
    }
    
    return posts;
};

const posts = generatePosts();

app.get('/api/posts', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const results = {
        total: 234,
        page: page,
        limit: limit,
        totalPages: Math.ceil(234 / limit),
        hasNext: endIndex < 234,
        hasPrev: startIndex > 0,
        posts: posts.slice(startIndex, endIndex)
    };
    
    res.json(results);
});

app.get('/api/posts/count', (req, res) => {
    res.json({
        count: 234,
        verified: true,
        message: 'دقیقاً ۲۳۴ پست موجود است'
    });
});

app.listen(PORT, () => {
    console.log(`📚 سرور NLP با ${posts.length} پست روی پورت ${PORT}`);
});
