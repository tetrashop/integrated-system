#include "ChessCore.h"
#include <iostream>
#include <sstream>
#include <algorithm>

namespace ChessEngine {

char Piece::getSymbol() const {
    static const char symbols[] = { '.', 'P', 'R', 'N', 'B', 'Q', 'K' };
    char symbol = symbols[static_cast<int>(type_)];
    return color_ == Color::WHITE ? std::toupper(symbol) : std::tolower(symbol);
}

std::vector<Move> Piece::getPossibleMoves(const Position& pos, 
                                         const std::vector<std::vector<Piece>>& board) const {
    std::vector<Move> moves;
    
    // پیاده‌سازی حرکت مهره‌ها بر اساس نوع
    switch (type_) {
        case PieceType::PAWN:
            // حرکت پیاده
            {
                int direction = (color_ == Color::WHITE) ? 1 : -1;
                Position forward(pos.x, pos.y + direction);
                
                // حرکت مستقیم
                if (forward.isValid() && board[forward.x][forward.y].getType() == PieceType::NONE) {
                    moves.push_back(Move(pos, forward));
                    
                    // حرکت دو خانه در شروع
                    if ((color_ == Color::WHITE && pos.y == 1) || 
                        (color_ == Color::BLACK && pos.y == 6)) {
                        Position doubleForward(pos.x, pos.y + 2 * direction);
                        if (doubleForward.isValid() && board[doubleForward.x][doubleForward.y].getType() == PieceType::NONE) {
                            moves.push_back(Move(pos, doubleForward));
                        }
                    }
                }
                
                // حمله مورب
                Position diag1(pos.x - 1, pos.y + direction);
                Position diag2(pos.x + 1, pos.y + direction);
                
                for (const auto& diag : {diag1, diag2}) {
                    if (diag.isValid() && 
                        board[diag.x][diag.y].getType() != PieceType::NONE &&
                        board[diag.x][diag.y].getColor() != color_) {
                        moves.push_back(Move(pos, diag));
                    }
                }
            }
            break;
            
        case PieceType::KNIGHT:
            // حرکت اسب (L-shaped)
            {
                int knightMoves[8][2] = {{2,1}, {2,-1}, {-2,1}, {-2,-1}, 
                                        {1,2}, {1,-2}, {-1,2}, {-1,-2}};
                
                for (int i = 0; i < 8; i++) {
                    Position newPos(pos.x + knightMoves[i][0], pos.y + knightMoves[i][1]);
                    if (newPos.isValid() && 
                        (board[newPos.x][newPos.y].getType() == PieceType::NONE ||
                         board[newPos.x][newPos.y].getColor() != color_)) {
                        moves.push_back(Move(pos, newPos));
                    }
                }
            }
            break;
            
        // پیاده‌سازی سایر مهره‌ها به همین شکل...
    }
    
    return moves;
}

Board::Board() : board_(8, std::vector<Piece>(8)), currentTurn_(Color::WHITE) {
    initialize();
}

void Board::initialize() {
    // مهره‌های سفید
    board_[0][0] = Piece(PieceType::ROOK, Color::WHITE);
    board_[1][0] = Piece(PieceType::KNIGHT, Color::WHITE);
    board_[2][0] = Piece(PieceType::BISHOP, Color::WHITE);
    board_[3][0] = Piece(PieceType::QUEEN, Color::WHITE);
    board_[4][0] = Piece(PieceType::KING, Color::WHITE);
    board_[5][0] = Piece(PieceType::BISHOP, Color::WHITE);
    board_[6][0] = Piece(PieceType::KNIGHT, Color::WHITE);
    board_[7][0] = Piece(PieceType::ROOK, Color::WHITE);
    
    for (int i = 0; i < 8; i++) {
        board_[i][1] = Piece(PieceType::PAWN, Color::WHITE);
    }
    
    // مهره‌های سیاه
    board_[0][7] = Piece(PieceType::ROOK, Color::BLACK);
    board_[1][7] = Piece(PieceType::KNIGHT, Color::BLACK);
    board_[2][7] = Piece(PieceType::BISHOP, Color::BLACK);
    board_[3][7] = Piece(PieceType::QUEEN, Color::BLACK);
    board_[4][7] = Piece(PieceType::KING, Color::BLACK);
    board_[5][7] = Piece(PieceType::BISHOP, Color::BLACK);
    board_[6][7] = Piece(PieceType::KNIGHT, Color::BLACK);
    board_[7][7] = Piece(PieceType::ROOK, Color::BLACK);
    
    for (int i = 0; i < 8; i++) {
        board_[i][6] = Piece(PieceType::PAWN, Color::BLACK);
    }
    
    // خانه‌های خالی
    for (int y = 2; y < 6; y++) {
        for (int x = 0; x < 8; x++) {
            board_[x][y] = Piece(PieceType::NONE, Color::NONE);
        }
    }
}

bool Board::makeMove(const Move& move) {
    if (!isValidMove(move) || wouldCauseCheck(move)) {
        return false;
    }
    
    Piece movingPiece = board_[move.from.x][move.from.y];
    board_[move.to.x][move.to.y] = movingPiece;
    board_[move.from.x][move.from.y] = Piece(PieceType::NONE, Color::NONE);
    
    moveHistory_.push_back(move);
    currentTurn_ = (currentTurn_ == Color::WHITE) ? Color::BLACK : Color::WHITE;
    
    return true;
}

void Board::display() const {
    std::cout << "\n  a b c d e f g h\n";
    for (int y = 7; y >= 0; y--) {
        std::cout << y + 1 << " ";
        for (int x = 0; x < 8; x++) {
            std::cout << board_[x][y].getSymbol() << " ";
        }
        std::cout << y + 1 << "\n";
    }
    std::cout << "  a b c d e f g h\n";
}

// پیاده‌سازی سایر متدها...

Move MinimaxAI::getBestMove(const GameState& state, int depth) {
    // پیاده‌سازی الگوریتم Minimax با Alpha-Beta Pruning
    std::vector<Move> possibleMoves;
    // جمع‌آوری تمام حرکات ممکن
    
    Move bestMove;
    int bestValue = std::numeric_limits<int>::min();
    
    for (const auto& move : possibleMoves) {
        GameState newState = state;
        if (newState.board.makeMove(move)) {
            int moveValue = minimax(newState, depth - 1, 
                                  std::numeric_limits<int>::min(),
                                  std::numeric_limits<int>::max(), 
                                  false);
            
            if (moveValue > bestValue) {
                bestValue = moveValue;
                bestMove = move;
            }
        }
    }
    
    return bestMove;
}

int MinimaxAI::minimax(GameState state, int depth, int alpha, int beta, bool maximizingPlayer) {
    if (depth == 0 || state.board.isCheckmate(state.currentPlayer) || state.board.isStalemate(state.currentPlayer)) {
        return evaluatePosition(state);
    }
    
    if (maximizingPlayer) {
        int maxEval = std::numeric_limits<int>::min();
        std::vector<Move> moves; // جمع‌آوری حرکات
        
        for (const auto& move : moves) {
            GameState newState = state;
            if (newState.board.makeMove(move)) {
                int eval = minimax(newState, depth - 1, alpha, beta, false);
                maxEval = std::max(maxEval, eval);
                alpha = std::max(alpha, eval);
                if (beta <= alpha) break; // Alpha-Beta pruning
            }
        }
        return maxEval;
    } else {
        int minEval = std::numeric_limits<int>::max();
        std::vector<Move> moves; // جمع‌آوری حرکات
        
        for (const auto& move : moves) {
            GameState newState = state;
            if (newState.board.makeMove(move)) {
                int eval = minimax(newState, depth - 1, alpha, beta, true);
                minEval = std::min(minEval, eval);
                beta = std::min(beta, eval);
                if (beta <= alpha) break; // Alpha-Beta pruning
            }
        }
        return minEval;
    }
}

int MinimaxAI::evaluatePosition(const GameState& state) {
    // ارزیابی موقعیت بر اساس ارزش مهره‌ها و موقعیت
    int score = 0;
    
    // ارزش مهره‌ها
    std::unordered_map<PieceType, int> pieceValues = {
        {PieceType::PAWN, 100},
        {PieceType::KNIGHT, 320},
        {PieceType::BISHOP, 330},
        {PieceType::ROOK, 500},
        {PieceType::QUEEN, 900},
        {PieceType::KING, 20000}
    };
    
    // محاسبه امتیاز بر اساس مهره‌ها
    for (int x = 0; x < 8; x++) {
        for (int y = 0; y < 8; y++) {
            Piece piece = state.board.getPiece(Position(x, y));
            if (piece.getType() != PieceType::NONE) {
                int value = pieceValues[piece.getType()];
                score += (piece.getColor() == Color::WHITE) ? value : -value;
            }
        }
    }
    
    return score;
}

} // namespace ChessEngine
