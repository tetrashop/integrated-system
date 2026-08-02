// BitboardUtils.cpp
#include "BitboardUtils.hpp"

namespace BitboardUtils {

	uint64_t pawnAttacks(uint64_t pawns, int color) {
		// پیادهسازی حملات پیادهها
	}

	uint64_t knightAttacks(uint64_t knights) {
		// پیادهسازی حملات اسب
	}

} // namespace BitboardUtils
// در BitboardUtils.cpp
uint64_t pawnAttacks(uint64_t pawns, Color color) {
	return (color == White) ?
		((pawns << 7) & ~FileH) | ((pawns << 9) & ~FileA) :
		((pawns >> 7) & ~FileA) | ((pawns >> 9) & ~FileH);
}