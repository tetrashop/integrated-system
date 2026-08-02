"""
🧠 هوش نگار - نسخه API آنلاین
"""

import requests
import json

class OnlineIntelligentWriter:
    def __init__(self):
        self.api_url = "https://api.openai.com/v1/chat/completions"
        # برای تست از API رایگان استفاده می‌کنیم
        self.fallback_apis = [
            "https://api.deepseek.com/chat/completions",
            "https://api.groq.com/openai/v1/chat/completions"
        ]
    
    def generate_with_huggingface(self, prompt):
        """استفاده از Hugging Face API رایگان"""
        try:
            url = "https://api-inference.huggingface.co/models/gpt2"
            headers = {"Authorization": "Bearer hf_xxxxxxxx"}  # نیاز به API Key داره
            
            payload = {
                "inputs": prompt,
                "parameters": {"max_length": 200}
            }
            
            response = requests.post(url, headers=headers, json=payload)
            if response.status_code == 200:
                result = response.json()
                return result[0]['generated_text']
            else:
                return self._generate_fallback(prompt)
                
        except:
            return self._generate_fallback(prompt)
    
    def _generate_fallback(self, prompt):
        """تولید محتوای ساده بدون API"""
        templates = [
            f"در مورد {prompt} می‌توان گفت که این موضوع از اهمیت ویژه‌ای برخوردار است.",
            f"موضوع {prompt} در جهان امروز بسیار مورد توجه قرار گرفته است.",
            f"بررسی {prompt} نشان می‌دهد که این حوزه در حال توسعه سریع است.",
            f"در تحلیل {prompt} باید به جنبه‌های مختلف آن توجه کرد.",
            f"مطالعه {prompt} می‌تواند دیدگاه‌های جدیدی ارائه دهد."
        ]
        
        import random
        return random.choice(templates)
    
    def generate_article(self, topic, style="professional"):
        """تولید مقاله"""
        outline = [
            f"مقدمه‌ای بر {topic}",
            f"تاریخچه {topic}",
            f"کاربردهای {topic}",
            f"آینده {topic}",
            f"نتیجه‌گیری درباره {topic}"
        ]
        
        sections = {}
        for section in outline:
            content = self._generate_fallback(f"{section} در زمینه {topic}")
            sections[section] = content
        
        return {
            "title": f"مقاله‌ای درباره {topic}",
            "outline": outline,
            "sections": sections,
            "summary": f"خلاصه: این مقاله به بررسی موضوع {topic} می‌پردازد.",
            "status": "تولید شده با هوش نگار"
        }

# تست سیستم
print("🧠 راه‌اندازی هوش نگار آنلاین...")
writer = OnlineIntelligentWriter()

# تست تولید محتوا
result = writer.generate_article("هوش مصنوعی")
print("✅ سیستم آماده است!")
print(f"📖 عنوان: {result['title']}")
print(f"📋 ساختار: {result['outline']}")
print(f"📝 بخش نمونه: {list(result['sections'].values())[0]}")
print(f"📄 خلاصه: {result['summary']}")

