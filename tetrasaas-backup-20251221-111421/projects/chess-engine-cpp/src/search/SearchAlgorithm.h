#pragma once  
#include "ChessBoard.h"  
#include "TranspositionTable.h"  

class SearchAlgorithm {
public:
	//  —„Ì„: «›“Êœ‰ Transposition Table  
	SearchAlgorithm(const TranspositionTable& tt);
	Move FindBestMove(const ChessBoard& board, int depth);

private:
	int Minimax(ChessBoard& board, int depth, int alpha, int beta, bool maximizingPlayer);
	TranspositionTable transpositionTable;
};