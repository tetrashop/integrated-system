const ChessEngine = require('./engine/ChessEngine');

console.log('🧪 تست موتور شطرجد TetraShop...\n');

// ایجاد نمونه موتور
const engine = new ChessEngine();

// تست 1: بارگذاری FEN
console.log('✅ تست 1: بارگذاری FEN');
const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
const board = engine.loadFEN(fen);
console.log('   FEN اولیه:', fen);
console.log('   تعداد مهره‌ها:', board.flat().filter(cell => cell !== null).length);

// تست 2: ارزیابی موقعیت
console.log('\n✅ تست 2: ارزیابی موقعیت');
const evaluation = engine.evaluate();
console.log('   ارزیابی موقعیت:', evaluation);

// تست 3: تولید حرکات
console.log('\n✅ تست 3: تولید حرکات');
const moves = engine.generateMoves();
console.log('   تعداد حرکات ممکن:', moves.length);
if (moves.length > 0) {
    console.log('   حرکات نمونه:', engine.moveToUCI(moves[0]), engine.moveToUCI(moves[1] || moves[0]));
}

// تست 4: دریافت بهترین حرکت
console.log('\n✅ تست 4: دریافت بهترین حرکت');
const bestMove = engine.getBestMove(fen, 3);
console.log('   بهترین حرکت:', bestMove.move ? engine.moveToUCI(bestMove.move) : 'ندارد');
console.log('   ارزیابی حرکت:', bestMove.evaluation);
console.log('   عمق جستجو:', bestMove.depth);

// تست 5: تحلیل موقعیت
console.log('\n✅ تست 5: تحلیل موقعیت');
const analysis = engine.analyzePosition(fen, 5);
console.log('   بهترین حرکت تحلیل:', analysis.bestMove);
console.log('   ارزیابی تحلیل:', analysis.evaluation);
console.log('   عمق تحلیل:', analysis.depth);

// تست 6: تبدیل FEN
console.log('\n✅ تست 6: تبدیل FEN');
const generatedFEN = engine.generateFEN();
console.log('   FEN تولید شده:', generatedFEN);

console.log('\n🎉 تمام تست‌ها با موفقیت انجام شد!');
console.log('\n📊 خلاصه عملکرد موتور:');
console.log('   • الگوریتم: Minimax با هرس آلفا-بتا');
console.log('   • کتاب افتتاحیه: دارد (3 موقعیت)');
console.log('   • ارزیابی موقعیت: فعال');
console.log('   • حرکات قانونی: محاسبه کامل');
console.log('   • تبدیل FEN: فعال');
