from core.final_engine import FinalChessEngine
import time

print('🏁 تست موتور نهایی شطرنج')
print('=' * 35)

engine = FinalChessEngine(depth=3)

print("صفحه اولیه:")
engine.display()

print("\n⏱️ تست سرعت...")
start = time.time()
best_move = engine.get_best_move()
thinking_time = time.time() - start

engine.make_move(best_move)

print(f"بهترین حرکت: {best_move}")
print(f"زمان تفکر: {thinking_time:.2f} ثانیه")
print("\nصفحه بعد از حرکت:")
engine.display()

print(f"\n✅ موتور نهایی آماده! - سرعت: {thinking_time:.2f} ثانیه")
