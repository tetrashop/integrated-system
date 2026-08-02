// در فایل BitboardUtils.hpp
#include <cstdint>

namespace BitboardUtils {
	// محاسبه حملات پیادهها
	uint64_t pawnAttacks(uint64_t pawns, int color) {
		if (color == 0) { // سفید
			return (pawns << 7) & 0xFEFEFEFEFEFEFEFE | // حمله به چپ
				(pawns << 9) & 0x7F7F7F7F7F7F7F7F;   // حمله به راست
		}
		else { // سیاه
			return (pawns >> 7) & 0x7F7F7F7F7F7F7F7F | // حمله به راست
				(pawns >> 9) & 0xFEFEFEFEFEFEFEFE;   // حمله به چپ
		}
	}

	// محاسبه حرکات اسب
	uint64_t knightAttacks(uint64_t knights) {
		uint64_t l1 = (knights >> 1) & 0x7F7F7F7F7F7F7F7F;
		uint64_t l2 = (knights >> 2) & 0x3F3F3F3F3F3F3F3F;
		uint64_t r1 = (knights << 1) & 0xFEFEFEFEFEFEFEFE;
		uint64_t r2 = (knights << 2) & 0xFCFCFCFCFCFCFCFC;
		uint64_t h1 = l1 | r1;
		uint64_t h2 = l2 | r2;
		return (h1 << 16) | (h1 >> 16) | (h2 << 8) | (h2 >> 8);
	}
}
// BitboardUtils.hpp
#pragma once
#include <cstdint>

namespace BitboardUtils {

		// محاسبه تعداد مهرهها در یک Bitboard
	inline int countBits(uint64_t bb) {
		return __builtin_popcountll(bb);
	}

	// پیدا کردن ایندکس اولین مهره در Bitboard (LSB)
	inline int getLSB(uint64_t bb) {
		return __builtin_ffsll(bb) - 1;
	}

	// تولید حملات پیادهها بر اساس رنگ
	uint64_t pawnAttacks(uint64_t pawns, int color);

	// تولید حملات اسب
	uint64_t knightAttacks(uint64_t knights);

	// تولید حملات رخ (افقی/عمودی)
	uint64_t rookAttacks(uint64_t rooks, uint64_t occupied);

	// تولید حملات فیل (مورب)
	uint64_t bishopAttacks(uint64_t bishops, uint64_t occupied);

} // namespace BitboardUtils
// در BitboardUtils.cpp
namespace ChessEngine {
	// حذف تعریف تکراری کلاس Bitboards
	constexpr Bitboard knightAttacks[64] = { /*...*/ }; // فقط جداول پیش‌محاسبه شده باقی بمانند
}