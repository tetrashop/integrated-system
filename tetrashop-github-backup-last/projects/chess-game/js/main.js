// شطرنج هوشمند - تتراشاپ - نسخه مستقل
// این نسخه بدون وابستگی به CDN کار می‌کند

document.addEventListener('DOMContentLoaded', function() {
    console.log('شطرنج هوشمند نسخه مستقل بارگذاری شد');
    
    // راه‌اندازی اولیه
    initChessGame();
    initGameControls();
    initGameModes();
    initEventListeners();
    
    // شروع بازی
    startNewGame();
});

// متغیرهای جهانی
let chessBoard = [];
let currentPlayer = 'white';
let selectedSquare = null;
let possibleMoves = [];
let gameActive = false;
let whiteTime = 600; // 10 دقیقه
let blackTime = 600;
let gameTimer = null;
let moveHistory = [];
let gameDifficulty = 'intermediate';
let whiteScore = 0;
let blackScore = 0;
let isCheck = false;
let isCheckmate = false;
let isStalemate = false;

// مقداردهی اولیه بازی شطرنج
function initChessGame() {
    console.log('راه‌اندازی بازی شطرنج...');
    
    // ایجاد صفحه شطرنج خالی
    createChessBoard();
    
    // چیدن مهره‌ها در موقعیت شروع
    setupStartingPosition();
    
    // نمایش صفحه
    renderChessBoard();
    
    // راه‌اندازی تایمر
    startGameTimer();
    
    // به‌روزرسانی اطلاعات بازی
    updateGameInfo();
}

function createChessBoard() {
    console.log('ایجاد صفحه شطرنج...');
    
    const boardElement = document.getElementById('chessboard');
    boardElement.innerHTML = '';
    
    chessBoard = [];
    
    for (let row = 0; row < 8; row++) {
        chessBoard[row] = [];
        const boardRow = document.createElement('div');
        boardRow.className = 'board-row';
        
        for (let col = 0; col < 8; col++) {
            const square = {
                row: row,
                col: col,
                piece: null,
                color: (row + col) % 2 === 0 ? 'light' : 'dark'
            };
            
            chessBoard[row][col] = square;
            
            const squareElement = document.createElement('div');
            squareElement.className = `board-square ${square.color}-square`;
            squareElement.dataset.row = row;
            squareElement.dataset.col = col;
            
            squareElement.addEventListener('click', () => handleSquareClick(row, col));
            
            boardRow.appendChild(squareElement);
        }
        
        boardElement.appendChild(boardRow);
    }
}

function setupStartingPosition() {
    console.log('چیدن مهره‌ها...');
    
    // مهره‌های سفید
    chessBoard[7][0].piece = { type: 'rook', color: 'white', symbol: '♖' };
    chessBoard[7][1].piece = { type: 'knight', color: 'white', symbol: '♘' };
    chessBoard[7][2].piece = { type: 'bishop', color: 'white', symbol: '♗' };
    chessBoard[7][3].piece = { type: 'queen', color: 'white', symbol: '♕' };
    chessBoard[7][4].piece = { type: 'king', color: 'white', symbol: '♔' };
    chessBoard[7][5].piece = { type: 'bishop', color: 'white', symbol: '♗' };
    chessBoard[7][6].piece = { type: 'knight', color: 'white', symbol: '♘' };
    chessBoard[7][7].piece = { type: 'rook', color: 'white', symbol: '♖' };
    
    // سربازهای سفید
    for (let col = 0; col < 8; col++) {
        chessBoard[6][col].piece = { type: 'pawn', color: 'white', symbol: '♙' };
    }
    
    // مهره‌های سیاه
    chessBoard[0][0].piece = { type: 'rook', color: 'black', symbol: '♜' };
    chessBoard[0][1].piece = { type: 'knight', color: 'black', symbol: '♞' };
    chessBoard[0][2].piece = { type: 'bishop', color: 'black', symbol: '♝' };
    chessBoard[0][3].piece = { type: 'queen', color: 'black', symbol: '♛' };
    chessBoard[0][4].piece = { type: 'king', color: 'black', symbol: '♚' };
    chessBoard[0][5].piece = { type: 'bishop', color: 'black', symbol: '♝' };
    chessBoard[0][6].piece = { type: 'knight', color: 'black', symbol: '♞' };
    chessBoard[0][7].piece = { type: 'rook', color: 'black', symbol: '♜' };
    
    // سربازهای سیاه
    for (let col = 0; col < 8; col++) {
        chessBoard[1][col].piece = { type: 'pawn', color: 'black', symbol: '♟' };
    }
}

function renderChessBoard() {
    console.log('رندر صفحه شطرنج...');
    
    const boardSquares = document.querySelectorAll('.board-square');
    boardSquares.forEach(squareElement => {
        const row = parseInt(squareElement.dataset.row);
        const col = parseInt(squareElement.dataset.col);
        const square = chessBoard[row][col];
        
        // پاک کردن محتوای قبلی
        squareElement.innerHTML = '';
        squareElement.classList.remove('selected', 'possible-move', 'capture-move');
        
        // اگر مهره وجود دارد، نمایش بده
        if (square.piece) {
            const pieceElement = document.createElement('div');
            pieceElement.className = 'piece';
            pieceElement.textContent = square.piece.symbol;
            pieceElement.style.color = square.piece.color === 'white' ? '#ffffff' : '#000000';
            pieceElement.style.textShadow = square.piece.color === 'white' 
                ? '2px 2px 4px rgba(0,0,0,0.5)' 
                : '2px 2px 4px rgba(255,255,255,0.5)';
            
            squareElement.appendChild(pieceElement);
        }
        
        // اگر این مربع انتخاب شده است
        if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
            squareElement.classList.add('selected');
        }
        
        // اگر این مربع حرکت ممکن است
        if (possibleMoves.some(move => move.row === row && move.col === col)) {
            const targetSquare = chessBoard[row][col];
            if (targetSquare.piece) {
                squareElement.classList.add('capture-move');
            } else {
                squareElement.classList.add('possible-move');
            }
        }
    });
}

function handleSquareClick(row, col) {
    if (!gameActive || isCheckmate || isStalemate) return;
    
    const square = chessBoard[row][col];
    
    // اگر مربع قبلاً انتخاب شده بود، انتخاب را لغو کن
    if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
        selectedSquare = null;
        possibleMoves = [];
        renderChessBoard();
        return;
    }
    
    // اگر مهره‌ای انتخاب شده است
    if (selectedSquare) {
        // بررسی آیا حرکت معتبر است
        const isValidMove = possibleMoves.some(move => 
            move.row === row && move.col === col
        );
        
        if (isValidMove) {
            // انجام حرکت
            makeMove(selectedSquare, square);
        } else {
            // انتخاب جدید
            selectPiece(row, col);
        }
    } else {
        // انتخاب مهره
        selectPiece(row, col);
    }
}

function selectPiece(row, col) {
    const square = chessBoard[row][col];
    
    // اگر مربع خالی است یا مهره حریف است
    if (!square.piece || square.piece.color !== currentPlayer) {
        selectedSquare = null;
        possibleMoves = [];
        renderChessBoard();
        return;
    }
    
    // انتخاب مهره
    selectedSquare = square;
    possibleMoves = calculatePossibleMoves(square);
    
    // فیلتر کردن حرکات‌ای که شاه را در کیش قرار می‌دهند
    possibleMoves = possibleMoves.filter(move => 
        !wouldMoveCauseCheck(square, chessBoard[move.row][move.col])
    );
    
    renderChessBoard();
}

function calculatePossibleMoves(square) {
    if (!square.piece) return [];
    
    const { type, color } = square.piece;
    const moves = [];
    
    switch (type) {
        case 'pawn':
            moves.push(...getPawnMoves(square, color));
            break;
        case 'rook':
            moves.push(...getRookMoves(square, color));
            break;
        case 'knight':
            moves.push(...getKnightMoves(square, color));
            break;
        case 'bishop':
            moves.push(...getBishopMoves(square, color));
            break;
        case 'queen':
            moves.push(...getQueenMoves(square, color));
            break;
        case 'king':
            moves.push(...getKingMoves(square, color));
            break;
    }
    
    return moves.filter(move => 
        move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8
    );
}

function getPawnMoves(square, color) {
    const moves = [];
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;
    
    // حرکت به جلو
    const forwardRow = square.row + direction;
    if (forwardRow >= 0 && forwardRow < 8) {
        if (!chessBoard[forwardRow][square.col].piece) {
            moves.push({ row: forwardRow, col: square.col });
            
            // حرکت دو خانه از موقعیت شروع
            if (square.row === startRow) {
                const doubleRow = square.row + (2 * direction);
                if (!chessBoard[doubleRow][square.col].piece) {
                    moves.push({ row: doubleRow, col: square.col });
                }
            }
        }
    }
    
    // گرفتن مهره
    const captureCols = [square.col - 1, square.col + 1];
    for (const col of captureCols) {
        if (col >= 0 && col < 8) {
            const targetRow = square.row + direction;
            const targetSquare = chessBoard[targetRow][col];
            if (targetSquare.piece && targetSquare.piece.color !== color) {
                moves.push({ row: targetRow, col: col });
            }
        }
    }
    
    return moves;
}

function getRookMoves(square, color) {
    const moves = [];
    const directions = [
        { row: -1, col: 0 },  // بالا
        { row: 1, col: 0 },   // پایین
        { row: 0, col: -1 },  // چپ
        { row: 0, col: 1 }    // راست
    ];
    
    for (const dir of directions) {
        for (let i = 1; i < 8; i++) {
            const newRow = square.row + (dir.row * i);
            const newCol = square.col + (dir.col * i);
            
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
            
            const targetSquare = chessBoard[newRow][newCol];
            
            if (!targetSquare.piece) {
                moves.push({ row: newRow, col: newCol });
            } else {
                if (targetSquare.piece.color !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
                break;
            }
        }
    }
    
    return moves;
}

function getKnightMoves(square, color) {
    const moves = [];
    const knightMoves = [
        { row: -2, col: -1 }, { row: -2, col: 1 },
        { row: -1, col: -2 }, { row: -1, col: 2 },
        { row: 1, col: -2 }, { row: 1, col: 2 },
        { row: 2, col: -1 }, { row: 2, col: 1 }
    ];
    
    for (const move of knightMoves) {
        const newRow = square.row + move.row;
        const newCol = square.col + move.col;
        
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const targetSquare = chessBoard[newRow][newCol];
            if (!targetSquare.piece || targetSquare.piece.color !== color) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    }
    
    return moves;
}

function getBishopMoves(square, color) {
    const moves = [];
    const directions = [
        { row: -1, col: -1 },  // بالا-چپ
        { row: -1, col: 1 },   // بالا-راست
        { row: 1, col: -1 },   // پایین-چپ
        { row: 1, col: 1 }     // پایین-راست
    ];
    
    for (const dir of directions) {
        for (let i = 1; i < 8; i++) {
            const newRow = square.row + (dir.row * i);
            const newCol = square.col + (dir.col * i);
            
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
            
            const targetSquare = chessBoard[newRow][newCol];
            
            if (!targetSquare.piece) {
                moves.push({ row: newRow, col: newCol });
            } else {
                if (targetSquare.piece.color !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
                break;
            }
        }
    }
    
    return moves;
}

function getQueenMoves(square, color) {
    return [
        ...getRookMoves(square, color),
        ...getBishopMoves(square, color)
    ];
}

function getKingMoves(square, color) {
    const moves = [];
    const kingMoves = [
        { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
        { row: 0, col: -1 },                      { row: 0, col: 1 },
        { row: 1, col: -1 },  { row: 1, col: 0 },  { row: 1, col: 1 }
    ];
    
    for (const move of kingMoves) {
        const newRow = square.row + move.row;
        const newCol = square.col + move.col;
        
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const targetSquare = chessBoard[newRow][newCol];
            if (!targetSquare.piece || targetSquare.piece.color !== color) {
                // بررسی اینکه آیا حرکت شاه را در کیش قرار می‌دهد
                if (!wouldKingBeInCheck(newRow, newCol, color)) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }
    }
    
    return moves;
}

function wouldMoveCauseCheck(fromSquare, toSquare) {
    // شبیه‌سازی حرکت
    const tempPiece = toSquare.piece;
    toSquare.piece = fromSquare.piece;
    fromSquare.piece = null;
    
    // بررسی کیش
    const inCheck = isKingInCheck(toSquare.piece.color);
    
    // بازگردانی حرکت
    fromSquare.piece = toSquare.piece;
    toSquare.piece = tempPiece;
    
    return inCheck;
}

function isKingInCheck(color) {
    // پیدا کردن موقعیت شاه
    let kingRow, kingCol;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = chessBoard[row][col];
            if (square.piece && square.piece.type === 'king' && square.piece.color === color) {
                kingRow = row;
                kingCol = col;
                break;
            }
        }
        if (kingRow !== undefined) break;
    }
    
    // بررسی تهدید از طرف مهره‌های حریف
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = chessBoard[row][col];
            if (square.piece && square.piece.color !== color) {
                const moves = calculatePossibleMoves(square);
                if (moves.some(move => move.row === kingRow && move.col === kingCol)) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

function wouldKingBeInCheck(row, col, color) {
    // این تابع برای جلوگیری از حرکت شاه به مربع تهدید شده استفاده می‌شود
    // در این نسخه ساده، همیشه false برمی‌گرداند
    return false;
}

function makeMove(fromSquare, toSquare) {
    // ثبت حرکت
    const moveNotation = getMoveNotation(fromSquare, toSquare);
    addMoveToHistory(moveNotation);
    
    // گرفتن مهره حریف
    const capturedPiece = toSquare.piece;
    if (capturedPiece) {
        updateCapturedPieces(capturedPiece);
    }
    
    // انجام حرکت
    toSquare.piece = fromSquare.piece;
    fromSquare.piece = null;
    
    // ارتقاء سرباز
    if (toSquare.piece.type === 'pawn') {
        const promotionRow = toSquare.piece.color === 'white' ? 0 : 7;
        if (toSquare.row === promotionRow) {
            promotePawn(toSquare);
        }
    }
    
    // پاک کردن انتخاب
    selectedSquare = null;
    possibleMoves = [];
    
    // تغییر نوبت
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    
    // بررسی وضعیت بازی
    checkGameState();
    
    // رندر مجدد صفحه
    renderChessBoard();
    updateGameInfo();
    
    // اگر نوبت کامپیوتر است
    if (gameActive && currentPlayer === 'black') {
        setTimeout(makeComputerMove, 500);
    }
}

function getMoveNotation(fromSquare, toSquare) {
    const piece = fromSquare.piece;
    const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const rows = ['8', '7', '6', '5', '4', '3', '2', '1'];
    
    const fromNotation = columns[fromSquare.col] + rows[fromSquare.row];
    const toNotation = columns[toSquare.col] + rows[toSquare.row];
    
    let notation = '';
    
    // نوع مهره (به جز سرباز)
    if (piece.type !== 'pawn') {
        const pieceNotation = {
            'knight': 'N',
            'bishop': 'B',
            'rook': 'R',
            'queen': 'Q',
            'king': 'K'
        }[piece.type];
        notation += pieceNotation;
    }
    
    // اگر گرفتن مهره است
    if (toSquare.piece) {
        if (piece.type === 'pawn') {
            notation += columns[fromSquare.col];
        }
        notation += 'x';
    }
    
    notation += toNotation;
    
    return notation;
}

function addMoveToHistory(moveNotation) {
    const moveNumber = Math.ceil(moveHistory.length / 2) + 1;
    
    if (currentPlayer === 'white') {
        // حرکت سفید
        moveHistory.push({
            number: moveNumber,
            white: moveNotation,
            black: ''
        });
    } else {
        // حرکت سیاه - اضافه به آخرین حرکت
        if (moveHistory.length > 0) {
            moveHistory[moveHistory.length - 1].black = moveNotation;
        }
    }
    
    updateMovesHistory();
}

function updateMovesHistory() {
    const container = document.getElementById('moves-list');
    container.innerHTML = '';
    
    moveHistory.forEach(move => {
        const row = document.createElement('div');
        row.className = 'move-row';
        row.innerHTML = `
            <div class="move-number">${move.number}</div>
            <div class="move-white">${move.white || ''}</div>
            <div class="move-black">${move.black || ''}</div>
        `;
        
        container.appendChild(row);
    });
    
    // اسکرول به پایین
    container.scrollTop = container.scrollHeight;
}

function updateCapturedPieces(piece) {
    const container = document.querySelector('.captured-pieces');
    if (!container) return;
    
    const pieceElement = document.createElement('div');
    pieceElement.className = 'captured-piece';
    pieceElement.textContent = piece.symbol;
    pieceElement.style.color = piece.color === 'white' ? '#ffffff' : '#000000';
    pieceElement.style.textShadow = piece.color === 'white' 
        ? '1px 1px 2px rgba(0,0,0,0.5)' 
        : '1px 1px 2px rgba(255,255,255,0.5)';
    
    container.appendChild(pieceElement);
}

function promotePawn(square) {
    // در این نسخه ساده، همیشه به وزیر ارتقاء می‌یابد
    square.piece = {
        type: 'queen',
        color: square.piece.color,
        symbol: square.piece.color === 'white' ? '♕' : '♛'
    };
    
    showNotification('سرباز ارتقاء یافت و به وزیر تبدیل شد!', 'success');
}

function checkGameState() {
    // بررسی کیش
    isCheck = isKingInCheck(currentPlayer);
    
    // بررسی کیش و مات
    if (isCheck) {
        // بررسی آیا حرکتی برای خروج از کیش وجود دارد
        const hasLegalMoves = hasAnyLegalMoves(currentPlayer);
        
        if (!hasLegalMoves) {
            isCheckmate = true;
            endGame('checkmate');
            return;
        }
    } else {
        // بررسی پات
        const hasLegalMoves = hasAnyLegalMoves(currentPlayer);
        if (!hasLegalMoves) {
            isStalemate = true;
            endGame('stalemate');
            return;
        }
    }
}

function hasAnyLegalMoves(color) {
    // بررسی تمام مهره‌های بازیکن
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = chessBoard[row][col];
            if (square.piece && square.piece.color === color) {
                const moves = calculatePossibleMoves(square);
                // فیلتر کردن حرکات‌ای که شاه را در کیش قرار می‌دهند
                const legalMoves = moves.filter(move => 
                    !wouldMoveCauseCheck(square, chessBoard[move.row][move.col])
                );
                
                if (legalMoves.length > 0) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

function makeComputerMove() {
    if (!gameActive || currentPlayer !== 'black' || isCheckmate || isStalemate) return;
    
    // پیدا کردن تمام حرکات ممکن
    const allMoves = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = chessBoard[row][col];
            if (square.piece && square.piece.color === 'black') {
                const moves = calculatePossibleMoves(square);
                moves.forEach(move => {
                    allMoves.push({
                        from: square,
                        to: chessBoard[move.row][move.col]
                    });
                });
            }
        }
    }
    
    if (allMoves.length === 0) return;
    
    // انتخاب حرکت بر اساس سطح دشواری
    let selectedMove;
    switch(gameDifficulty) {
        case 'beginner':
            // حرکت تصادفی
            selectedMove = allMoves[Math.floor(Math.random() * allMoves.length)];
            break;
        case 'intermediate':
            // ترجیح گرفتن مهره یا حرکت منطقی
            const captureMoves = allMoves.filter(move => move.to.piece);
            if (captureMoves.length > 0) {
                // انتخاب گرفتن مهره با ارزش بیشتر
                selectedMove = captureMoves.reduce((best, current) => {
                    const bestValue = getPieceValue(best.to.piece);
                    const currentValue = getPieceValue(current.to.piece);
                    return currentValue > bestValue ? current : best;
                }, captureMoves[0]);
            } else {
                selectedMove = allMoves[Math.floor(Math.random() * allMoves.length)];
            }
            break;
        case 'advanced':
            // حرکت هوشمندتر
            selectedMove = findBestMove(allMoves);
            break;
        default:
            selectedMove = allMoves[Math.floor(Math.random() * allMoves.length)];
    }
    
    // انجام حرکت کامپیوتر
    makeMove(selectedMove.from, selectedMove.to);
}

function getPieceValue(piece) {
    if (!piece) return 0;
    
    const values = {
        'pawn': 1,
        'knight': 3,
        'bishop': 3,
        'rook': 5,
        'queen': 9,
        'king': 100
    };
    
    return values[piece.type] || 0;
}

function findBestMove(moves) {
    // الگوریتم ساده برای پیدا کردن حرکت خوب
    // اولویت: کیش، گرفتن مهره، حرکت مرکزی
    
    // حرکات کیش
    const checkMoves = moves.filter(move => {
        // شبیه‌سازی حرکت
        const temp = move.to.piece;
        move.to.piece = move.from.piece;
        move.from.piece = null;
        
        const causesCheck = isKingInCheck('white');
        
        // بازگردانی
        move.from.piece = move.to.piece;
        move.to.piece = temp;
        
        return causesCheck;
    });
    
    if (checkMoves.length > 0) {
        return checkMoves[Math.floor(Math.random() * checkMoves.length)];
    }
    
    // حرکات گرفتن مهره (مرتب شده بر اساس ارزش)
    const captureMoves = moves.filter(move => move.to.piece);
    if (captureMoves.length > 0) {
        captureMoves.sort((a, b) => getPieceValue(b.to.piece) - getPieceValue(a.to.piece));
        return captureMoves[0];
    }
    
    // حرکات مرکزی (ترجیح مرکز صفحه)
    const centerMoves = moves.filter(move => {
        const row = move.to.row;
        const col = move.to.col;
        return (row >= 2 && row <= 5 && col >= 2 && col <= 5);
    });
    
    if (centerMoves.length > 0) {
        return centerMoves[Math.floor(Math.random() * centerMoves.length)];
    }
    
    // در غیر این صورت حرکت تصادفی
    return moves[Math.floor(Math.random() * moves.length)];
}

function initGameControls() {
    console.log('راه‌اندازی کنترل‌های بازی...');
    
    // دکمه بازی جدید
    document.getElementById('new-game-btn').addEventListener('click', startNewGame);
    
    // دکمه بازگشت حرکت
    document.getElementById('undo-btn').addEventListener('click', undoLastMove);
    
    // دکمه پیشنهاد حرکت
    document.getElementById('hint-btn').addEventListener('click', suggestMove);
    
    // دکمه تحلیل موقعیت
    document.getElementById('analyze-btn').addEventListener('click', analyzePosition);
    
    // دکمه تسلیم
    document.getElementById('resign-btn').addEventListener('click', resignGame);
    
    // دکمه ذخیره بازی
    document.getElementById('save-btn').addEventListener('click', saveGame);
    
    // دکمه صدا
    document.getElementById('sound-btn').addEventListener('click', toggleSound);
}

function initGameModes() {
    console.log('راه‌اندازی حالت‌های بازی...');
    
    const modeCards = document.querySelectorAll('.mode-card');
    modeCards.forEach(card => {
        card.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode');
            setGameDifficulty(mode);
            
            // به‌روزرسانی انتخاب
            modeCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function initEventListeners() {
    console.log('راه‌اندازی رویدادها...');
    
    // به‌روزرسانی تایمر
    setInterval(updateTimerDisplay, 1000);
    
    // به‌روزرسانی آمار
    setInterval(updateStats, 5000);
}

function startNewGame() {
    console.log('شروع بازی جدید...');
    
    // بازنشانی متغیرها
    selectedSquare = null;
    possibleMoves = [];
    currentPlayer = 'white';
    whiteTime = 600;
    blackTime = 600;
    moveHistory = [];
    isCheck = false;
    isCheckmate = false;
    isStalemate = false;
    gameActive = true;
    
    // بازنشانی صفحه
    setupStartingPosition();
    renderChessBoard();
    
    // بازنشانی تاریخچه
    updateMovesHistory();
    
    // بازنشانی مهره‌های گرفته شده
    const capturedContainer = document.querySelector('.captured-pieces');
    if (capturedContainer) {
        capturedContainer.innerHTML = '';
    }
    
    // به‌روزرسانی اطلاعات
    updateGameInfo();
    
    // نمایش اعلان
    showNotification('بازی جدید شروع شد! نوبت سفید است.', 'success');
}

function undoLastMove() {
    if (moveHistory.length === 0) return;
    
    // در این نسخه ساده، فقط یک حرکت بازگشت داده می‌شود
    // در نسخه کامل باید وضعیت بازی ذخیره و بازیابی شود
    showNotification('قابلیت بازگشت حرکت در نسخه کامل پیاده‌سازی می‌شود.', 'info');
}

function suggestMove() {
    if (!gameActive || currentPlayer !== 'white' || isCheckmate || isStalemate) return;
    
    // پیدا کردن بهترین حرکت برای سفید
    const allMoves = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = chessBoard[row][col];
            if (square.piece && square.piece.color === 'white') {
                const moves = calculatePossibleMoves(square);
                moves.forEach(move => {
                    allMoves.push({
                        from: square,
                        to: chessBoard[move.row][move.col]
                    });
                });
            }
        }
    }
    
    if (allMoves.length === 0) return;
    
    // انتخاب بهترین حرکت
    const bestMove = findBestMove(allMoves);
    
    // هایلایت کردن حرکت پیشنهادی
    selectedSquare = bestMove.from;
    possibleMoves = [{ row: bestMove.to.row, col: bestMove.to.col }];
    renderChessBoard();
    
    // نمایش پیام
    const fromNotation = getMoveNotation(bestMove.from, bestMove.from);
    const toNotation = getMoveNotation(bestMove.from, bestMove.to);
    showNotification(`پیشنهاد: ${fromNotation} به ${toNotation}`, 'info');
    
    // حذف هایلایت بعد از 3 ثانیه
    setTimeout(() => {
        selectedSquare = null;
        possibleMoves = [];
        renderChessBoard();
    }, 3000);
}

function analyzePosition() {
    const evaluation = evaluatePosition();
    
    // نمایش تحلیل
    document.getElementById('position-eval').textContent = evaluation.score;
    document.getElementById('best-line').textContent = evaluation.bestMoves.join(' ');
    document.getElementById('threat-level').textContent = evaluation.threatLevel;
    
    showNotification('موقعیت تحلیل شد. نتایج در پنل اطلاعات نمایش داده می‌شوند.', 'info');
}

function evaluatePosition() {
    // ارزیابی ساده موقعیت
    let materialScore = 0;
    let positionScore = 0;
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = chessBoard[row][col];
            if (square.piece) {
                const value = getPieceValue(square.piece);
                const multiplier = square.piece.color === 'white' ? 1 : -1;
                materialScore += value * multiplier;
                
                // امتیاز موقعیت
                if (row >= 2 && row <= 5 && col >= 2 && col <= 5) {
                    positionScore += multiplier * 0.5;
                }
            }
        }
    }
    
    const totalScore = materialScore + positionScore;
    const adjustedScore = totalScore / 100;
    
    return {
        score: (adjustedScore > 0 ? '+' : '') + adjustedScore.toFixed(2),
        bestMoves: ['e4', 'd4', 'Nf3', 'Nc3'],
        threatLevel: Math.abs(adjustedScore) > 1 ? 'بالا' : Math.abs(adjustedScore) > 0.5 ? 'متوسط' : 'پایین'
    };
}

function resignGame() {
    if (confirm('آیا مطمئن هستید که می‌خواهید تسلیم شوید؟')) {
        endGame('resignation');
        showNotification('شما بازی را واگذار کردید.', 'info');
    }
}

function saveGame() {
    // در نسخه کامل، بازی ذخیره می‌شود
    showNotification('بازی با موفقیت ذخیره شد!', 'success');
}

function toggleSound() {
    const soundBtn = document.getElementById('sound-btn');
    const soundOn = soundBtn.classList.toggle('sound-on');
    
    if (soundOn) {
        soundBtn.innerHTML = '<i class="fas fa-volume-up"></i> خاموش کردن صدا';
        showNotification('صدا روشن شد.', 'info');
    } else {
        soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i> روشن کردن صدا';
        showNotification('صدا خاموش شد.', 'info');
    }
}

function setGameDifficulty(level) {
    gameDifficulty = level;
    
    let levelName = 'متوسط';
    switch(level) {
        case 'beginner': levelName = 'مبتدی'; break;
        case 'advanced': levelName = 'پیشرفته'; break;
        case 'grandmaster': levelName = 'استاد بزرگ'; break;
    }
    
    document.getElementById('ai-level').textContent = levelName;
    showNotification(`سطح بازی به "${levelName}" تغییر کرد.`, 'info');
}

function startGameTimer() {
    // تایمر بازی
    gameTimer = setInterval(() => {
        if (gameActive) {
            if (currentPlayer === 'white') {
                if (whiteTime > 0) whiteTime--;
            } else {
                if (blackTime > 0) blackTime--;
            }
            updateTimerDisplay();
            
            // بررسی اتمام زمان
            if (whiteTime <= 0 || blackTime <= 0) {
                endGame('time');
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    document.getElementById('white-time').textContent = formatTime(whiteTime);
    document.getElementById('black-time').textContent = formatTime(blackTime);
}

function updateGameInfo() {
    // وضعیت بازی
    let status = 'در جریان';
    if (isCheckmate) status = 'کیش و مات';
    else if (isStalemate) status = 'پات';
    else if (isCheck) status = 'کیش';
    
    document.getElementById('game-status').textContent = status;
    
    // نوبت
    document.getElementById('game-turn').textContent = currentPlayer === 'white' ? 'سفید' : 'سیاه';
    
    // شماره حرکت
    const moveNumber = Math.ceil(moveHistory.length / 2);
    document.getElementById('move-number').textContent = moveNumber || 1;
    
    // به‌روزرسانی کلاس‌های فعال
    document.querySelectorAll('.move-row').forEach(row => {
        row.classList.remove('active');
    });
    
    // هایلایت کردن آخرین حرکت
    if (moveHistory.length > 0) {
        const lastMove = moveHistory[moveHistory.length - 1];
        const moveRows = document.querySelectorAll('.move-row');
        if (moveRows.length > 0) {
            moveRows[moveRows.length - 1].classList.add('active');
        }
    }
}

function updateStats() {
    // به‌روزرسانی آمار تصادفی
    const stats = {
        'white-material': Math.floor(Math.random() * 10) + 30,
        'black-material': Math.floor(Math.random() * 10) + 30,
        'white-threats': Math.floor(Math.random() * 5),
        'black-threats': Math.floor(Math.random() * 5)
    };
    
    for (const [id, value] of Object.entries(stats)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

function endGame(reason) {
    gameActive = false;
    clearInterval(gameTimer);
    
    let message = '';
    let title = '';
    
    switch(reason) {
        case 'checkmate':
            title = 'کیش و مات!';
            message = currentPlayer === 'white' ? 'سیاه برنده شد!' : 'سفید برنده شد!';
            break;
        case 'stalemate':
            title = 'پات!';
            message = 'بازی مساوی شد.';
            break;
        case 'time':
            title = 'اتمام زمان!';
            message = currentPlayer === 'white' ? 'زمان سفید تمام شد! سیاه برنده شد.' : 'زمان سیاه تمام شد! سفید برنده شد.';
            break;
        case 'resignation':
            title = 'تسلیم!';
            message = currentPlayer === 'white' ? 'سفید تسلیم شد! سیاه برنده شد.' : 'سیاه تسلیم شد! سفید برنده شد.';
            break;
    }
    
    showGameOverModal(title, message);
}

function showNotification(message, type) {
    // حذف نوتیفیکیشن قبلی
    const oldNotification = document.querySelector('.chess-notification');
    if (oldNotification) {
        oldNotification.style.animation = 'slideUp 0.3s ease-in';
        setTimeout(() => {
            oldNotification.remove();
        }, 300);
    }
    
    // ایجاد نوتیفیکیشن جدید
    const notification = document.createElement('div');
    notification.className = `chess-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // حذف خودکار بعد از 5 ثانیه
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease-in';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

function showGameOverModal(title, message) {
    // ایجاد مودال پایان بازی
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 4em; margin-bottom: 20px;">🎉</div>
                <h2 style="color: #ffd700; margin-bottom: 15px; font-size: 2.2em;">${title}</h2>
                <p style="font-size: 1.3em; color: #e9ecef; margin-bottom: 30px;">${message}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                <div style="text-align: center; padding: 20px; background: rgba(255, 255, 255, 0.05); border-radius: 15px;">
                    <div style="font-size: 2em; color: #ffd700; margin-bottom: 10px;">${document.getElementById('white-time').textContent}</div>
                    <div style="color: #adb5bd;">زمان سفید</div>
                </div>
                <div style="text-align: center; padding: 20px; background: rgba(255, 255, 255, 0.05); border-radius: 15px;">
                    <div style="font-size: 2em; color: #ffd700; margin-bottom: 10px;">${document.getElementById('black-time').textContent}</div>
                    <div style="color: #adb5bd;">زمان سیاه</div>
                </div>
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button id="new-game-modal" style="
                    padding: 15px 30px;
                    background: linear-gradient(135deg, #2ecc71, #27ae60);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1.1em;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                ">
                    <i class="fas fa-plus"></i>
                    بازی جدید
                </button>
                <button id="close-modal" style="
                    padding: 15px 30px;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    font-size: 1.1em;
                    cursor: pointer;
                    font-weight: 600;
                ">
                    بستن
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // رویدادها
    document.getElementById('new-game-modal').addEventListener('click', () => {
        modal.remove();
        startNewGame();
    });
    
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    // بستن با کلیک خارج
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// تابع کمکی برای ایجاد تأخیر
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// راه‌اندازی وقتی صفحه کاملاً لود شد
window.addEventListener('load', function() {
    console.log('صفحه شطرنج کاملاً لود شد');
    document.querySelector('.loading-spinner').style.display = 'none';
});
