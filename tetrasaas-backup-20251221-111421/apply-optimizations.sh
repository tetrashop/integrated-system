#!/bin/bash

echo "🚀 اجرای الگوریتم‌های بهبود بهره‌وری TetraSaaS"
echo "================================================"

# 1. نصب ابزارهای مورد نیاز
echo "📦 مرحله ۱: نصب ابزارهای مورد نیاز..."
pkg install -y jq python numpy python-scipy python-pandas 2>/dev/null || pip install numpy scipy pandas sympy

# 2. ایجاد ساختار دایرکتوری بهبود یافته
echo "📁 مرحله ۲: ایجاد ساختار دایرکتوری..."
mkdir -p optimized-services/{ai,tools,security,system,network,dev,science}

# 3. ایجاد فایل‌های بهبود یافته برای هر سرویس
echo "🛠️ مرحله ۳: ایجاد سرویس‌های بهبود یافته..."

# 3.1. بهبود حل کننده فرمول
cat > optimized-services/tools/formula-solver-improved.js << 'JS_EOF'
// حل کننده فرمول بهبود یافته
const math = require('mathjs');

class FormulaSolver {
    constructor() {
        this.cache = new Map();
    }
    
    async solve(expression, variable, options = {}) {
        const cacheKey = `${expression}-${variable}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        try {
            // پارس عبارت
            const node = math.parse(expression);
            
            // استخراج متغیرها
            const vars = node.filter(n => n.isSymbolNode);
            
            // حل معادله
            let solution;
            if (options.solveFor) {
                solution = math.solve(expression, variable);
            } else {
                // محاسبه مقدار
                const scope = {};
                if (options.values) {
                    Object.keys(options.values).forEach(key => {
                        scope[key] = options.values[key];
                    });
                }
                solution = node.evaluate(scope);
            }
            
            // تولید راه‌حل گام‌به‌گام
            const steps = this.generateSteps(node, solution);
            
            const result = {
                success: true,
                expression,
                variable,
                solution: solution.toString(),
                steps,
                type: this.determineType(node),
                timestamp: new Date().toISOString()
            };
            
            // کش کردن نتیجه
            this.cache.set(cacheKey, result);
            setTimeout(() => this.cache.delete(cacheKey), 300000); // 5 دقیقه
            
            return result;
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                expression,
                variable,
                timestamp: new Date().toISOString()
            };
        }
    }
    
    generateSteps(node, solution) {
        const steps = [];
        
        // مرحله ۱: ساده‌سازی اولیه
        steps.push({
            step: 1,
            description: "ساده‌سازی عبارت اولیه",
            expression: node.toString()
        });
        
        // مرحله ۲: اعمال قوانین جبری
        steps.push({
            step: 2,
            description: "اعمال قوانین جبری",
            expression: math.simplify(node.toString()).toString()
        });
        
        // مرحله ۳: حل معادله
        steps.push({
            step: 3,
            description: "حل برای متغیر مورد نظر",
            expression: solution.toString()
        });
        
        return steps;
    }
    
    determineType(node) {
        if (node.type === 'OperatorNode') {
            if (node.op === '^') return 'exponential';
            if (node.op === 'derivative') return 'calculus';
        }
        return 'algebraic';
    }
    
    // قابلیت‌های اضافی
    async derivative(expression, variable, order = 1) {
        return math.derivative(expression, variable, order).toString();
    }
    
    async integral(expression, variable, limits) {
        if (limits) {
            return math.integral(expression, variable, limits.from, limits.to).toString();
        }
        return math.integral(expression, variable).toString();
    }
}

module.exports = FormulaSolver;
JS_EOF

# 3.2. بهبود تحلیلگر محتوا
cat > optimized-services/ai/content-analyzer-improved.js << 'JS_EOF'
// تحلیلگر محتوا بهبود یافته
const natural = require('natural');
const persianStopwords = require('./persian-stopwords');

class ContentAnalyzer {
    constructor() {
        this.tokenizer = new natural.WordTokenizer();
        this.sentiment = new natural.SentimentAnalyzer('Persian', persianStopwords, 'afinn');
        
        // الگوهای فارسی
        this.patterns = {
            positive: ['خوب', 'عالی', 'ممتاز', 'عالی', 'فوقالعاده'],
            negative: ['بد', 'ضعیف', 'ناامید', 'ضعیف', 'مخرب']
        };
    }
    
    async analyze(text, options = {}) {
        const startTime = Date.now();
        
        // ۱. پیش‌پردازش متن
        const cleanedText = this.preprocess(text);
        
        // ۲. توکن‌سازی
        const tokens = this.tokenizer.tokenize(cleanedText);
        
        // ۳. استخراج ویژگی‌ها
        const features = {
            // آماری
            wordCount: tokens.length,
            sentenceCount: this.countSentences(text),
            avgWordLength: this.averageWordLength(tokens),
            readingTime: this.calculateReadingTime(text),
            
            // معنایی
            keywords: this.extractKeywords(tokens, 10),
            entities: this.extractEntities(tokens),
            topics: this.extractTopics(tokens),
            
            // احساسات
            sentiment: this.analyzeSentiment(tokens),
            emotion: this.detectEmotion(tokens),
            
            // کیفیت
            readability: this.calculateReadability(text),
            complexity: this.calculateComplexity(tokens),
            uniqueness: this.calculateUniqueness(tokens)
        };
        
        // ۴. تولید خلاصه
        const summary = this.generateSummary(text, 3);
        
        // ۵. امتیازدهی
        const scores = this.calculateScores(features);
        
        const processingTime = Date.now() - startTime;
        
        return {
            metadata: {
                language: 'persian',
                processedLength: text.length,
                processingTime: `${processingTime}ms`,
                timestamp: new Date().toISOString()
            },
            features,
            summary,
            scores,
            recommendations: this.generateRecommendations(scores)
        };
    }
    
    preprocess(text) {
        // حذف اعداد، علائم نگارشی، نرمال‌سازی
        return text
            .replace(/[0-9]/g, '')
            .replace(/[^\u0600-\u06FF\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }
    
    extractKeywords(tokens, count = 10) {
        // استفاده از TF-IDF ساده شده
        const frequencies = {};
        tokens.forEach(token => {
            if (!persianStopwords.includes(token)) {
                frequencies[token] = (frequencies[token] || 0) + 1;
            }
        });
        
        return Object.entries(frequencies)
            .sort((a, b) => b[1] - a[1])
            .slice(0, count)
            .map(([word, freq]) => ({ word, frequency: freq }));
    }
    
    analyzeSentiment(tokens) {
        const score = this.sentiment.getSentiment(tokens);
        
        let label = 'خنثی';
        if (score > 0.5) label = 'بسیار مثبت';
        else if (score > 0.1) label = 'مثبت';
        else if (score < -0.5) label = 'بسیار منفی';
        else if (score < -0.1) label = 'منفی';
        
        return { score: Math.round(score * 100) / 100, label };
    }
    
    calculateReadability(text) {
        // فرمول ساده‌شده خوانایی فارسی
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]+/).length;
        const complexWords = text.split(/\s+/).filter(word => word.length > 6).length;
        
        const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (complexWords / words));
        
        let level = 'متوسط';
        if (score > 80) level = 'آسان';
        else if (score > 60) level = 'نسبتا آسان';
        else if (score > 40) level = 'متوسط';
        else if (score > 20) level = 'نسبتا سخت';
        else level = 'سخت';
        
        return { score: Math.round(score), level };
    }
    
    generateSummary(text, sentenceCount = 3) {
        // الگوریتم TextRank ساده شده
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = text.toLowerCase().split(/\s+/);
        
        // محاسبه امتیاز هر جمله
        const sentenceScores = sentences.map(sentence => {
            const sentenceWords = sentence.toLowerCase().split(/\s+/);
            let score = 0;
            
            // امتیاز بر اساس کلمات کلیدی
            this.extractKeywords(words, 20).forEach(keyword => {
                if (sentenceWords.includes(keyword.word)) {
                    score += keyword.frequency;
                }
            });
            
            // امتیاز بر اساس موقعیت (جملات اول مهم‌ترند)
            score += 1 / (sentences.indexOf(sentence) + 1);
            
            return { sentence, score };
        });
        
        // انتخاب جملات برتر
        return sentenceScores
            .sort((a, b) => b.score - a.score)
            .slice(0, sentenceCount)
            .map(item => item.sentence.trim());
    }
    
    calculateScores(features) {
        return {
            quality: Math.min(100, Math.round(
                (features.readability.score / 100) * 30 +
                (features.sentiment.score + 1) * 20 +
                (1 - features.complexity) * 50
            )),
            engagement: Math.min(100, Math.round(
                features.sentiment.score * 40 +
                (features.keywords.length / 10) * 30 +
                (features.uniqueness * 30)
            )),
            clarity: Math.min(100, Math.round(
                features.readability.score * 0.6 +
                (1 - features.complexity) * 40
            ))
        };
    }
    
    generateRecommendations(scores) {
        const recommendations = [];
        
        if (scores.quality < 60) {
            recommendations.push({
                type: 'quality',
                suggestion: 'کیفیت محتوا نیاز به بهبود دارد. از جملات کوتاه‌تر و کلمات ساده‌تر استفاده کنید.',
                priority: 'high'
            });
        }
        
        if (scores.engagement < 50) {
            recommendations.push({
                type: 'engagement',
                suggestion: 'درگیرسازی مخاطب کم است. از کلمات کلیدی مرتبط و بیان احساسی‌تر استفاده کنید.',
                priority: 'medium'
            });
        }
        
        if (scores.clarity < 70) {
            recommendations.push({
                type: 'clarity',
                suggestion: 'وضوح محتوا می‌تواند بهتر باشد. ساختار جمله‌ها را ساده‌تر کنید.',
                priority: 'medium'
            });
        }
        
        return recommendations;
    }
    
    // توابع کمکی
    countSentences(text) {
        return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    }
    
    averageWordLength(tokens) {
        return tokens.reduce((sum, token) => sum + token.length, 0) / tokens.length;
    }
    
    calculateReadingTime(text) {
        const wordsPerMinute = 200; // متوسط خواندن فارسی
        const wordCount = text.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }
}

module.exports = ContentAnalyzer;
JS_EOF

# 4. ایجاد اسکریپت تست بهبود یافته
cat > optimized-services/run-tests.sh << 'EOF'
#!/bin/bash

echo "🧪 تست سرویس‌های بهبود یافته"
echo "=============================="

# تابع تست با jq
test_with_jq() {
    local service_name=$1
    local port=$2
    local endpoint=$3
    local method=${4:-GET}
    local data=${5:-}
    
    local response
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -X POST "http://localhost:$port$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" \
            -w "\n%{http_code}")
    else
        response=$(curl -s "http://localhost:$port$endpoint" -w "\n%{http_code}")
    fi
    
    local body=$(echo "$response" | head -n -1)
    local status=$(echo "$response" | tail -1)
    
    if [ "$status" = "200" ]; then
        echo "$body" | jq '.'
        return 0
    else
        echo "❌ خطا: کد وضعیت $status"
        return 1
    fi
}

# تست سرویس‌ها
echo ""
echo "1. 🔧 تست حل کننده فرمول بهبود یافته"
echo "-----------------------------------"
test_with_jq "formula-solver" 3008 "/solve" "POST" '{
    "expression": "x^2 + 3*x + 2",
    "variable": "x",
    "options": {
        "solveFor": true
    }
}'

echo ""
echo "2. 📝 تست تحلیلگر محتوا بهبود یافته"
echo "-----------------------------------"
test_with_jq "content-analyzer" 3006 "/analyze" "POST" '{
    "text": "هوش مصنوعی در حال تحول دنیای فناوری است. این تکنولوژی نه تنها زندگی روزمره را ساده‌تر کرده، بلکه فرصت‌های جدیدی در زمینه‌های مختلف ایجاد کرده است. با این حال، چالش‌های اخلاقی و اجتماعی نیز به همراه دارد.",
    "options": {
        "language": "persian"
    }
}'

echo ""
echo "✅ تست‌های بهبود یافته کامل شد"
