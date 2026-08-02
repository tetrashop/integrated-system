/**
 * موتور شطرجد ساده برای ماژول درآمدزایی
 */

class ChessEngine {
    constructor() {
        this.pieces = {
            'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
            'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
        };
        
        this.openingMoves = [
            'e2e4', 'd2d4', 'g1f3', 'c2c4', 'b1c3', 'f2f4',
            'g2g3', 'b2b3', 'a2a3', 'h2h3'
        ];
        
        this.midgameMoves = [
            'e4e5', 'd4d5', 'f3g5', 'c3d5', 'f1c4', 'f1b5',
            'g1e2', 'd1e2', 'e1g1', 'e1c1'
        ];
    }
    
    getBestMove(fen, difficulty = 'intermediate') {
        const depth = this.getDepthByDifficulty(difficulty);
        
        // برای سادگی، حرکت تصادفی از لیست حرکات
        let possibleMoves = this.openingMoves;
        
        // اگر بازی از مرحله ابتدایی گذشته، حرکات میانه بازی
        if (fen.split(' ')[0].split('/').join('').length < 48) {
            possibleMoves = [...this.openingMoves, ...this.midgameMoves];
        }
        
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        const evaluation = (Math.random() * 2 - 1).toFixed(2);
        
        return {
            uci: randomMove,
            from: this.uciToPosition(randomMove.substring(0, 2)),
            to: this.uciToPosition(randomMove.substring(2, 4)),
            evaluation: evaluation,
            depth: depth,
            pv: [randomMove]
        };
    }
    
    uciToPosition(uci) {
        const col = uci.charCodeAt(0) - 97;
        const row = 8 - parseInt(uci.charAt(1));
        return { row, col };
    }
    
    positionToUCI(position) {
        const col = String.fromCharCode(97 + position.col);
        const row = 8 - position.row;
        return `${col}${row}`;
    }
    
    applyMove(fen, moveUCI) {
        // پیاده‌سازی ساده: فقط FEN اصلی را برمی‌گرداند
        // در واقعیت باید موقعیت را به‌روز کند
        return fen;
    }
    
    analyzePosition(fen, depth) {
        return {
            evaluation: (Math.random() * 2 - 1).toFixed(2),
            bestMove: 'e2e4',
            depth: depth,
            moves: [
                { move: 'e2e4', eval: '+0.3', depth: depth },
                { move: 'd2d4', eval: '+0.2', depth: depth },
                { move: 'g1f3', eval: '+0.1', depth: depth },
                { move: 'c2c4', eval: '0.0', depth: depth },
                { move: 'b1c3', eval: '-0.1', depth: depth }
            ]
        };
    }
    
    getDepthByDifficulty(difficulty) {
        const depths = {
            'beginner': 2,
            'intermediate': 4,
            'advanced': 6,
            'expert': 8
        };
        return depths[difficulty] || 4;
    }
    
    // ارزیابی ساده موقعیت
    evaluatePosition(fen) {
        // شبیه‌سازی ارزیابی
        return (Math.random() * 3 - 1.5).toFixed(2);
    }
}

module.exports = ChessEngine;
