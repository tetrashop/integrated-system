#pragma once
#include <cstdint>

typedef uint64_t Bitboard;
typedef int Square;

struct Magic {
	uint64_t magic;  // عدد جادویی
	Bitboard mask;   // ماسک حرکتی (مربوط به مربع خاص)
	Bitboard* attacks; // آرایه حملات از پیش محاسبه‌شده
	int shift;       // تعداد بیت‌های مورد نیاز برای شیفت
};

extern Magic bishopMagics[64];
extern Magic rookMagics[64];

void initMagics(); // مقداردهی اولیه