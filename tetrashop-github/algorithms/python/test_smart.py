from core.smart_engine import SmartChessEngine

print('🧠 موتور هوشمند شطرنج فعال شد!')
engine = SmartChessEngine(depth=2)

print('صفحه اولیه:')
engine.display()

print('\\n🤔 در حال محاسبه بهترین حرکت...')
best_move = engine.get_best_move()
engine.make_move(best_move)

print('بهترین حرکت:', best_move)
print('صفحه بعد از حرکت:')
engine.display()

print('\\n✅ هوش مصنوعی ارتقا یافت!')
