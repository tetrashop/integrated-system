# intelligent_writer/core/generator.py
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer, pipeline
from typing import List, Dict
import re

class IntelligentContentWriter:
    def __init__(self, model_name: str = "gpt2"):
        self.tokenizer = GPT2Tokenizer.from_pretrained(model_name)
        self.model = GPT2LMHeadModel.from_pretrained(model_name)
        self.sentiment_analyzer = pipeline("sentiment-analysis")
        
        # اضافه کردن token جدید برای زبان فارسی
        self.tokenizer.add_special_tokens({'pad_token': '[PAD]'})
    
    def generate_content(self, prompt: str, max_length: int = 500, 
                        temperature: float = 0.8) -> str:
        """تولید محتوای هوشمند بر اساس prompt"""
        inputs = self.tokenizer.encode(prompt, return_tensors="pt")
        
        with torch.no_grad():
            outputs = self.model.generate(
                inputs,
                max_length=max_length,
                temperature=temperature,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id,
                top_k=50,
                top_p=0.95,
                repetition_penalty=1.2
            )
        
        generated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return self._post_process_text(generated_text)
    
    def generate_article(self, topic: str, style: str = "professional") -> Dict:
        """تولید مقاله کامل با ساختار منظم"""
        outline = self._generate_outline(topic)
        
        sections = {}
        for section_title in outline:
            section_prompt = f"Write a detailed {style} section about {section_title} in the context of {topic}:"
            sections[section_title] = self.generate_content(section_prompt, max_length=300)
        
        return {
            "title": topic.title(),
            "outline": outline,
            "sections": sections,
            "summary": self._generate_summary(sections),
            "sentiment": self.analyze_sentiment(sections)
        }
    
    def _generate_outline(self, topic: str) -> List[str]:
        """تولید ساختار outline برای مقاله"""
        outline_prompt = f"Create a comprehensive outline for an article about {topic}:"
        outline_text = self.generate_content(outline_prompt, max_length=200)
        return self._parse_outline(outline_text)
    
    def _parse_outline(self, text: str) -> List[str]:
        """پارس کردن outline از متن تولید شده"""
        lines = text.split('\n')
        sections = []
        for line in lines:
            line = re.sub(r'^\d+\.\s*', '', line.strip())
            if line and len(line) > 10:  # فیلتر خطوط کوتاه
                sections.append(line)
        return sections[:6]  # حداکثر ۶ بخش
    
    def _generate_summary(self, sections: Dict) -> str:
        """تولید خلاصه مقاله"""
        full_text = " ".join(sections.values())
        summary_prompt = f"Summarize the following text in 100 words: {full_text[:1000]}"
        return self.generate_content(summary_prompt, max_length=150)
    
    def analyze_sentiment(self, text: str) -> Dict:
        """تحلیل احساسات متن"""
        if len(text) > 512:
            text = text[:512]
        result = self.sentiment_analyzer(text)[0]
        return {
            "label": result['label'],
            "score": round(result['score'], 3)
        }
    
    def _post_process_text(self, text: str) -> str:
        """پس‌پردازش متن تولید شده"""
        # حذف تکرارها
        sentences = text.split('. ')
        unique_sentences = []
        for sentence in sentences:
            if sentence not in unique_sentences:
                unique_sentences.append(sentence)
        
        return '. '.join(unique_sentences[:10])  # حداکثر ۱۰ جمله
