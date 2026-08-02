console.log('🧪 تست نسخه اصلاح‌شده موتور شطرجد');
console.log('='.repeat(60));

const ChessEngineFixed = require('./engine/ChessEngineFixed');
const engine = new ChessEngineFixed();

// تست‌های حیاتی
const tests = [
    {
        name: 'بارگذاری FEN صحیح',
        test: () => {
            const board = engine.loadFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
            return board.length === 8 && board[0].length === 8;
        }
    },
    {
        name: 'ارزیابی موقعیت شروع',
        test: () => {
            const evalScore = engine.evaluate();
            return Math.abs(evalScore) < 50; // باید تقریباً برابر باشد
        }
    },
    {
        name: 'تولید حرکات سفید',
        test: () => {
            const moves = engine.generateMoves();
            return moves.length >= 15 && moves.length <= 25;
        }
    },
    {
        name: 'تبدیل حرکات UCI',
        test: () => {
            const uci = 'e2e4';
            const move = engine.uciToMove(uci);
            const back = engine.moveToUCI(move);
            return uci === back;
        }
    },
    {
        name: 'تحلیل موقعیت',
        test: () => {
            const analysis = engine.analyzePosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR', 5);
            return analysis.bestMove && analysis.evaluation !== undefined;
        }
    },
    {
        name: 'کتاب افتتاحیه',
        test: () => {
            const bookSize = Object.keys(engine.openingBook).length;
            return bookSize >= 3;
        }
    }
];

let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
    try {
        const result = test.test();
        if (result) {
            console.log(`✅ ${index + 1}. ${test.name}`);
            passed++;
        } else {
            console.log(`❌ ${index + 1}. ${test.name}`);
            failed++;
        }
    } catch (error) {
        console.log(`❌ ${index + 1}. ${test.name} - خطا: ${error.message}`);
        failed++;
    }
});

console.log('\n' + '='.repeat(60));
console.log(`📊 نتایج: ${passed} ✅ موفق / ${failed} ❌ ناموفق`);
console.log(`🎯 کیفیت موتور: ${((passed / tests.length) * 100).toFixed(1)}%`);

if (passed === tests.length) {
    console.log('\n🎉 موتور شطرجد کاملاً سالم است!');
} else {
    console.log('\n⚠️  نیاز به رفع باگ‌های باقی‌مانده دارد.');
}
