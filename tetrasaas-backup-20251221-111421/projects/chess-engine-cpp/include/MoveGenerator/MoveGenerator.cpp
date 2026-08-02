#include "MoveGenerator.h"
#include "Board.h"
#include <algorithm>
#include "Bitboard.h"

namespace ChessEngine {

	using namespace std;

	// ========== تولید حرکات قانونی ==========
	vector<Move> MoveGenerator::generateLegalMoves(const Board& board) {
		vector<Move> moves = generatePseudoLegalMoves(board);

		// فیلتر حرکاتی که شاه را در معرض کیش قرار می‌دهند
		auto it = remove_if(moves.begin(), moves.end(),
			[&board](const Move& move) { return !isMoveLegal(board, move); });

		moves.erase(it, moves.end());
		return moves;
	}

	// ========== تولید حرکات شبه-قانونی ==========
	vector<Move> MoveGenerator::generatePseudoLegalMoves(const Board& board) {
		vector<Move> moves;
		Color color = board.getTurnColor();

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

	// ========== حرکات پیاده ==========
	void MoveGenerator::generatePawnMoves(const Board& board, vector<Move>& moves, Color color) {
		Bitboard pawns = board.getBitboard(PieceType::Pawn, color);
		int forward = (color == White) ? 1 : -1;

		while (pawns) {
			Square sq = bitScanForward(pawns);
			Bitboard attacks = Bitboard::pawnAttacks(sq, color) & board.getEnemyPieces(color);
			Bitboard pushes = Bitboard::pawnPushes(sq, color) & ~board.getOccupied();

			// حرکت به جلو
			while (pushes) {
				Square target = bitScanForward(pushes);
				if (isPromotionRank(target, color)) {
					generatePromotions(Move(sq, target), moves);
				}
				else {
					moves.emplace_back(sq, target);
				}
				pushes &= pushes - 1;
			}

			// حملات
			while (attacks) {
				Square target = bitScanForward(attacks);
				if (isPromotionRank(target, color)) {
					generatePromotions(Move(sq, target, MoveType::Capture), moves);
				}
				else {
					moves.emplace_back(sq, target, MoveType::Capture);
				}
				attacks &= attacks - 1;
			}

			pawns &= pawns - 1;
		}
	}

	// ========== حرکات اسب ==========
	void MoveGenerator::generateKnightMoves(const Board& board, vector<Move>& moves, Color color) {
		Bitboard knights = board.getBitboard(PieceType::Knight, color);

		while (knights) {
			Square sq = bitScanForward(knights);
			Bitboard attacks = Bitboard::knightAttacks(sq) & ~board.getFriendlyPieces(color);

			while (attacks) {
				Square target = bitScanForward(attacks);
				MoveType type = board.isOccupied(target) ? MoveType::Capture : MoveType::Normal;
				moves.emplace_back(sq, target, type);
				attacks &= attacks - 1;
			}

			knights &= knights - 1;
		}
	}

	// ========== حرکات شاه ==========
	void MoveGenerator::generateKingMoves(const Board& board, vector<Move>& moves, Color color) {
		Square kingSq = board.getKingSquare(color);
		Bitboard attacks = Bitboard::kingAttacks(kingSq) & ~board.getFriendlyPieces(color);

		while (attacks) {
			Square target = bitScanForward(attacks);
			MoveType type = board.isOccupied(target) ? MoveType::Capture : MoveType::Normal;
			moves.emplace_back(kingSq, target, type);
			attacks &= attacks - 1;
		}
	}

	// ========== قلعه‌بازی ==========
	void MoveGenerator::generateCastlingMoves(const Board& board, vector<Move>& moves, Color color) {
		if (board.inCheck(color)) return;

		CastleRights rights = board.getCastleRights(color);
		Bitboard occupied = board.getOccupied();

		if (rights & CastleRight::KingSide) {
			Bitboard path = (color == White) ? 0x60ULL : 0x6000000000000000ULL;
			if ((occupied & path) == 0 && !isAttacked(path, ~color))
				moves.emplace_back(kingSq, kingSq + 2, MoveType::Castle);
		}

		if (rights & CastleRight::QueenSide) {
			// بررسی مشابه برای سمت وزیر
		}
	}

	// ========== بررسی قانونی بودن حرکت ==========
	bool MoveGenerator::isMoveLegal(const Board& board, const Move& move) {
		Board temp = board;
		temp.makeMove(move);
		return !temp.inCheck(board.getTurnColor());
	}

	// ========== محاسبه مهاجمان به یک مربع ==========
	Bitboard MoveGenerator::calculateAttackers(const Board& board, Square sq, Color attackerColor) {
		Bitboard attackers = 0;
		attackers |= Bitboard::pawnAttacks(sq, ~attackerColor) & board.getPawns(attackerColor);
		attackers |= Bitboard::knightAttacks(sq) & board.getKnights(attackerColor);
		attackers |= Bitboard::bishopAttacks(sq, board.getOccupied()) & board.getBishopsQueens(attackerColor);
		attackers |= Bitboard::rookAttacks(sq, board.getOccupied()) & board.getRooksQueens(attackerColor);
		attackers |= Bitboard::kingAttacks(sq) & board.getKing(attackerColor);
		return attackers;
	}

	std::vector<Move> MoveGenerator::generateLegalMoves(const Board& board) {
		std::vector<Move> moves = generatePseudoLegalMoves(board);

		// حذف حرکاتی که شاه را در معرض کیش قرار می‌دهند
		moves.erase(std::remove_if(moves.begin(), moves.end(),
			[&](const Move& m) { return !isMoveLegal(board, m); }), moves.end());

		return moves;
	}

	void MoveGenerator::generateCastlingMoves(const Board& board, std::vector<Move>& moves, Color color) {
		// پیاده‌سازی کامل شرایط قلعه
		if (board.isInCheck(color)) return;

		if (color == Color::White && board.castling.whiteKingside)
			if (/* بررسی مسیر آزاد */)
				moves.emplace_back(/* حرکت قلعه سفید سمت شاه */);

		// شرایط مشابه برای سایر حالات
	}

} // namespace ChessEngine
