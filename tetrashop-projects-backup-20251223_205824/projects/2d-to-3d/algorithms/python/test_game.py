from core.simple_engine import SimpleChessEngine

print('🎲 بازی شطرنج شروع شد!')
engine = SimpleChessEngine()

print('صفحه اولیه:')
engine.display()

move1 = engine.get_best_move()
engine.make_move(move1)
print('حرکت اول کامپیوتر:', move1)

print('صفحه بعد از حرکت اول:')
engine.display()

print('✅ تست موفقیت‌آمیز بود!')
