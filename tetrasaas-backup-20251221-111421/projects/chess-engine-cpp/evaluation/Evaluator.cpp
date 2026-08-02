#include "Evaluator.h"
#include "Bitboard.h"


// ========== ساختار پیاده ==========
int Evaluator::pawnStructureScore(const ChessBoard& board, Color color) {
	int score = 0;
	Bitboard pawns = board.getBitboard(PieceType::Pawn, color);

	// پیاده‌های ایزوله
	Bitboard isolated = pawns & ~shiftEast(pawns | shiftWest(pawns));
	score -= popCount(isolated) * 15;

	// پیاده‌های مضاعف
	for (int file = 0; file < 8; file++) {
		Bitboard fileMask = Bitboard::fileMask(file);
		int count = popCount(pawns & fileMask);
		if (count > 1) score -= (count - 1) * 10;
	}

	return score;
}

// ========== ایمنی شاه ==========
int Evaluator::kingSafetyScore(const ChessBoard& board, Color color) {
	Square kingSq = board.getKingSquare(color);
	Bitboard enemyAttacks = 0;

	// جمع‌آوری حملات حریف
	for (PieceType pt : {Pawn, Knight, Bishop, Rook, Queen}) {
		Bitboard pieces = board.getBitboard(pt, ~color);
		while (pieces) {
			Square sq = bitScanForward(pieces);
			enemyAttacks |= Bitboard::getAttacks(pt, sq, board.getOccupied());
			pieces &= pieces - 1;
		}
	}

	// جریمه برای حملات نزدیک به شاه
	Bitboard kingZone = Bitboard::kingAttacks(kingSq);
	return -popCount(enemyAttacks & kingZone) * 20;
}

// ========== فعالیت مهره‌ها ==========
int Evaluator::pieceActivity(const ChessBoard& board, Color color) {
	int activity = 0;
	Bitboard knights = board.getBitboard(Knight, color);
	while (knights) {
		Square sq = bitScanForward(knights);
		activity += popCount(Bitboard::knightAttacks(sq));
		knights &= knights - 1;
	}
	return activity;
}


int Evaluator::evaluate(const Board& board, Color color) {
	int score = 0;

	// امتیاز مواد
	score += materialScore(board, color);

	// امتیاز موقعیت
	score += positionalScore(board, color);

	// پویایی مهره‌ها
	score += mobilityScore(board, color) * 0.5;

	// ساختار پیاده
	score += pawnStructureScore(board, color);

	// ایمنی شاه
	score += kingSafetyScore(board, color);

	return score;
}

int Evaluator::materialScore(const Board& board, Color color) {
	// محاسبه امتیاز مواد با استفاده از جدول مقادیر
	const std::map<Piece, int> values = {
		{Piece::Pawn, 100}, {Piece::Knight, 300},
		{Piece::Bishop, 300}, {Piece::Rook, 500},
		{Piece::Queen, 900}, {Piece::King, 0}
	};

	int score = 0;
	for (const auto&[piece, val] : values)
		score += popCount(board.getPieces(piece, color)) * val;

	return score;
}
#include "Evaluator.h"

int Evaluator::evaluate(const Board& board) {
	int score = 0;
	score += materialScore(board) * 100;
	score += pawnStructureScore(board) * 30;
	score += mobilityScore(board) * 10;
	score += kingSafetyScore(board) * 50;
	return score;
}

int Evaluator::pawnStructureScore(const Board& board) {
	// محاسبه جریمه پیاده‌های ایزوله و مضاعف
	uint64_t whitePawns = board.pieceBitboards[W_PAWN];
	int score = 0;

	// ایزوله
	score -= popcount(whitePawns & ~BitboardUtils::neighborFiles(whitePawns)) * 15;

	// مضاعف
	for (int file = 0; file < 8; file++) {
		int count = popcount(whitePawns & BitboardUtils::fileMask(file));
		if (count > 1) score -= (count - 1) * 10;
	}

	return score;
}