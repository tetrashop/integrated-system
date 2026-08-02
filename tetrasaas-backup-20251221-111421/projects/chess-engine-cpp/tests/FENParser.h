#pragma once  
#include "ChessBoard.h"  

class FENParser {
public:
	static ChessBoard Parse(const std::string& fen);
};