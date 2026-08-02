// оя BitboardUtils.cpp
uint64_t pawnAttacks(uint64_t pawns, Color color) {
	return (color == White) ?
		((pawns << 7) & ~FileH) | ((pawns << 9) & ~FileA) :
		((pawns >> 7) & ~FileA) | ((pawns >> 9) & ~FileH);
}