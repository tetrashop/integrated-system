# Homomorphic Encryption System
# رمزنگاری هومومورفیک برای پردازش متن‌های رمز شده

import numpy as np

class HomomorphicEncryption:
    """
    سیستم رمزنگاری هومومورفیک
    امکان پردازش روی داده‌های رمز شده
    """
    
    def __init__(self, security_level: str = "high"):
        self.security_level = security_level
        self.noise_level = 0.1 if security_level == "high" else 0.3
    
    def encrypt(self, number: float) -> tuple:
        """
        رمزنگاری یک عدد
        """
        # پیاده‌سازی ساده برای نمایش
        noise = np.random.uniform(-self.noise_level, self.noise_level)
        encrypted = number + noise
        key = hash(str(number)) % 1000
        
        return (encrypted, key)
    
    def add_encrypted(self, enc1: tuple, enc2: tuple) -> tuple:
        """
        جمع دو عدد رمز شده
        """
        result = enc1[0] + enc2[0]
        key = (enc1[1] + enc2[1]) % 1000
        
        return (result, key)
    
    def decrypt(self, encrypted_data: tuple, original_key: int) -> float:
        """
        رمزگشایی
        """
        # در پیاده‌سازی واقعی، این بخش پیچیده‌تر است
        return encrypted_data[0] - (encrypted_data[1] - original_key) * 0.01

if __name__ == "__main__":
    print("🔐 سیستم رمزنگاری هومومورفیک")
    print("=" * 40)
    
    he = HomomorphicEncryption()
    
    # رمزنگاری دو عدد
    num1 = 42.5
    num2 = 17.3
    
    enc1 = he.encrypt(num1)
    enc2 = he.encrypt(num2)
    
    print(f"🔢 عدد ۱: {num1} → رمز شده: {enc1}")
    print(f"🔢 عدد ۲: {num2} → رمز شده: {enc2}")
    
    # جمع روی داده‌های رمز شده
    enc_sum = he.add_encrypted(enc1, enc2)
    print(f"➕ جمع رمز شده: {enc_sum}")
    
    # رمزگشایی
    decrypted = he.decrypt(enc_sum, (hash(str(num1)) + hash(str(num2))) % 1000)
    actual_sum = num1 + num2
    
    print(f"\n🎯 نتیجه:")
    print(f"  جمع واقعی: {actual_sum}")
    print(f"  جمع از رمزگشایی: {decrypted:.2f}")
    print(f"  خطا: {abs(actual_sum - decrypted):.4f}")

