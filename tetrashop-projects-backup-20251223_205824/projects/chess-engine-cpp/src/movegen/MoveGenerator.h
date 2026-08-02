#pragma once
#include "../Core/Board.h"
#include "MagicBitboards.h"

namespace ChessEngine {

	class MoveGenerator {
	public:
		static std::vector<Move> generateLegalMoves(Board& board);

	private:
		static void generatePawnMoves(Board& board, std::vector<Move>& moves);
		static void generateKnightMoves(Board& board, std::vector<Move>& moves);
		static void generateBishopMoves(Board& board, std::vector<Move>& moves);
		static void generateRookMoves(Board& board, std::vector<Move>& moves);
		static void generateQueenMoves(Board& board, std::vector<Move>& moves);
		static void generateKingMoves(Board& board, std::vector<Move>& moves);
		static void generateCastlingMoves(Board& board, std::vector<Move>& moves);
	public:
		static std::vector<Move> generateLegalMoves(Board& board);
		static std::vector<Move> generatePseudoLegalMoves(Board& board);

	private:
		// توابع تولید حرکت برای هر مهره
		static void generatePawnMoves(Board& board, std::vector<Move>& moves);
		static void generateKnightMoves(Board& board, std::vector<Move>& moves);
		static void generateBishopMoves(Board& board, std::vector<Move>& moves);
		static void generateRookMoves(Board& board, std::vector<Move>& moves);
		static void generateQueenMoves(Board& board, std::vector<Move>& moves);
		static void generateKingMoves(Board& board, std::vector<Move>& moves);

		// توابع حرکت‌های خاص
		static void generateCastlingMoves(Board& board, std::vector<Move>& moves);
		static void generateEnPassantMoves(Board& board, std::vector<Move>& moves);
		static void generatePromotions(Move& move, std::vector<Move>& moves);

		// توابع کمکی
		static void addMove(Square from, Square to, MoveType type, std::vector<Move>& moves);
		static uint64_t getAttackMask(Color color, Square sq);
	};

} // namespace ChessEngine