from core.simple_engine import SimpleChessEngine
from core.smart_engine import SmartChessEngine
import chess

print('🔍 مقایسه موتور ساده vs هوشمند')
print('=' * 40)

# موقعیت پیچیده‌تر تست کنیم
test_position = "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1"

print("موقعیت تست (پیچیده‌تر):")
board = chess.Board(test_position)
print(board)

print("\n🧪 تست موتور ساده:")
simple_engine = SimpleChessEngine()
simple_engine.board = chess.Board(test_position)
simple_move = simple_engine.get_best_move()
print("حرکت ساده:", simple_move)

print("\n🧠 تست موتور هوشمند:")
smart_engine = SmartChessEngine(depth=2)
smart_engine.board = chess.Board(test_position)
smart_move = smart_engine.get_best_move()
print("حرکت هوشمند:", smart_move)

print("\n✅ مقایسه کامل شد!")
