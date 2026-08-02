// در LookupTables.h
constexpr uint64_t precomputedKnightAttacks[64] = {
	0x0000000000020400, 0x0000000000050800, // ...
};

// LookupTables.h
#pragma once
#include "Types.h" // تعریف Square و غیره

namespace ChessEngine {
	// حملات اسب برای هر خانه (64 عنصر)
	constexpr uint64_t precomputedKnightAttacks[64] = {
		0x0000000000020400, 0x0000000000050800, // ...
	};

	// حملات شاه
	constexpr uint64_t precomputedKingAttacks[64] = { /*...*/ };

	// الگوهای حرکت پیاده (برای هر رنگ)
	constexpr uint64_t precomputedPawnPushes[2][64] = { /*...*/ };
}