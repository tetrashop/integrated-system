#include "Magic.h"
#include "AttackTables.h"

// اعداد جادویی استاندارد برای فیل (مثال برای چند مربع)
const uint64_t BISHOP_MAGICS[64] = {
	// مربع a1 (0x89A2B5EDFC6D01E1 از منابع معتبر)
	0x89A2B5EDFC6D01E1, 0x44C6495483C37C0C, // ...
};

// ماسک‌های حرکتی برای فیل (از پیش محاسبه شده)
const Bitboard BISHOP_MASKS[64] = {
	0x007E7E7E7E7E00, 0x007C7E7C7E7C00, // ...
};

// ========== مقداردهی ساختارهای جادویی ==========
void initMagics() {
	for (int sq = 0; sq < 64; ++sq) {
		// مقداردهی فیل
		bishopMagics[sq] = {
			.magic = BISHOP_MAGICS[sq],
			.mask = BISHOP_MASKS[sq],
			.attacks = bishopAttacks[sq],
			.shift = 64 - 9 // 9 بیت برای فیل
		};

		// مقداردهی قلعه (مشابه با مقادیر خاص خود)
		// rookMagics[sq] = { ... };
	}
}
