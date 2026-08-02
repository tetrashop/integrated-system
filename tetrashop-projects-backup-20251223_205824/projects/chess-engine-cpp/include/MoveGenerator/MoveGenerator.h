#ifndef CHESSENGINE_MOVEGENERATOR_H
#define CHESSENGINE_MOVEGENERATOR_H

#include "Board.h"
#include <vector>
#include <cstdint>

namespace ChessEngine {

	class MoveGenerator {
	public:
		enum class MoveType { Normal, Capture, EnPassant, Castle, Promotion };
		enum class CastleSide { King, Queen };
		struct Square { int row, col; };

		// تولید تمام حرکات مجاز برای رنگ فعلی
		static std::vector<Move> generateLegalMoves(const Board& board);

		// تولید حرکات مجاز بدون بررسی شاه در معرض خطر (برای بهینه‌سازی)
		static std::vector<Move> generatePseudoLegalMoves(const Board& board);
		static std::vector<Move> GeneratePawnMoves(const ChessBoard& board, int row, int col, bool includeSpecialMoves);
		// تولید حرکات آنپاسان  
		static std::vector<Move> GenerateEnPassantMoves(const ChessBoard& board, int row, int col);

	private:
		// تولید حرکات برای هر نوع مهره
		static void generatePawnMoves(const Board& board, std::vector<Move>& moves, Color color);
		static void generateKnightMoves(const Board& board, std::vector<Move>& moves, Color color);
		static void generateBishopMoves(const Board& board, std::vector<Move>& moves, Color color);
		static void generateRookMoves(const Board& board, std::vector<Move>& moves, Color color);
		static void generateQueenMoves(const Board& board, std::vector<Move>& moves, Color color);
		static void generateKingMoves(const Board& board, std::vector<Move>& moves, Color color);

		// حرکات خاص
		static void generateCastlingMoves(const Board& board, std::vector<Move>& moves, Color color);
		static void generateEnPassantMoves(const Board& board, std::vector<Move>& moves, Color color);
		static void generatePromotions(Move move, std::vector<Move>& moves);

		// محاسبه حمله‌ها به یک مربع خاص
		static Bitboard calculateAttackers(const Board& board, Square sq, Color attackerColor);

		// بررسی حرکت مجاز (عدم قرار دادن شاه در معرض کیش)
		static bool isMoveLegal(const Board& board, const Move& move);
	};

} // namespace ChessEngine

#endif // CHESSENGINE_MOVEGENERATOR_H