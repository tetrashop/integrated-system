#pragma once
#include <cstdint>

namespace ChessEngine {
	enum class Color { White, Black };
	enum class PieceType { None, Pawn, Knight, Bishop, Rook, Queen, King };

	struct Square {
		int8_t file; // 0-7 (a-h)
		int8_t rank; // 0-7 (1-8)

		Square(int8_t f = -1, int8_t r = -1) : file(f), rank(r) {}
		bool isValid() const { return file >= 0 && file < 8 && rank >= 0 && rank < 8; }
	};
}