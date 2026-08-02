// در فایل MoveGenerator.hpp
#include "Board.hpp"
#include "BitboardUtils.hpp"
#include <vector>

class MoveGenerator {
public:
	static std::vector<uint16_t> generateLegalMoves(const Board& board);
};