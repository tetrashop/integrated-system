from core.advanced_engine import AdvancedChessEngine
from core.smart_engine import SmartChessEngine
import time
import chess

print('⚡ تست سرعت موتورها')
print('=' * 35)

test_position = "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1"

# تست موتور هوشمند
print("🧠 موتور هوشمند (Minimax):")
smart = SmartChessEngine(depth=3)
smart.board = chess.Board(test_position)

start = time.time()
smart_move = smart.get_best_move()
smart_time = time.time() - start

print(f"حرکت: {smart_move} - زمان: {smart_time:.2f} ثانیه")

# تست موتور پیشرفته
print("\n🚀 موتور پیشرفته (Alpha-Beta):")
advanced = AdvancedChessEngine(depth=3)
advanced.board = chess.Board(test_position)

start = time.time()
advanced_move = advanced.get_best_move()
advanced_time = time.time() - start

print(f"حرکت: {advanced_move} - زمان: {advanced_time:.2f} ثانیه")

if smart_time > 0:
    speedup = smart_time / advanced_time
    print(f"\n🎯 بهبود سرعت: {speedup:.1f}x سریع‌تر!")
else:
    print(f"\n🎯 موتور پیشرفته آماده!")

print("✅ تست کامل شد!")
