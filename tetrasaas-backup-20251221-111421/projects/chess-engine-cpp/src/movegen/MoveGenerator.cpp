#include "MoveGenerator.h"
// در MoveGenerator.cpp
#include "../utils/LookupTables.h"

#include "Board.h"
#include <bitset>
#include <algorithm>

namespace ChessEngine {

	// جدول از پیش محاسبه‌شده برای حرکت اسب
	constexpr Bitboard knightAttacks[64] = { /* ... */ };

	// جدول از پیش محاسبه‌شده برای حرکت شاه
	constexpr Bitboard kingAttacks[64] = { /* ... */ };

	// در MoveGenerator.cpp
	uint64_t knightAttacks = precomputedKnightAttacks[square];


	std::vector<Move> MoveGenerator::generateLegalMoves(const Board& board) {
		std::vector<Move> moves = generatePseudoLegalMoves(board);

		// حذف حرکاتی که شاه را در معرض کیش قرار می‌دهند
		auto it = std::remove_if(moves.begin(), moves.end(),
			[&](const Move& move) { return !isMoveLegal(board, move); });
		moves.erase(it, moves.end());

		return moves;
	}

	std::vector<Move> MoveGenerator::generatePseudoLegalMoves(const Board& board) {
		std::vector<Move> moves;
		Color color = board.getTurn();

		generatePawnMoves(board, moves, color);
		generateKnightMoves(board, moves, color);
		generateBishopMoves(board, moves, color);
		generateRookMoves(board, moves, color);
		generateQueenMoves(board, moves, color);
		generateKingMoves(board, moves, color);

		generateCastlingMoves(board, moves, color);
		generateEnPassantMoves(board, moves, color);

		return moves;
	}

	// ##### تولید حرکات پیاده #####
	void MoveGenerator::generatePawnMoves(const Board& board, std::vector<Move>& moves, Color color) {
		Bitboard pawns = board.getPieces(PieceType::Pawn, color);
		Bitboard enemies = board.getColorPieces(~color);
		Bitboard empty = ~board.getAllPieces();
		int pushDir = (color == Color::White) ? 8 : -8;

		while (pawns) {
			Square sq = popLsb(pawns);
			Square forward = sq + pushDir;

			// حرکت به جلو
			if (board.getPiece(forward) == Piece::None) {
				addPawnMove(moves, sq, forward, color, board);

				// حرکت دوگانه (فقط در ردیف شروع)
				if ((color == Color::White && rankOf(sq) == 1) ||
					(color == Color::Black && rankOf(sq) == 6)) {
					Square doublePush = forward + pushDir;
					if (board.getPiece(doublePush) == Piece::None) {
						moves.emplace_back(sq, doublePush, Piece::None, MoveType::DoublePawnPush);
					}
				}
			}

			// حملات
			Bitboard attacks = board.getPawnAttacks(sq, color) & enemies;
			while (attacks) {
				Square target = popLsb(attacks);
				addPawnMove(moves, sq, target, color, board);
			}
		}
	}

	// ##### تولید حرکات اسب #####
	void MoveGenerator::generateKnightMoves(const Board& board, std::vector<Move>& moves, Color color) {
		Bitboard knights = board.getPieces(PieceType::Knight, color);
		Bitboard targets = ~board.getColorPieces(color); // فقط خانه‌های خالی یا حریف

		while (knights) {
			Square sq = popLsb(knights);
			Bitboard attacks = knightAttacks[sq] & targets;
			addMoves(moves, sq, attacks, board);
		}
	}

#include <vector>
#include "ChessBoard.h"
#include "Move.h"

	class MoveGenerator {
	public:
		
		
		static void generateBishopMoves(const ChessBoard& board, int row, int col, std::vector<Move>& moves) {
			// جهت‌های حرکت فیل (۴ جهت قطری)
			const int directions[4][2] = { {1,1}, {1,-1}, {-1,1}, {-1,-1} };

			for (auto& dir : directions) {
				for (int step = 1; step < 8; step++) {
					int newRow = row + dir[0] * step;
					int newCol = col + dir[1] * step;

					if (!board.isValidSquare(newRow, newCol)) break;

					Piece targetPiece = board.getPiece(newRow, newCol);
					if (targetPiece == Piece::None) {
						moves.emplace_back(row, col, newRow, newCol);
					}
					else {
						if (board.isEnemy(newRow, newCol))
							moves.emplace_back(row, col, newRow, newCol, MoveType::Capture);
						break;
					}
				}
			}
		}

		static void generateRookMoves(const ChessBoard& board, int row, int col, std::vector<Move>& moves) {
			// جهت‌های حرکت رخ (۴ جهت مستقیم)
			const int directions[4][2] = { {1,0}, {-1,0}, {0,1}, {0,-1} };

			for (auto& dir : directions) {
				for (int step = 1; step < 8; step++) {
					int newRow = row + dir[0] * step;
					int newCol = col + dir[1] * step;

					if (!board.isValidSquare(newRow, newCol)) break;

					Piece targetPiece = board.getPiece(newRow, newCol);
					if (targetPiece == Piece::None) {
						moves.emplace_back(row, col, newRow, newCol);
					}
					else {
						if (board.isEnemy(newRow, newCol))
							moves.emplace_back(row, col, newRow, newCol, MoveType::Capture);
						break;
					}
				}
			}
		}

		static void generateQueenMoves(const ChessBoard& board, int row, int col, std::vector<Move>& moves) {
			// ترکیب حرکات فیل و رخ
			generateBishopMoves(board, row, col, moves);
			generateRookMoves(board, row, col, moves);
		}

		static void generateKingMoves(const ChessBoard& board, int row, int col, std::vector<Move>& moves) {
			// حرکات عادی شاه (۸ جهت)
			const int directions[8][2] = { {1,0}, {-1,0}, {0,1}, {0,-1}, {1,1}, {1,-1}, {-1,1}, {-1,-1} };

			for (auto& dir : directions) {
				int newRow = row + dir[0];
				int newCol = col + dir[1];

				if (board.isValidSquare(newRow, newCol)) {
					if (board.isEmpty(newRow, newCol)) {
						moves.emplace_back(row, col, newRow, newCol);
					}
					else if (board.isEnemy(newRow, newCol)) {
						moves.emplace_back(row, col, newRow, newCol, MoveType::Capture);
					}
				}
			}

			// حرکات قلعه
			generateCastlingMoves(board, row, col, moves);
		}

		static void generateCastlingMoves(const ChessBoard& board, int row, int col, std::vector<Move>& moves) {
			if (!board.canCastle(board.getTurnColor())) return;

			const bool isWhite = board.isWhiteTurn();
			const int backRank = isWhite ? 0 : 7;

			// قلعه کوتاه (Kingside)
			if (board.hasCastleRight(isWhite, CastleSide::King) &&
				board.isEmpty(backRank, 5) &&
				board.isEmpty(backRank, 6) &&
				!board.isSquareAttacked(backRank, 4) &&
				!board.isSquareAttacked(backRank, 5))
			{
				moves.emplace_back(MoveType::Castle, Square{ row,col }, Square{ backRank,6 });
			}

			// قلعه بلند (Queenside)
			if (board.hasCastleRight(isWhite, CastleSide::Queen) &&
				board.isEmpty(backRank, 3) &&
				board.isEmpty(backRank, 2) &&
				board.isEmpty(backRank, 1) &&
				!board.isSquareAttacked(backRank, 4) &&
				!board.isSquareAttacked(backRank, 3))
			{
				moves.emplace_back(MoveType::Castle, Square{ row,col }, Square{ backRank,2 });
			}
		}

		static void generateEnPassantMoves(const ChessBoard& board, int row, int col, std::vector<Move>& moves) {
			Square epSquare = board.getEnPassantTarget();
			if (epSquare == Square::Invalid) return;

			const int direction = board.isWhiteTurn() ? 1 : -1;
			const int epRow = epSquare.row;
			const int epCol = epSquare.col;

			// بررسی پیاده‌های قابل انجام En Passant
			if (row + direction == epRow && (col == epCol + 1 || col == epCol - 1)) {
				moves.emplace_back(MoveType::EnPassant, Square{ row,col }, epSquare);
			}
		}
	};

	// ##### بررسی قانونی بودن حرکت #####
	bool MoveGenerator::isMoveLegal(const Board& board, const Move& move) {
		Board tempBoard = board;
		tempBoard.makeMove(move);
		return !tempBoard.isKingInCheck(board.getTurn());
	}

	// ##### توابع کمکی #####
	void MoveGenerator::addMoves(std::vector<Move>& moves, Square from, Bitboard targets, const Board& board) {
		while (targets) {
			Square to = popLsb(targets);
			Piece captured = board.getPiece(to);
			moves.emplace_back(from, to, captured);
		}
	}

	void MoveGenerator::addPawnMove(...) {
		// بررسی ارتقا
		if ((color == Color::White && rankOf(to) == 7) ||
			(color == Color::Black && rankOf(to) == 0)) {
			generatePromotions(move, moves);
		}
		else {
			moves.emplace_back(...);
		}
	}

	void MoveGenerator::generatePromotions(...) {
		moves.emplace_back(..., Piece::Queen);
		moves.emplace_back(..., Piece::Rook);
		moves.emplace_back(..., Piece::Bishop);
		moves.emplace_back(..., Piece::Knight);
	}

} // namespace ChessEngine
// در فایل MoveGenerator.cpp
#include "MoveGenerator.hpp"

std::vector<uint16_t> MoveGenerator::generateLegalMoves(const Board& board) {
	std::vector<uint16_t> moves;
	uint64_t allies = board.turn == 0 ?
		(board.pawns[0] | board.knights[0] | board.bishops[0] |
			board.rooks[0] | board.queens[0] | board.kings[0]) :
			(board.pawns[1] | board.knights[1] | board.bishops[1] |
				board.rooks[1] | board.queens[1] | board.kings[1]);

	uint64_t enemies = board.turn == 0 ?
		(board.pawns[1] | board.knights[1] | board.bishops[1] |
			board.rooks[1] | board.queens[1] | board.kings[1]) :
			(board.pawns[0] | board.knights[0] | board.bishops[0] |
				board.rooks[0] | board.queens[0] | board.kings[0]);

	// تولید حرکات پیادهها
	uint64_t pawns = board.turn == 0 ? board.pawns[0] : board.pawns[1];
	uint64_t pawnMoves = pawnAttacks(pawns, board.turn) & enemies; // حملات
	// افزودن حرکات به لیست...

	// تولید حرکات اسبها
	uint64_t knights = board.turn == 0 ? board.knights[0] : board.knights[1];
	uint64_t knightMoves = knightAttacks(knights) & ~allies;
	// افزودن حرکات به لیست...

	return moves;
}
// MoveGenerator.cpp
#include "../include/Bitboard/Bitboard.hpp"
#include "../Utils/BitboardUtils.hpp"

void MoveGenerator::generatePawnMoves() {
	uint64_t attacks = BitboardUtils::pawnAttacks(pawns, color);
	// ...
}
// در MoveGenerator.cpp
void generateCastlingMoves(...) {
	if (canCastleKingside) {
		// بررسی مسیر ۵ و ۶ برای سفید، ۶۳ و ۶۲ برای سیاه
		if (!isAttacked(castlePath)) addCastleMove(...);
	}
}


std::vector<Move> MoveGenerator::GenerateEnPassantMoves(const ChessBoard& board, int row, int col) {
	std::vector<Move> moves;
	if (board.IsEnPassantPossible(row, col)) {
		// ترمیم: افزودن حرکت آنپاسان معتبر  
		Square target = { row + (board.IsWhiteToMove() ? 1 : -1), col };
		moves.emplace_back(MoveType::EnPassant, Square{ row, col }, target);
	}
	return moves;
}
uint64_t MoveGenerator::generateKnightAttacks(Square sq) {
	return precomputedKnightAttacks[sq]; // استفاده از جدول پیش‌محاسبه شده
}
#include "MoveGenerator.h"
#include "../Core/BitboardUtils.h"

using namespace ChessEngine;

void MoveGenerator::generatePawnMoves(Board& board, std::vector<Move>& moves) {
	const Color color = board.turn;
	const uint64_t pawns = board.pieceBitboards[color == White ? W_PAWN : B_PAWN];

	// محاسبه حرکات پیشرو و حملات
	uint64_t pushes = BitboardUtils::pawnPushes(pawns, color) & board.empty;
	uint64_t attacks = BitboardUtils::pawnAttacks(pawns, color) & board.occupiedColors[~color];

	while (pushes) {
		Square to = popLsb(pushes);
		Square from = to - (color == White ? 8 : -8);
		addMove(from, to, Normal, moves);
	}

	// ... (پیاده‌سازی کامل حملات، آنپاسان و ارتقاء)
}

void MoveGenerator::generateCastlingMoves(Board& board, std::vector<Move>& moves) {
	if (board.isInCheck(board.turn)) return;

	const uint64_t castleMask = MagicBitboards::getCastleMask(board);
	while (castleMask) {
		Square kingTo = popLsb(castleMask);
		// بررسی مسیر امن
		if (!board.isCastlePathAttacked(kingTo)) {
			moves.emplace_back(...);
		}
	}
}