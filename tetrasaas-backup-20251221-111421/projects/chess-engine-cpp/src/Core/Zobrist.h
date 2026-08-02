#pragma once
#include <cstdint>
// در Zobrist.h
#include <random>
// در Zobrist.h
namespace ChessEngine {
	e
}
namespace ChessEngine {
class Zobrist {
public:
	    void initZobrist() {
		std::mt19937_64 rng(12345);
		for (int i = 0; i < 12; i++)
			for (int j = 0; j < 64; j++)
				zobristKeys[i][j] = rng();
	}
	static void init();
	static uint64_t computeHash(const ChessBoard& board);

private:
	extern uint64_t zobristKeys[12][64]; // 6 نوع مهره × 2 رنگ × 64 خانه
	extern uint64_t zobristCastling[16]; // 4 بیت حقوق قلعه (2^4=16)
	extern uint64_t zobristEnPassant[8]; // 8 ستون ممکن برای آنپاسان

	void initZobrist() {
		std::mt19937_64 rng(12345); // seed ثابت برای تست
		for (int i = 0; i < 12; ++i)
			for (int j = 0; j < 64; ++j)
				zobristKeys[i][j] = rng();
		// ...
	}
	static uint64_t zobristTable[8][8][12]; // 12 = 6 مهره * 2 رنگ

	uint64_t keys[8][8][12]; // [x][y][piece]
	uint64_t turnKey;
public:
	Zobrist() { /* مقداردهی تصادفی */ }
	uint64_t computeHash(const ChessBoard& board) const;
	uint64_t computeZobristHash(const ChessBoard& board) {
		uint64_t hash = 0;
		for (const auto&[pos, piece] : board.pieces) {
			int pieceIndex = static_cast<int>(piece.type) + 6 * static_cast<int>(piece.color);
			hash ^= zobristTable[pos.x][pos.y][pieceIndex];
		}
		return hash;
	}

};



	
}