"""
🧠 هوش نگار - نسخه مبتنی بر قالب
"""

import random
import json
from datetime import datetime

class TemplateIntelligentWriter:
    def __init__(self):
        self.templates = {
            'مقاله': {
                'مقدمه': [
                    "در جهان امروز، {موضوع} به یکی از مهم‌ترین مباحث تبدیل شده است.",
                    "موضوع {موضوع} در عصر حاضر از جایگاه ویژه‌ای برخوردار است.",
                    "بررسی {موضوع} می‌تواند دیدگاه‌های جدیدی را برای ما فراهم کند."
                ],
                'تاریخچه': [
                    "تاریخچه {موضوع} به سال‌ها پیش بازمی‌گردد.",
                    "تحولات {موضوع} در طول تاریخ بسیار چشمگیر بوده است.",
                    "مطالعه تاریخچه {موضوع} نشان می‌دهد که..."
                ],
                'کاربردها': [
                    "از {موضوع} در زمینه‌های مختلفی استفاده می‌شود.",
                    "کاربردهای {موضوع} در صنعت و تکنولوژی بسیار گسترده است.",
                    "{موضوع} نقش مهمی در توسعه فناوری دارد."
                ],
                'نتیجه‌گیری': [
                    "در نتیجه، {موضوع} تأثیر عمیقی بر زندگی ما دارد.",
                    "بر اساس بررسی‌ها، {موضوع} در آینده نیز اهمیت خود را حفظ خواهد کرد.",
                    "در پایان باید گفت که {موضوع}..."
                ]
            },
            'گزارش': {
                'چکیده': ["این گزارش به بررسی {موضوع} می‌پردازد."],
                'روش‌شناسی': ["در این گزارش از روش‌های مختلفی برای تحلیل {موضوع} استفاده شده است."],
                'یافته‌ها': ["یافته‌های این گزارش نشان می‌دهد که {موضوع}..."],
                'توصیه‌ها': ["بر اساس نتایج، توصیه می‌شود در زمینه {موضوع}..."]
            },
            'داستان': {
                'شروع': ["در سرزمینی دور، داستان {موضوع} آغاز شد."],
                'پیشرفت': ["قهرمان داستان با چالش‌های زیادی در زمینه {موضوع} روبرو شد."],
                'اوج': ["نقطه اوج داستان زمانی بود که {موضوع}..."],
                'پایان': ["در پایان، داستان {موضوع} به نتیجه رسید."]
            }
        }
        
        self.keywords = {
            'تکنولوژی': ['دیجیتال', 'هوشمند', 'اتوماتیک', 'پیشرفته'],
            'علم': ['تحقیق', 'آزمایش', 'نظریه', 'کشف'],
            'هنر': ['خلاقیت', 'زیبایی', 'بیان', 'احساس'],
            'تجارت': ['سود', 'بازار', 'رقابت', 'توسعه']
        }
    
    def _detect_topic_type(self, topic):
        """تشخیص نوع موضوع برای انتخاب کلمات کلیدی مناسب"""
        for category, keywords in self.keywords.items():
            if any(keyword in topic for keyword in keywords):
                return category
        return 'علم'
    
    def _enhance_sentence(self, sentence, topic, topic_type):
        """افزودن کلمات کلیدی به جمله"""
        enhanced = sentence
        if random.random() > 0.5:
            keyword = random.choice(self.keywords[topic_type])
            enhanced = enhanced.replace('.', f' {keyword}.')
        return enhanced
    
    def generate_content(self, topic, template_type='مقاله', length='medium'):
        """تولید محتوای هوشمند"""
        if template_type not in self.templates:
            template_type = 'مقاله'
        
        topic_type = self._detect_topic_type(topic)
        
        # تعیین طول محتوا
        length_map = {'short': 2, 'medium': 4, 'long': 6}
        num_sections = length_map.get(length, 4)
        
        sections = {}
        template_sections = list(self.templates[template_type].keys())[:num_sections]
        
        for section in template_sections:
            sentence_template = random.choice(self.templates[template_type][section])
            sentence = sentence_template.format(موضوع=topic)
            enhanced_sentence = self._enhance_sentence(sentence, topic, topic_type)
            sections[section] = enhanced_sentence
        
        return {
            "title": f"{template_type} درباره {topic}",
            "topic": topic,
            "type": template_type,
            "length": length,
            "sections": sections,
            "word_count": sum(len(section.split()) for section in sections.values()),
            "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "version": "هوش نگار 1.0"
        }
    
    def generate_multiple_options(self, topic, num_options=3):
        """تولید چندین گزینه مختلف"""
        options = []
        template_types = list(self.templates.keys())
        
        for i in range(num_options):
            template_type = random.choice(template_types)
            length = random.choice(['short', 'medium', 'long'])
            content = self.generate_content(topic, template_type, length)
            options.append(content)
        
        return options

# تست سیستم
print("🧠 راه‌اندازی هوش نگار مبتنی بر قالب...")
writer = TemplateIntelligentWriter()

# تست تولید محتوا
print("\n📝 تست تولید محتوا:")
result = writer.generate_content("هوش مصنوعی", "مقاله", "medium")
print(f"✅ عنوان: {result['title']}")
print(f"📊 تعداد کلمات: {result['word_count']}")
print(f"🕒 زمان تولید: {result['generated_at']}")
print("\n📖 محتوا:")
for section, content in result['sections'].items():
    print(f"  • {section}: {content}")

# تست گزینه‌های متعدد
print("\n🎲 تست گزینه‌های مختلف:")
options = writer.generate_multiple_options("تکنولوژی", 2)
for i, option in enumerate(options, 1):
    print(f"\nگزینه {i}: {option['title']}")
    print(f"   نوع: {option['type']} | طول: {option['length']}")

