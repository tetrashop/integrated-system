
#pragma once  
#include <vector>  
#include "Piece.h"  
#include "ChessBoard.h"  
#include "Zobrist.h" // فرضاً پیادهسازی شده  
#include <algorithm>
#include "syzygy/tbprobe.h" // کتابخانه Syzygy

class ChessBoard {
public:
	// ترمیم: افزودن وضعیت آنپاسان و حرکات قلعه  
	ChessBoard();
	void Initialize();
	void ApplyMove(const Move& move);
	bool IsEnPassantPossible(int pawnRow, int pawnCol) const;
	// افزودن Zobrist Hashing برای جدول انتقال  
	uint64_t GetZobristKey() const;

private:
	std::vector<std::vector<Piece>> board;
	bool whiteToMove;
	Square enPassantTarget;
	// وضعیت قلعه (K=King, Q=Queen)  
	bool whiteCastleK, whiteCastleQ, blackCastleK, blackCastleQ;
	uint64_t zobristKey;
};
ChessBoard::ChessBoard() { initializeBoard(); }

ChessBoard::ChessBoard() {
	Initialize();
}

void ChessBoard::ApplyMove(const Move& move) {
	// ترمیم: پردازش آنپاسان  
	if (move.IsEnPassant()) {
		int targetRow = move.GetTarget().row;
		int targetCol = move.GetTarget().col;
		// حذف پیاده حریف  
		board[targetRow + (whiteToMove ? -1 : 1)][targetCol] = Piece::None;
	}
	// ... (بقیه منطق)  
}
void ChessBoard::initializeBoard() {
	// مقداردهی اولیه مهره‌ها
	// ...
}

bool ChessBoard::makeMove(const Move& move) {
	// منطق انجام حرکت
	// ...
	return true;
}

// پیاده‌سازی سایر تواب
// قانون ۵۰ حرکت
bool ChessBoard::is50MoveDraw() const {
	return halfMoveClock >= 100; // 50 حرکت کامل (هر حرکت سیاه و سفید)
}

// تشخیص تکرار سه‌باره
bool ChessBoard::isThreefoldRepetition() const {
	return positionHistory[zobristHash] >= 3;
}

// پس از هر حرکت:
void ChessBoard::makeMove(const Move& move) {
	// ... کد موجود
	updateZobristHash(move);
	positionHistory[zobristHash]++;
	updateMoveClocks(move);
}
void ChessBoard::generateKnightMoves(Position pos, Color color, vector<Position>& moves) const {
	static const int dx[] = { 2, 1, -1, -2, -2, -1, 1, 2 };
	static const int dy[] = { 1, 2, 2, 1, -1, -2, -2, -1 };

	for (int i = 0; i < 8; ++i) {
		Position newPos = { pos.x + dx[i], pos.y + dy[i] };
		if (isValidPosition(newPos) && !isAlly(newPos, color)) {
			moves.push_back(newPos);
		}
	}
}
void ChessBoard::generatePawnMoves(Position pos, Color color, vector<Position>& moves) const {
	int direction = (color == Color::White) ? 1 : -1;
	Position forward = { pos.x, pos.y + direction };

	// حرکت عادی
	if (isValidPosition(forward) && getPiece(forward).type == PieceType::None) {
		moves.push_back(forward);
		// حرکت دو خانه در صورت اولین حرکت
		if ((color == Color::White && pos.y == 1) || (color == Color::Black && pos.y == 6)) {
			Position doubleStep = { pos.x, pos.y + 2 * direction };
			if (getPiece(doubleStep).type == PieceType::None) {
				moves.push_back(doubleStep);
			}
		}
	}

	// حمله مورب
	for (int dx : {-1, 1}) {
		Position attackPos = { pos.x + dx, pos.y + direction };
		if (isValidPosition(attackPos) && isEnemy(attackPos, color)) {
			moves.push_back(attackPos);
		}
	}

	// En Passant (نیاز به ذخیره تاریخچه حرکتها)
}
void ChessBoard::generateBishopMoves(Position pos, Color color, vector<Position>& moves) const {
	const int dx[] = { -1, 1, -1, 1 };
	const int dy[] = { -1, -1, 1, 1 };

	for (int i = 0; i < 4; ++i) {
		for (int step = 1; ; ++step) {
			Position newPos = { pos.x + dx[i] * step, pos.y + dy[i] * step };
			if (!isValidPosition(newPos)) break;
			if (isAlly(newPos, color)) break;

			moves.push_back(newPos);
			if (isEnemy(newPos, color)) break;
		}
	}
}
bool ChessBoard::isMoveLegal(Position from, Position to) const {
	ChessBoard tempBoard = *this;
	tempBoard.makeMove(from, to);
	return !tempBoard.isInCheck(getPiece(from).color);
}
vector<Position> ChessBoard::getPossibleMoves(Position pos) const {
	vector<Position> rawMoves;
	// ... تولید حرکات اولیه

	vector<Position> legalMoves;
	for (auto& move : rawMoves) {
		if (isMoveLegal(pos, move)) {
			legalMoves.push_back(move);
		}
	}
	return legalMoves;
}
void ChessBoard::generateCastlingMoves(Color color, vector<Position>& moves) const {
	if (isInCheck(color)) return;

	int y = (color == Color::White) ? 0 : 7;
	Position kingPos = findKingPosition(color);

	// قلعه کوتاه
	if (canCastleKingside(color)) {
		bool pathClear = true;
		for (int x = 5; x <= 6; ++x) {
			if (getPiece({ x, y }).type != PieceType::None) pathClear = false;
		}
		if (pathClear) moves.push_back({ 6, y });
	}

	// قلعه بلند (پیادهسازی مشابه)
}
struct GameState {
	Position lastPawnDoubleStep; // موقعیت سربازی که دو خانه حرکت کرده
	// ...
};

void ChessBoard::applyEnPassant(Position from, Position to) {
	if (getPiece(from).type == PieceType::Pawn && abs(to.y - from.y) == 2) {
		gameState.lastPawnDoubleStep = to;
	}
	else {
		gameState.lastPawnDoubleStep = { -1, -1 };
	}
}
int ChessBoard::evaluatePosition() const {
	// تابع ارزیابی ساده (فقط ارزش مهرهها)
	int score = 0;
	static const unordered_map<PieceType, int> values = {
		{PieceType::Pawn, 1}, {PieceType::Knight, 3}, {PieceType::Bishop, 3},
		{PieceType::Rook, 5}, {PieceType::Queen, 9}, {PieceType::King, 100}
	};

	for (const auto&[pos, piece] : pieces) {
		int sign = (piece.color == Color::White) ? 1 : -1;
		score += sign * values.at(piece.type);
	}
	return score;
}

int alphaBeta(ChessBoard board, int depth, int alpha, int beta, bool maximizingPlayer) {
	if (depth == 0 || board.isGameOver()) {
		return board.evaluatePosition();
	}

	auto moves = board.getAllMoves(maximizingPlayer ? Color::White : Color::Black);

	if (maximizingPlayer) {
		int maxEval = INT_MIN;
		for (const auto& move : moves) {
			ChessBoard newBoard = board;
			newBoard.makeMove(move.from, move.to);
			int eval = alphaBeta(newBoard, depth - 1, alpha, beta, false);
			maxEval = max(maxEval, eval);
			alpha = max(alpha, eval);
			if (beta <= alpha) break;
		}
		return maxEval;
	}
	else {
		// پیادهسازی مشابه برای مینیمایزر
	}
}
void ChessBoard::generateRookMoves(Position pos, Color color, vector<Position>& moves) const {
	const int dx[] = { -1, 1, 0, 0 };
	const int dy[] = { 0, 0, -1, 1 };

	for (int i = 0; i < 4; ++i) {
		for (int step = 1; ; ++step) {
			Position newPos = { pos.x + dx[i] * step, pos.y + dy[i] * step };
			if (!isValidPosition(newPos)) break;
			if (isAlly(newPos, color)) break;

			moves.push_back(newPos);
			if (isEnemy(newPos, color)) break;
		}
	}
}
void ChessBoard::generateQueenMoves(Position pos, Color color, vector<Position>& moves) const {
	generateRookMoves(pos, color, moves);
	generateBishopMoves(pos, color, moves);
}
int ChessBoard::evaluatePosition() const {
	int score = 0;
	static const unordered_map<PieceType, int> pieceValues = {
		{PieceType::Pawn, 100}, {PieceType::Knight, 300},
		{PieceType::Bishop, 300}, {PieceType::Rook, 500},
		{PieceType::Queen, 900}, {PieceType::King, 10000}
	};

	// ارزش مهرهها
	for (const auto&[pos, piece] : pieces) {
		int sign = (piece.color == Color::White) ? 1 : -1;
		score += sign * pieceValues.at(piece.type);
	}

	// عوامل موقعیتی (مثال: کنترل مرکز)
	static const int centerControl[8][8] = {
		{0, 0, 0, 0, 0, 0, 0, 0},
		{0, 1, 2, 2, 2, 2, 1, 0},
		{0, 2, 4, 4, 4, 4, 2, 0},
		{0, 2, 4, 8, 8, 4, 2, 0},
		{0, 2, 4, 8, 8, 4, 2, 0},
		{0, 2, 4, 4, 4, 4, 2, 0},
		{0, 1, 2, 2, 2, 2, 1, 0},
		{0, 0, 0, 0, 0, 0, 0, 0}
	};

	for (const auto&[pos, piece] : pieces) {
		int sign = (piece.color == Color::White) ? 1 : -1;
		score += sign * centerControl[pos.y][pos.x];
	}

	return score;
}
bool ChessBoard::canCastle(Color color, bool kingside) const {
	int y = (color == Color::White) ? 0 : 7;
	Position kingPos = { 4, y };

	if (getPiece(kingPos).type != PieceType::King || hasMoved(kingPos)) return false;

	int rookX = kingside ? 7 : 0;
	Position rookPos = { rookX, y };
	if (getPiece(rookPos).type != PieceType::Rook || hasMoved(rookPos)) return false;

	// بررسی مسیر خالی
	int start = kingside ? 5 : 1;
	int end = kingside ? 6 : 3;
	for (int x = start; x <= end; ++x) {
		if (getPiece({ x, y }).type != PieceType::None) return false;
	}

	return !isInCheck(color);
}


bool probeSyzygy(const ChessBoard& board, int& result) {
	unsigned int white = 0, black = 0;
	// تبدیل وضعیت تخته به فرمت مورد نیاز Syzygy
	// ... (کد تبدیل وضعیت)

	return tb_probe_wdl(white, black, 0, 0, 0, &result) == TB_RESULT_FAILED ? false : true;
}

void ChessBoard::integrateSyzygy() {
	int result;
	if (probeSyzygy(*this, result)) {
		// استفاده از نتیجه برای تصمیم‌گیری
	}
}
int ChessBoard::evaluatePosition() const {
	// عوامل جدید:
	int kingSafety = calculateKingSafety();
	int pawnStructure = evaluatePawnStructure();
	int mobility = countLegalMoves();

	return materialScore + 0.5 * mobility + 2 * kingSafety + pawnStructure;
}

int ChessBoard::calculateKingSafety() const {
	int safety = 0;
	Position kingPos = findKingPosition(getCurrentTurn());
	// تعداد مهره‌های حمله‌کننده به اطراف شاه
	for (int dx = -1; dx <= 1; ++dx) {
		for (int dy = -1; dy <= 1; ++dy) {
			Position p = { kingPos.x + dx, kingPos.y + dy };
			if (isEnemy(p, getCurrentTurn())) safety -= 10;
		}
	}
	return safety;
}
struct GameState {
	Position enPassantTarget; // موقعیت سربازی که می‌تواند En Passant زده شود
	// ...
};

void ChessBoard::handleEnPassant(Position from, Position to) {
	if (getPiece(from).type == PieceType::Pawn && abs(from.y - to.y) == 2) {
		gameState.enPassantTarget = { (from.x + to.x) / 2, (from.y + to.y) / 2 };
	}
	else {
		gameState.enPassantTarget = { -1, -1 };
	}
}

void ChessBoard::applyEnPassantCapture(Position from, Position to) {
	if (to == gameState.enPassantTarget) {
		Position capturedPawnPos = { to.x, from.y };
		removePiece(capturedPawnPos);
	}
}
void ChessBoard::handlePromotion(Position pos) {
	if (getPiece(pos).type == PieceType::Pawn && (pos.y == 0 || pos.y == 7)) {
		// پیش‌فرض: ارتقا به وزیر (در نسخه پیشرفته می‌توان انتخاب مهره را اضافه کرد)
		promotePiece(pos, PieceType::Queen);
	}
}
int ChessBoard::evaluatePawnStructure(Color color) const {
	int score = 0;
	// پیاده‌های ایزوله (Isolated Pawns)
	vector<int> pawnCounts(8, 0);
	for (int x = 0; x < 8; x++) {
		for (int y = 0; y < 8; y++) {
			if (getPiece({ x, y }) == Piece{ PieceType::Pawn, color }) {
				pawnCounts[x]++;
			}
		}
	}

	for (int x = 0; x < 8; x++) {
		if (pawnCounts[x] > 0) {
			bool isolated = true;
			if (x > 0 && pawnCounts[x - 1] > 0) isolated = false;
			if (x < 7 && pawnCounts[x + 1] > 0) isolated = false;
			if (isolated) score -= 15;
		}
	}

	// پیاده‌های به هم پیوسته (Connected Pawns)
	// ... (پیاده‌سازی مشابه)

	return score;
}
#include "tbprobe.h"

int ChessBoard::syzygyProbe() const {
	TB_PROBE_RESULT result;
	unsigned int w = 0, b = 0;

	// تبدیل وضعیت به فرمت Syzygy
	for (const auto&[pos, piece] : pieces) {
		int sq = 8 * pos.y + pos.x;
		if (piece.color == Color::White) w |= TB_SET(sq, piece.type);
		else b |= TB_SET(sq, piece.type);
	}

	if (tb_probe_root(w, b, 0, 0, &result) == TB_RESULT_CHECKMATE) {
		return result.wdl == TB_WIN ? INT_MAX : INT_MIN;
	}
	return 0; // حالت ناشناخته
}
#include <future>

Move ChessBoard::parallelAlphaBeta(int depth) {
	vector<future<int>> futures;
	vector<Move> moves = getAllMoves(currentTurn);

	for (auto& move : moves) {
		ChessBoard newBoard = *this;
		newBoard.makeMove(move.from, move.to);
		futures.push_back(async(launch::async, [newBoard, depth] {
			return alphaBeta(newBoard, depth - 1, INT_MIN, INT_MAX, false);
		}));
	}

	int maxEval = INT_MIN;
	Move bestMove;
	for (size_t i = 0; i < futures.size(); ++i) {
		int eval = futures[i].get();
		if (eval > maxEval) {
			maxEval = eval;
			bestMove = moves[i];
		}
	}
	return bestMove;
}
void ChessBoard::ApplyMove(const Move& move) {
	// ...
	if (move.IsEnPassant()) {
		// حذف پیاده حریف (ردیف هدف بسته به رنگ بازیکن متفاوت است)
		int capturedPawnRow = move.GetTarget().row + (whiteToMove ? -1 : 1);
		board[capturedPawnRow][move.GetTarget().col] = Piece::None;
	}
	// ...
}
bool ChessBoard::isMoveLegal(Position from, Position to) const {
	ChessBoard tempBoard = *this;
	tempBoard.makeMove(from, to);
	return !tempBoard.isInCheck(getPiece(from).color);
}
void ChessBoard::applyEnPassant(Position from, Position to) {
	if (getPiece(from).type == PieceType::Pawn && abs(from.y - to.y) == 2) {
		gameState.enPassantTarget = { to.x, (from.y + to.y) / 2 };
	}
	else {
		gameState.enPassantTarget = { -1, -1 };
	}
}