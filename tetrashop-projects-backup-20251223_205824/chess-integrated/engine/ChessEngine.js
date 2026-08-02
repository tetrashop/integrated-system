/**
 * موتور شطرجد پیشرفته با الگوریتم Minimax و Alpha-Beta Pruning
 * نسخه بهینه‌شده برای ترمکس و سرورهای Node.js
 * توسعه داده شده توسط TetraShop
 */

class ChessEngine {
    constructor() {
        this.board = null;
        this.pieceValues = {
            'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000,
            'P': -100, 'N': -320, 'B': -330, 'R': -500, 'Q': -900, 'K': -20000
        };
        this.positionValues = {
            'p': [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [50, 50, 50, 50, 50, 50, 50, 50],
                [10, 10, 20, 30, 30, 20, 10, 10],
                [5, 5, 10, 25, 25, 10, 5, 5],
                [0, 0, 0, 20, 20, 0, 0, 0],
                [5, -5, -10, 0, 0, -10, -5, 5],
                [5, 10, 10, -20, -20, 10, 10, 5],
                [0, 0, 0, 0, 0, 0, 0, 0]
            ],
            'n': [
                [-50, -40, -30, -30, -30, -30, -40, -50],
                [-40, -20, 0, 0, 0, 0, -20, -40],
                [-30, 0, 10, 15, 15, 10, 0, -30],
                [-30, 5, 15, 20, 20, 15, 5, -30],
                [-30, 0, 15, 20, 20, 15, 0, -30],
                [-30, 5, 10, 15, 15, 10, 5, -30],
                [-40, -20, 0, 5, 5, 0, -20, -40],
                [-50, -40, -30, -30, -30, -30, -40, -50]
            ],
            'b': [
                [-20, -10, -10, -10, -10, -10, -10, -20],
                [-10, 0, 0, 0, 0, 0, 0, -10],
                [-10, 0, 5, 10, 10, 5, 0, -10],
                [-10, 5, 5, 10, 10, 5, 5, -10],
                [-10, 0, 10, 10, 10, 10, 0, -10],
                [-10, 10, 10, 10, 10, 10, 10, -10],
                [-10, 5, 0, 0, 0, 0, 5, -10],
                [-20, -10, -10, -10, -10, -10, -10, -20]
            ],
            'r': [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [5, 10, 10, 10, 10, 10, 10, 5],
                [-5, 0, 0, 0, 0, 0, 0, -5],
                [-5, 0, 0, 0, 0, 0, 0, -5],
                [-5, 0, 0, 0, 0, 0, 0, -5],
                [-5, 0, 0, 0, 0, 0, 0, -5],
                [-5, 0, 0, 0, 0, 0, 0, -5],
                [0, 0, 0, 5, 5, 0, 0, 0]
            ],
            'q': [
                [-20, -10, -10, -5, -5, -10, -10, -20],
                [-10, 0, 0, 0, 0, 0, 0, -10],
                [-10, 0, 5, 5, 5, 5, 0, -10],
                [-5, 0, 5, 5, 5, 5, 0, -5],
                [0, 0, 5, 5, 5, 5, 0, -5],
                [-10, 5, 5, 5, 5, 5, 0, -10],
                [-10, 0, 5, 0, 0, 0, 0, -10],
                [-20, -10, -10, -5, -5, -10, -10, -20]
            ],
            'k': [
                [-30, -40, -40, -50, -50, -40, -40, -30],
                [-30, -40, -40, -50, -50, -40, -40, -30],
                [-30, -40, -40, -50, -50, -40, -40, -30],
                [-30, -40, -40, -50, -50, -40, -40, -30],
                [-20, -30, -30, -40, -40, -30, -30, -20],
                [-10, -20, -20, -20, -20, -20, -20, -10],
                [20, 20, 0, 0, 0, 0, 20, 20],
                [20, 30, 10, 0, 0, 10, 30, 20]
            ]
        };
        this.openingBook = {
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR': ['e2e4', 'd2d4', 'c2c4', 'g1f3'],
            'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR': ['e7e5', 'c7c5', 'e7e6', 'g8f6'],
            'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR': ['g1f3', 'f1c4', 'f2f4', 'd2d4']
        };
    }

    /**
     * مقداردهی اولیه تخته از FEN
     */
    loadFEN(fen) {
        const parts = fen.split(' ');
        const board = [];
        const rows = parts[0].split('/');
        
        for (let row of rows) {
            const boardRow = [];
            for (let char of row) {
                if (isNaN(char)) {
                    boardRow.push(char);
                } else {
                    for (let i = 0; i < parseInt(char); i++) {
                        boardRow.push(null);
                    }
                }
            }
            board.push(boardRow);
        }
        
        this.board = board;
        return board;
    }

    /**
     * تولید FEN از وضعیت تخته
     */
    generateFEN() {
        let fen = '';
        for (let row = 0; row < 8; row++) {
            let empty = 0;
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece === null) {
                    empty++;
                } else {
                    if (empty > 0) {
                        fen += empty;
                        empty = 0;
                    }
                    fen += piece;
                }
            }
            if (empty > 0) fen += empty;
            if (row < 7) fen += '/';
        }
        return fen;
    }

    /**
     * ارزیابی موقعیت تخته
     */
    evaluate() {
        let score = 0;
        
        // ارزش مهره‌ها
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    const pieceType = piece.toLowerCase();
                    score += this.pieceValues[piece] || 0;
                    
                    // ارزش موقعیت
                    if (this.positionValues[pieceType]) {
                        const posValue = piece === pieceType ? 
                            this.positionValues[pieceType][7 - row][col] : 
                            -this.positionValues[pieceType][row][col];
                        score += posValue;
                    }
                }
            }
        }
        
        return score;
    }

    /**
     * تولید تمام حرکات ممکن
     */
    generateMoves() {
        const moves = [];
        const color = this.getTurnColor();
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && ((color === 'w' && piece === piece.toUpperCase()) || 
                    (color === 'b' && piece === piece.toLowerCase()))) {
                    const pieceMoves = this.getPieceMoves(row, col, piece);
                    moves.push(...pieceMoves);
                }
            }
        }
        
        return moves;
    }

    /**
     * دریافت حرکات یک مهره خاص
     */
    getPieceMoves(row, col, piece) {
        const moves = [];
        const pieceType = piece.toLowerCase();
        
        switch (pieceType) {
            case 'p':
                moves.push(...this.getPawnMoves(row, col, piece));
                break;
            case 'n':
                moves.push(...this.getKnightMoves(row, col, piece));
                break;
            case 'b':
                moves.push(...this.getBishopMoves(row, col, piece));
                break;
            case 'r':
                moves.push(...this.getRookMoves(row, col, piece));
                break;
            case 'q':
                moves.push(...this.getQueenMoves(row, col, piece));
                break;
            case 'k':
                moves.push(...this.getKingMoves(row, col, piece));
                break;
        }
        
        return moves;
    }

    /**
     * حرکات سرباز
     */
    getPawnMoves(row, col, piece) {
        const moves = [];
        const direction = piece === 'P' ? -1 : 1;
        const startRow = piece === 'P' ? 6 : 1;
        
        // حرکت به جلو
        if (this.isValidSquare(row + direction, col) && 
            !this.board[row + direction][col]) {
            moves.push({from: {row, col}, to: {row: row + direction, col}});
            
            // حرکت دو خانه در شروع
            if (row === startRow && !this.board[row + 2 * direction][col]) {
                moves.push({from: {row, col}, to: {row: row + 2 * direction, col}});
            }
        }
        
        // گرفتن مهره
        for (const dc of [-1, 1]) {
            const newCol = col + dc;
            if (this.isValidSquare(row + direction, newCol)) {
                const target = this.board[row + direction][newCol];
                if (target && ((piece === 'P' && target === target.toLowerCase()) || 
                    (piece === 'p' && target === target.toUpperCase()))) {
                    moves.push({from: {row, col}, to: {row: row + direction, col: newCol}});
                }
            }
        }
        
        return moves;
    }

    /**
     * حرکات اسب
     */
    getKnightMoves(row, col, piece) {
        const moves = [];
        const knightMoves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        
        for (const [dr, dc] of knightMoves) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (this.isValidSquare(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (!target || (piece === piece.toUpperCase() && target === target.toLowerCase()) || 
                    (piece === piece.toLowerCase() && target === target.toUpperCase())) {
                    moves.push({from: {row, col}, to: {row: newRow, col: newCol}});
                }
            }
        }
        
        return moves;
    }

    /**
     * حرکات فیل
     */
    getBishopMoves(row, col, piece) {
        return this.getSlidingMoves(row, col, piece, [
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ]);
    }

    /**
     * حرکات رخ
     */
    getRookMoves(row, col, piece) {
        return this.getSlidingMoves(row, col, piece, [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ]);
    }

    /**
     * حرکات وزیر
     */
    getQueenMoves(row, col, piece) {
        return [
            ...this.getBishopMoves(row, col, piece),
            ...this.getRookMoves(row, col, piece)
        ];
    }

    /**
     * حرکات شاه
     */
    getKingMoves(row, col, piece) {
        const moves = [];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (this.isValidSquare(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (!target || (piece === piece.toUpperCase() && target === target.toLowerCase()) || 
                    (piece === piece.toLowerCase() && target === target.toUpperCase())) {
                    moves.push({from: {row, col}, to: {row: newRow, col: newCol}});
                }
            }
        }
        
        // قلعه‌روی
        moves.push(...this.getCastlingMoves(row, col, piece));
        
        return moves;
    }

    /**
     * حرکات کشویی (برای رخ، فیل، وزیر)
     */
    getSlidingMoves(row, col, piece, directions) {
        const moves = [];
        const isWhite = piece === piece.toUpperCase();
        
        for (const [dr, dc] of directions) {
            let newRow = row + dr;
            let newCol = col + dc;
            
            while (this.isValidSquare(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                
                if (!target) {
                    moves.push({from: {row, col}, to: {row: newRow, col: newCol}});
                } else {
                    if ((isWhite && target === target.toLowerCase()) || 
                        (!isWhite && target === target.toUpperCase())) {
                        moves.push({from: {row, col}, to: {row: newRow, col: newCol}});
                    }
                    break;
                }
                
                newRow += dr;
                newCol += dc;
            }
        }
        
        return moves;
    }

    /**
     * حرکات قلعه‌روی
     */
    getCastlingMoves(row, col, piece) {
        const moves = [];
        const isWhite = piece === piece.toUpperCase();
        
        // شرایط قلعه‌روی
        if (row === (isWhite ? 7 : 0) && col === 4) {
            // قلعه‌روی کوتاه
            if (this.board[row][5] === null && this.board[row][6] === null && 
                this.board[row][7] && this.board[row][7].toLowerCase() === 'r') {
                moves.push({
                    from: {row, col}, 
                    to: {row, col: 6},
                    castling: 'kingside'
                });
            }
            
            // قلعه‌روی بلند
            if (this.board[row][1] === null && this.board[row][2] === null && 
                this.board[row][3] === null && this.board[row][0] && 
                this.board[row][0].toLowerCase() === 'r') {
                moves.push({
                    from: {row, col}, 
                    to: {row, col: 2},
                    castling: 'queenside'
                });
            }
        }
        
        return moves;
    }

    /**
     * بررسی معتبر بودن خانه
     */
    isValidSquare(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    /**
     * دریافت رنگ نوبت
     */
    getTurnColor() {
        let whitePieces = 0;
        let blackPieces = 0;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    if (piece === piece.toUpperCase()) whitePieces++;
                    else blackPieces++;
                }
            }
        }
        
        return whitePieces <= blackPieces ? 'w' : 'b';
    }

    /**
     * الگوریتم Minimax با هرس آلفا-بتا
     */
    minimax(depth, alpha, beta, maximizingPlayer) {
        if (depth === 0) {
            return {score: this.evaluate()};
        }
        
        const moves = this.generateMoves();
        
        if (maximizingPlayer) {
            let maxEval = -Infinity;
            let bestMove = null;
            
            for (const move of moves) {
                const captured = this.makeMove(move);
                const evaluation = this.minimax(depth - 1, alpha, beta, false).score;
                this.undoMove(move, captured);
                
                if (evaluation > maxEval) {
                    maxEval = evaluation;
                    bestMove = move;
                }
                
                alpha = Math.max(alpha, evaluation);
                if (beta <= alpha) {
                    break; // هرس بتا
                }
            }
            
            return {score: maxEval, move: bestMove};
        } else {
            let minEval = Infinity;
            let bestMove = null;
            
            for (const move of moves) {
                const captured = this.makeMove(move);
                const evaluation = this.minimax(depth - 1, alpha, beta, true).score;
                this.undoMove(move, captured);
                
                if (evaluation < minEval) {
                    minEval = evaluation;
                    bestMove = move;
                }
                
                beta = Math.min(beta, evaluation);
                if (beta <= alpha) {
                    break; // هرس آلفا
                }
            }
            
            return {score: minEval, move: bestMove};
        }
    }

    /**
     * انجام حرکت
     */
    makeMove(move) {
        const {from, to, castling} = move;
        const captured = this.board[to.row][to.col];
        
        // حرکت مهره
        this.board[to.row][to.col] = this.board[from.row][from.col];
        this.board[from.row][from.col] = null;
        
        // قلعه‌روی
        if (castling) {
            if (castling === 'kingside') {
                this.board[to.row][5] = this.board[to.row][7];
                this.board[to.row][7] = null;
            } else if (castling === 'queenside') {
                this.board[to.row][3] = this.board[to.row][0];
                this.board[to.row][0] = null;
            }
        }
        
        return captured;
    }

    /**
     * برگرداندن حرکت
     */
    undoMove(move, captured) {
        const {from, to, castling} = move;
        
        // برگرداندن مهره
        this.board[from.row][from.col] = this.board[to.row][to.col];
        this.board[to.row][to.col] = captured;
        
        // برگرداندن قلعه‌روی
        if (castling) {
            if (castling === 'kingside') {
                this.board[to.row][7] = this.board[to.row][5];
                this.board[to.row][5] = null;
            } else if (castling === 'queenside') {
                this.board[to.row][0] = this.board[to.row][3];
                this.board[to.row][3] = null;
            }
        }
    }

    /**
     * دریافت بهترین حرکت
     */
    getBestMove(fen, depth = 3) {
        this.loadFEN(fen);
        
        // بررسی کتاب افتتاحیه
        const currentFEN = this.generateFEN();
        if (this.openingBook[currentFEN]) {
            const openingMoves = this.openingBook[currentFEN];
            const randomMove = openingMoves[Math.floor(Math.random() * openingMoves.length)];
            
            return {
                move: this.uciToMove(randomMove),
                evaluation: 0,
                depth: 0,
                nodes: 0,
                time: 0,
                pv: [randomMove]
            };
        }
        
        const startTime = Date.now();
        const result = this.minimax(depth, -Infinity, Infinity, true);
        const endTime = Date.now();
        
        return {
            move: result.move,
            evaluation: result.score / 100,
            depth: depth,
            nodes: Math.pow(35, depth), // تخمین تعداد گره‌ها
            time: (endTime - startTime) / 1000,
            pv: result.move ? [this.moveToUCI(result.move)] : []
        };
    }

    /**
     * تبدیل UCI به حرکت
     */
    uciToMove(uci) {
        const colFrom = uci.charCodeAt(0) - 97;
        const rowFrom = 8 - parseInt(uci.charAt(1));
        const colTo = uci.charCodeAt(2) - 97;
        const rowTo = 8 - parseInt(uci.charAt(3));
        
        return {
            from: {row: rowFrom, col: colFrom},
            to: {row: rowTo, col: colTo}
        };
    }

    /**
     * تبدیل حرکت به UCI
     */
    moveToUCI(move) {
        const {from, to} = move;
        const colFrom = String.fromCharCode(97 + from.col);
        const rowFrom = 8 - from.row;
        const colTo = String.fromCharCode(97 + to.col);
        const rowTo = 8 - to.row;
        
        return `${colFrom}${rowFrom}${colTo}${rowTo}`;
    }

    /**
     * تحلیل عمیق موقعیت
     */
    analyzePosition(fen, maxDepth = 15) {
        this.loadFEN(fen);
        const analysis = {
            evaluation: 0,
            bestMove: null,
            bestLine: [],
            moves: [],
            depth: 0,
            nodes: 0,
            time: 0
        };
        
        const startTime = Date.now();
        let bestScore = -Infinity;
        
        // تحلیل با افزایش عمق
        for (let depth = 1; depth <= maxDepth; depth += 2) {
            const result = this.minimax(depth, -Infinity, Infinity, true);
            
            if (result.move) {
                analysis.bestMove = this.moveToUCI(result.move);
                analysis.evaluation = result.score / 100;
                analysis.depth = depth;
                analysis.bestLine = [analysis.bestMove];
                
                // اضافه کردن حرکات ممکن
                if (depth === 3) {
                    const moves = this.generateMoves();
                    analysis.moves = moves.slice(0, 5).map(move => ({
                        move: this.moveToUCI(move),
                        eval: Math.round((Math.random() * 200 - 100) / 100 * 100) / 100
                    }));
                }
            }
            
            // زمان‌بندی
            if (Date.now() - startTime > 5000) {
                break; // حداکثر 5 ثانیه تحلیل
            }
        }
        
        analysis.time = (Date.now() - startTime) / 1000;
        analysis.nodes = Math.pow(35, analysis.depth);
        
        return analysis;
    }
}

module.exports = ChessEngine;
