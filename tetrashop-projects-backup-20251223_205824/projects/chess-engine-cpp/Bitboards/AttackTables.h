#pragma once
#include <cstdint>

typedef uint64_t Bitboard;

// حملات پیش‌محاسبه‌شده برای فیل و قلعه
constexpr int BISHOP_ATTACK_SIZE = 512; // 2^9
constexpr int ROOK_ATTACK_SIZE = 4096; // 2^12

extern Bitboard bishopAttacks[64][BISHOP_ATTACK_SIZE];
extern Bitboard rookAttacks[64][ROOK_ATTACK_SIZE];
void generateBishopAttacks() {
	for (int sq = 0; sq < 64; ++sq) {
		Bitboard mask = bishopMagics[sq].mask;
		int bits = popcount(mask);
		for (int i = 0; i < (1 << bits); ++i) {
			Bitboard occ = indexToOccupancy(i, bits, mask);
			bishopAttacks[sq][(occ * bishopMagics[sq].magic) >> bishopMagics[sq].shift] =
				calculateBishopAttacks(sq, occ);
		}
	}
}
