from core.advanced_engine import AdvancedChessEngine
from core.smart_engine import SmartChessEngine
import time

print('⚡ تست موتور پیشرفته (Alpha-Beta)')
print('=' * 45)

# موقعیت تست
test_position = "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1"

print("موقعیت تست:")
board = AdvancedChessEngine()
board.board = chess.Board(test_position)
board.display()

print("\n⏱️  تست سرعت موتور هوشمند:")
smart_engine = SmartChessEngine(depth=3)
smart_engine.board = chess.Board(test_position)

start_time = time.time()
smart_move = smart_engine.get_best_move()
smart_time = time.time() - start_time

print(f"حرکت: {smart_move} - زمان: {smart_time:.2f} ثانیه")

print("\n🚀 تست سرعت موتور پیشرفته (Alpha-Beta):")
advanced_engine = AdvancedChessEngine(depth=3)
advanced_engine.board = chess.Board(test_position)

start_time = time.time()
advanced_move = advanced_engine.get_best_move()
advanced_time = time.time() - start_time

print(f"حرکت: {advanced_move} - زمان: {advanced_time:.2f} ثانیه")

print(f"\n📊 بهبود سرعت: {smart_time/advanced_time:.1f}x سریع‌تر!")
print("✅ موتور پیشرفته آماده!")
