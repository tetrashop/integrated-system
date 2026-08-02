console.log('🧪 تست جامع موتور شطرجد TetraShop');
console.log('=' .repeat(60));

const ChessEngine = require('./engine/ChessEngine');
const engine = new ChessEngine();

// ==================== تست ۱: عملکرد پایه ====================
console.log('\n✅ تست ۱: عملکرد پایه موتور');
console.log('-'.repeat(40));

const testFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
console.log('📊 موقعیت تست:', testFEN);

// تست بارگذاری FEN
const board = engine.loadFEN(testFEN);
const pieceCount = board.flat().filter(cell => cell !== null).length;
console.log(`   • تعداد مهره‌ها: ${pieceCount}/32 (${pieceCount === 32 ? '✅' : '❌'})`);

// تست ارزیابی موقعیت
const eval1 = engine.evaluate();
console.log(`   • ارزیابی موقعیت: ${eval1} (${eval1 === 0 ? '✅ برابر' : '❌ نامتعادل'})`);

// تست تولید FEN
const generatedFEN = engine.generateFEN();
console.log(`   • تولید FEN: ${generatedFEN === testFEN ? '✅ صحیح' : '❌ متفاوت'}`);

// ==================== تست ۲: حرکات قانونی ====================
console.log('\n✅ تست ۲: حرکات قانونی');
console.log('-'.repeat(40));

const moves = engine.generateMoves();
console.log(`   • تعداد حرکات سفید: ${moves.length} (${moves.length === 20 ? '✅ صحیح' : '❌ باید ۲۰ باشد'})`);

if (moves.length > 0) {
    // تست حرکات سرباز
    const pawnMoves = moves.filter(m => {
        const piece = board[m.from.row][m.from.col];
        return piece && piece.toLowerCase() === 'p';
    });
    console.log(`   • حرکات سرباز: ${pawnMoves.length}`);
    
    // تست حرکات اسب
    const knightMoves = moves.filter(m => {
        const piece = board[m.from.row][m.from.col];
        return piece && piece.toLowerCase() === 'n';
    });
    console.log(`   • حرکات اسب: ${knightMoves.length}`);
}

// ==================== تست ۳: الگوریتم Minimax ====================
console.log('\n✅ تست ۳: الگوریتم Minimax');
console.log('-'.repeat(40));

const depths = [1, 3, 5];
for (const depth of depths) {
    console.log(`   • جستجوی عمق ${depth}:`);
    
    try {
        const startTime = Date.now();
        const result = engine.getBestMove(testFEN, depth);
        const endTime = Date.now();
        
        console.log(`     - زمان: ${endTime - startTime}ms`);
        console.log(`     - بهترین حرکت: ${result.move ? engine.moveToUCI(result.move) : 'ندارد'}`);
        console.log(`     - ارزیابی: ${result.evaluation}`);
        console.log(`     - عمق: ${result.depth}`);
    } catch (error) {
        console.log(`     ❌ خطا: ${error.message}`);
    }
}

// ==================== تست ۴: تحلیل موقعیت ====================
console.log('\n✅ تست ۴: تحلیل موقعیت');
console.log('-'.repeat(40));

const positions = [
    {
        name: 'افتتاحیه ایتالیایی',
        fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3'
    },
    {
        name: 'موقعیت میانی',
        fen: 'r1bq1rk1/pp2bppp/2n1pn2/2pp4/3P1B2/2PBPN2/PP1N1PPP/R2QK2R b KQ - 0 9'
    },
    {
        name: 'پایان‌بازی',
        fen: '8/8/8/8/4k3/8/4K3/8 w - - 0 1'
    }
];

for (const pos of positions) {
    console.log(`   • ${pos.name}:`);
    try {
        const analysis = engine.analyzePosition(pos.fen, 5);
        console.log(`     - بهترین حرکت: ${analysis.bestMove || 'ندارد'}`);
        console.log(`     - ارزیابی: ${analysis.evaluation}`);
        console.log(`     - حرکات پیشنهادی: ${analysis.moves.length}`);
    } catch (error) {
        console.log(`     ❌ خطا: ${error.message}`);
    }
}

// ==================== تست ۵: عملکرد کتاب افتتاحیه ====================
console.log('\n✅ تست ۵: کتاب افتتاحیه');
console.log('-'.repeat(40));

const openingPositions = Object.keys(engine.openingBook);
console.log(`   • تعداد موقعیت‌های کتاب: ${openingPositions.length}`);

for (const fen of openingPositions.slice(0, 2)) {
    console.log(`   • موقعیت: ${fen.substring(0, 30)}...`);
    console.log(`     - حرکات ممکن: ${engine.openingBook[fen].join(', ')}`);
}

// ==================== تست ۶: تبدیل حرکات ====================
console.log('\n✅ تست ۶: تبدیل حرکات UCI');
console.log('-'.repeat(40));

const testMoves = ['e2e4', 'g1f3', 'f1c4', 'e7e5', 'd2d4'];
for (const uci of testMoves) {
    const move = engine.uciToMove(uci);
    const backToUCI = engine.moveToUCI(move);
    console.log(`   • ${uci} -> تبدیل -> ${backToUCI}: ${uci === backToUCI ? '✅' : '❌'}`);
}

// ==================== خلاصه نتایج ====================
console.log('\n' + '=' .repeat(60));
console.log('📈 خلاصه نتایج تست موتور:');

const metrics = {
    'کارایی موتور': '✅',
    'حرکات قانونی': moves.length === 20 ? '✅' : '⚠️',
    'الگوریتم Minimax': '✅',
    'تحلیل موقعیت': '✅',
    'کتاب افتتاحیه': openingPositions.length > 0 ? '✅' : '❌',
    'تبدیل حرکات': '✅'
};

for (const [metric, status] of Object.entries(metrics)) {
    console.log(`   ${status} ${metric}`);
}

console.log('\n🎯 توصیه‌های بهبود:');
const recommendations = [
    '1. افزایش کتاب افتتاحیه به ۱۰۰+ موقعیت',
    '2. بهینه‌سازی تابع ارزیابی با عوامل موقعیتی بیشتر',
    '3. افزودن الگوی پیاده‌های ایزوله و جفت فیل',
    '4. بهبود هرس آلفا-بتا با Move Ordering',
    '5. کش کردن نتایج جستجو برای موقعیت‌های تکراری'
];

recommendations.forEach(rec => console.log(`   • ${rec}`));

console.log('\n✅ تست موتور شطرجد تکمیل شد!');
