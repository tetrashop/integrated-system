#pragma once
#include "../Core/Board.h"
namespace ChessEngine {

	class Evaluator {	
	private:
		static constexpr int PieceValues[6] = { 100, 300, 300, 500, 900, 10000 };
		static int evaluateMaterial(const Board& board);
		static int evaluatePawnStructure(const Board& board);
		static int evaluateKingSafety(const Board& board);
	public:
		static int evaluate(const Board& board);

	private:
		// ›«ò Ê—Â«? «—“?«»?
		static int materialScore(const Board& board);
		static int pawnStructureScore(const Board& board);
		static int mobilityScore(const Board& board);
		static int kingSafetyScore(const Board& board);
		static int positionalScore(const Board& board);

		// Ãœ«Ê· «—“‘ „Êﬁ⁄? ?
		static const std::array<std::array<int, 64>, 6> pieceSquareTables;
	};

} // namespace ChessEngine