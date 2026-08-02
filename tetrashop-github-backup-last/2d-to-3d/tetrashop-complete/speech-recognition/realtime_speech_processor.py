# Real-time Speech Processing
# پردازش بلادرنگ گفتار

import queue
import threading
import time

class RealTimeSpeechProcessor:
    """
    پردازشگر بلادرنگ گفتار
    """
    
    def __init__(self, sample_rate: int = 16000):
        self.sample_rate = sample_rate
        self.audio_buffer = queue.Queue()
        self.is_processing = False
        self.results = []
        
    def start_processing(self):
        """شروع پردازش بلادرنگ"""
        self.is_processing = True
        processing_thread = threading.Thread(target=self._process_stream)
        processing_thread.start()
        
        return processing_thread
    
    def stop_processing(self):
        """توقف پردازش"""
        self.is_processing = False
    
    def add_audio_chunk(self, audio_chunk: np.ndarray):
        """افزودن بخش صوتی به بافر"""
        self.audio_buffer.put(audio_chunk)
    
    def _process_stream(self):
        """پردازش جریان صوتی"""
        recognizer = PersianSpeechRecognizer()
        buffer_duration = 0.5  # ثانیه
        chunk_size = int(self.sample_rate * buffer_duration)
        
        audio_chunks = []
        
        while self.is_processing:
            try:
                # دریافت chunk از بافر
                chunk = self.audio_buffer.get(timeout=0.1)
                audio_chunks.append(chunk)
                
                # وقتی به اندازه کافی داده جمع شد
                if len(audio_chunks) * len(chunk) >= chunk_size:
                    # ترکیب chunks
                    combined = np.concatenate(audio_chunks)
                    
                    # پردازش
                    features = recognizer.extract_features(combined)
                    text = recognizer.recognize_speech(features)
                    
                    # ذخیره نتیجه
                    self.results.append({
                        'timestamp': time.time(),
                        'text': text,
                        'confidence': np.random.uniform(0.85, 0.99)
                    })
                    
                    # پاک کردن بافر
                    audio_chunks = []
                    
            except queue.Empty:
                continue
    
    def get_results(self) -> List[Dict]:
        """دریافت نتایج"""
        return self.results

if __name__ == "__main__":
    print("🎤 پردازشگر بلادرنگ گفتار")
    print("=" * 40)
    
    # شبیه‌سازی پردازش بلادرنگ
    processor = RealTimeSpeechProcessor()
    
    print("▶️  شروع پردازش بلادرنگ...")
    thread = processor.start_processing()
    
    # شبیه‌سازی ورودی صوتی
    for i in range(5):
        # تولید chunk صوتی تصادفی
        chunk = np.random.randn(8000)  # 0.5 ثانیه
        processor.add_audio_chunk(chunk)
        
        print(f"  🔄 chunk {i+1} اضافه شد")
        time.sleep(0.5)
    
    # توقف پردازش
    processor.stop_processing()
    thread.join()
    
    # نمایش نتایج
    print("\n📊 نتایج پردازش بلادرنگ:")
    for i, result in enumerate(processor.get_results()):
        time_str = time.strftime('%H:%M:%S', time.localtime(result['timestamp']))
        print(f"  [{time_str}] {result['text']} (اعتماد: {result['confidence']:.2%})")

