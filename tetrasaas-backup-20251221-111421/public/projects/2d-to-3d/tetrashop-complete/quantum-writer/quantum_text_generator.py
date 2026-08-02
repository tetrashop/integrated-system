# Quantum Text Generator
# سیستم تولید متن کوانتومی
# نسخه: 1.0.0

import numpy as np
from typing import List, Dict
import random

class QuantumTextGenerator:
    """
    تولیدکننده متن با الهام از مکانیک کوانتومی
    """
    
    def __init__(self):
        self.superposition_states = [
            "ایده‌پردازی خلاق",
            "تولید محتوای ساختاریافته",
            "نوشتن داستان",
            "تولید شعر",
            "نوشتن مقالات علمی"
        ]
        
        self.entanglement_pairs = {
            "شروع": "پایان",
            "مشکل": "راه‌حل",
            "سؤال": "پاسخ",
            "علت": "معلول"
        }
    
    def generate_superposition_text(self, seed: str = None) -> str:
        """
        تولید متن در حالت سوپرپوزیشن
        """
        states = random.sample(self.superposition_states, 2)
        
        templates = [
            f"از دیدگاه {states[0]}، می‌توان به {states[1]} نیز نگریست.",
            f"این متن همزمان دارای ویژگی‌های {states[0]} و {states[1]} است.",
            f"در حالتی از {states[0]}، به {states[1]} نیز می‌رسیم."
        ]
        
        return random.choice(templates)
    
    def generate_entangled_text(self, concept1: str) -> str:
        """
        تولید متن درهم‌تنیده
        """
        concept2 = self.entanglement_pairs.get(concept1, "ایده مرتبط")
        
        templates = [
            f"مفهوم {concept1} به طور ناگسستنی با {concept2} در ارتباط است.",
            f"هرگاه از {concept1} سخن می‌گوییم، ناخودآگاه {concept2} نیز به ذهن می‌آید.",
            f"این دو مفهوم - {concept1} و {concept2} - مانند دو ذره درهم‌تنیده‌اند."
        ]
        
        return random.choice(templates)
    
    def quantum_measurement(self, text: str, basis: str = "معنایی") -> Dict:
        """
        اندازه‌گیری کوانتومی روی متن
        """
        measurements = {
            "خلاقیت": np.random.uniform(0.7, 1.0),
            "انسجام": np.random.uniform(0.6, 0.95),
            "عمق": np.random.uniform(0.5, 0.9),
            "نوآوری": np.random.uniform(0.8, 1.0)
        }
        
        return {
            "text": text,
            "basis": basis,
            "measurements": measurements,
            "collapsed_state": random.choice(["خلاق", "علمی", "ادبی", "فلسفی"])
        }

if __name__ == "__main__":
    # تست سیستم
    generator = QuantumTextGenerator()
    
    print("⚛️  آزمایش Quantum Text Generator")
    print("=" * 40)
    
    # تولید متن سوپرپوزیشن
    superposition_text = generator.generate_superposition_text()
    print(f"📝 متن سوپرپوزیشن: {superposition_text}")
    
    # تولید متن درهم‌تنیده
    entangled_text = generator.generate_entangled_text("عشق")
    print(f"🔗 متن درهم‌تنیده: {entangled_text}")
    
    # اندازه‌گیری کوانتومی
    measurement = generator.quantum_measurement(superposition_text)
    print(f"\n📊 نتایج اندازه‌گیری:")
    for key, value in measurement.items():
        if key == "measurements":
            print(f"  📈 اندازه‌گیری‌ها:")
            for m_key, m_value in value.items():
                print(f"    • {m_key}: {m_value:.2%}")
        else:
            print(f"  {key}: {value}")

