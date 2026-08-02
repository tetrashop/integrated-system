#ifndef CHESSCORE_H
#define CHESSCORE_H

#include <string>
#include <vector>
#include <memory>
#include <unordered_map>

namespace ChessEngine {

enum class PieceType {
    NONE = 0,
    PAWN,
    ROOK,
    KNIGHT,
    BISHOP,
    QUEEN,
    KING
};

enum class Color {
    NONE = 0,
    WHITE,
    BLACK
};

struct Position {
    int x; // 0-7
    int y; // 0-7
    
    Position(int x = -1, int y = -1) : x(x), y(y) {}
    bool isValid() const { return x >= 0 && x < 8 && y >= 0 && y < 8; }
    bool operator==(const Position& other) const { return x == other.x && y == other.y; }
};

struct Move {
    Position from;
    Position to;
    PieceType promotion;
    
    Move(Position f = Position(), Position t = Position(), PieceType p = PieceType::NONE) 
        : from(f), to(t), promotion(p) {}
    
    bool isValid() const { return from.isValid() && to.isValid(); }
};

class Piece {
public:
    Piece(PieceType type = PieceType::NONE, Color color = Color::NONE) 
        : type_(type), color_(color) {}
    
    virtual ~Piece() = default;
    
    PieceType getType() const { return type_; }
    Color getColor() const { return color_; }
    char getSymbol() const;
    
    virtual std::vector<Move> getPossibleMoves(const Position& pos, 
                                              const std::vector<std::vector<Piece>>& board) const;

protected:
    PieceType type_;
    Color color_;
};

class Board {
public:
    Board();
    void initialize();
    bool makeMove(const Move& move);
    bool isCheck(Color color) const;
    bool isCheckmate(Color color) const;
    bool isStalemate(Color color) const;
    Piece getPiece(const Position& pos) const;
    void setPiece(const Position& pos, const Piece& piece);
    
    std::string getFEN() const;
    void loadFEN(const std::string& fen);
    
    void display() const;

private:
    std::vector<std::vector<Piece>> board_;
    Color currentTurn_;
    std::vector<Move> moveHistory_;
    
    bool isValidMove(const Move& move) const;
    bool wouldCauseCheck(const Move& move) const;
};

class GameState {
public:
    Board board;
    Color currentPlayer;
    int moveCount;
    std::string history;
    
    GameState() : currentPlayer(Color::WHITE), moveCount(0) {}
    
    std::string serialize() const;
    void deserialize(const std::string& data);
};

class ChessAI {
public:
    virtual Move getBestMove(const GameState& state, int depth) = 0;
    virtual int evaluatePosition(const GameState& state) = 0;
    virtual ~ChessAI() = default;
};

class MinimaxAI : public ChessAI {
public:
    Move getBestMove(const GameState& state, int depth) override;
    int evaluatePosition(const GameState& state) override;

private:
    int minimax(GameState state, int depth, int alpha, int beta, bool maximizingPlayer);
    int pieceValue(PieceType type);
};

} // namespace ChessEngine

#endif
