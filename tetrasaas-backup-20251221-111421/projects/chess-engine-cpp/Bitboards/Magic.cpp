#include "Magic.h"

Bitboard getBishopAttacks(Square sq, Bitboard occupancy) {
	Magic& m = bishopMagics[sq];
	occupancy &= m.mask;           // استفاده از ماسک داخل ساختار
	occupancy *= m.magic;          // اعمال عدد جادویی
	occupancy >>= m.shift;         // شیفت بر اساس تعداد بیت‌های لازم
	return m.attacks[occupancy];   // دسترسی به آرایه حملات
}
// آرایه‌های حملات (مقداردهی اولیه در initMagics())
Bitboard bishopAttackTable[64][512]; // 2^9 = 512 (حداکثر بیت‌ها برای فیل)

void initMagics() {
	// مثال برای مربع a1 (مقادیر واقعی باید از پیش محاسبه شوند!)
	bishopMagics[0] = {
		.magic = 0x123456789ABCDEF0, // عدد جادویی
		.mask = 0x007E7E7E7E7E00,    // ماسک حرکتی
		.attacks = bishopAttackTable[0],
		.shift = 64 - 9             // 9 بیت برای این مربع
	};
	// ...
}