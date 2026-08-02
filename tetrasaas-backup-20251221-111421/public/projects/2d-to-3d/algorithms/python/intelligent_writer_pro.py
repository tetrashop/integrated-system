from flask import Flask, render_template, request, jsonify
import os
import json
from datetime import datetime

app = Flask(__name__)

class IntelligentWriterPro:
    def __init__(self):
        self.templates = {
            "مقاله وبلاگ": {
                "structure": ["مقدمه", "بدنه اصلی", "نتیجه‌گیری"],
                "style": "رسمی"
            },
            "پست شبکه اجتماعی": {
                "structure": ["عنوان جذاب", "متن کوتاه", "هشتگ"],
                "style": "خودمانی"
            },
            "ایمیل": {
                "structure": ["سلام", "بدنه", "پایان"],
                "style": "رسمی"
            }
        }
    
    def generate_content(self, topic, content_type, style="رسمی", length="medium"):
        # شبیه‌سازی تولید محتوا پیشرفته
        base_content = f"""
# {topic}

## تولید شده توسط Intelligent Writer Pro
**تاریخ:** {datetime.now().strftime('%Y-%m-%d %H:%M')}
**سبک:** {style}
**نوع:** {content_type}

"""
        
        if content_type == "مقاله وبلاگ":
            base_content += f"""
## مقدمه
در این مقاله به بررسی جامع {topic} می‌پردازیم. این موضوع در دنیای امروز اهمیت ویژه‌ای دارد.

## بخش اصلی
مطالعات نشان می‌دهد که {topic} تاثیر قابل توجهی در صنعت دارد.

### مزایای کلیدی:
- افزایش کارایی و بهره‌وری
- کاهش هزینه‌های عملیاتی  
- بهبود تجربه کاربری

## نتیجه‌گیری
با تحلیل‌های انجام شده، {topic} نقش مهمی در آینده خواهد داشت.
"""
        elif content_type == "پست شبکه اجتماعی":
            base_content += f"""
🎯 {topic}

✨ آیا می‌دانستید که {topic} می‌تواند زندگی شما را متحول کند؟

✅ مزیت اول: صرفه‌جویی در زمان
✅ مزیت دوم: افزایش بهره‌وری
✅ مزیت سوم: کاهش هزینه‌ها

💬 نظر شما چیست؟ در کامنت‌ها بنویسید!

#{topic.replace(' ', '')} #موفقیت #تکنولوژی
"""
        
        return base_content

# ایجاد نمونه
writer_pro = IntelligentWriterPro()

@app.route('/')
def home():
    return "Intelligent Writer Pro - برای رابط کاربری به /intelligent_writer_pro بروید"

@app.route('/intelligent_writer_pro')
def intelligent_writer_pro():
    return render_template('intelligent_writer_pro.html')

@app.route('/api/generate_pro', methods=['POST'])
def generate_content_pro():
    data = request.json
    topic = data.get('topic', '')
    content_type = data.get('content_type', 'مقاله وبلاگ')
    style = data.get('style', 'رسمی')
    length = data.get('length', 'medium')
    
    if not topic:
        return jsonify({'error': 'موضوع را وارد کنید'}), 400
    
    content = writer_pro.generate_content(topic, content_type, style, length)
    
    return jsonify({
        'status': 'success',
        'content': content,
        'word_count': len(content.split()),
        'timestamp': datetime.now().isoformat(),
        'template_used': content_type
    })

@app.route('/api/templates')
def get_templates():
    return jsonify({
        'templates': list(writer_pro.templates.keys()),
        'styles': ['رسمی', 'خودمانی', 'تبلیغاتی', 'آکادمیک']
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
