#include <cstdint>
#include <array>
#include <iostream>

namespace ChessEngine {

	using Bitboard = uint64_t;

	class Bitboards {
	public:
		enum class Piece { Pawn, Knight, Bishop, Rook, Queen, King, None };

		static uint64_t pawnAttacks(Square sq, Color color);
		static uint64_t knightAttacks(Square sq);
		static uint64_t kingAttacks(Square sq);
		static uint64_t slidingAttacks(Square sq, uint64_t occupied, const std::vector<std::pair<int, int>>& directions);

			// تعریف رنکها و فایلها
			static constexpr Bitboard Rank1 = 0x00000000000000FF;
			static constexpr Bitboard FileA = 0x0101010101010101;
			static constexpr Bitboard FileB = 0x0202020202020202;
			// ... سایر فایلها و رنکها

			// پیش‌محاسبه حملات اسب
			static const std::array<Bitboard, 64> KnightAttacks;

			// Magic Bitboards برای فیل
			static const std::array<Bitboard, 64> bishopMagics;
			static std::array<std::array<Bitboard, 512>, 64> bishopAttacks;

			struct Position {
				std::array<Bitboard, 6> white = {};
				std::array<Bitboard, 6> black = {};
				Bitboard whiteOccupancy = 0;
				Bitboard blackOccupancy = 0;
				Bitboard allOccupancy = 0;
				bool whiteKingsideCastle = false;
				bool blackKingsideCastle = false;
			};
		void initBishopAttacks() {
			for (int square = 0; square < 64; ++square) {
				Bitboard mask = bishopMask(square); // ماسک مربع‌های مؤثر
				int bitCount = countBits(mask);
				for (int i = 0; i < (1 << bitCount); ++i) {
					Bitboard occupancy = generateOccupancy(mask, i);
					int index = (occupancy * bishopMagics[square]) >> (64 - 9); // 9 بیت برای فیل
					bishopAttacks[square][index] = calculateBishopAttacks(square, occupancy);
				}
			}
		}
		// وضعیت مهره‌ها
		struct Position {
			std::array<Bitboard, 6> white = {}; // سرباز، اسب، فیل، رخ، وزیر، شاه
			std::array<Bitboard, 6> black = {};
			Bitboard whiteOccupancy = 0;
			Bitboard blackOccupancy = 0;
			Bitboard allOccupancy = 0;
		};
		// مقداردهی حملات اسب
		const std::array<Bitboard, 64> Bitboards::KnightAttacks = []() {
			std::array<Bitboard, 64> attacks{};
			// ... منطق محاسبه حملات
			return attacks;
		}();
		// به‌روزرسانی وضعیت اشغال‌شده
		static void updateOccupancy(Position& pos) {
			pos.whiteOccupancy = pos.white[0] | pos.white[1] | pos.white[2] | pos.white[3] | pos.white[4] | pos.white[5];
			pos.blackOccupancy = pos.black[0] | pos.black[1] | pos.black[2] | pos.black[3] | pos.black[4] | pos.black[5];
			pos.allOccupancy = pos.whiteOccupancy | pos.blackOccupancy;
		}

		// تولید حرکت برای سرباز سفید
		static Bitboard generateWhitePawnMoves(const Position& pos, int square) {
			Bitboard moves = 0;
			Bitboard pawn = 1ULL << square;
			// ... منطق تولید حرکت (همانند کد قبلی)
			return moves;
		}
		bool canCastleKingside(const Position& pos, bool isWhite) {
			if (isWhite && !pos.whiteKingsideCastle) return false;
			Bitboard castlePath = isWhite ? 0x0000000000000060 : 0x6000000000000000; // f1 و g1 برای سفید
			return !(pos.allOccupancy & castlePath);
		}
		// اجرای حرکت و به‌روزرسانی Bitboardها
		static void makeMove(Position& pos, Piece piece, int from, int to, bool isCapture) {
			Bitboard fromMask = 1ULL << from;
			Bitboard toMask = 1ULL << to;
			pos.white[piece] ^= fromMask | toMask;
			// ... منطق Capture و به‌روزرسانی
			updateOccupancy(pos);
		}

		// نمایش بصری Bitboard (برای دیباگ)
		static void printBitboard(Bitboard b) {
			for (int rank = 7; rank >= 0; --rank) {
				for (int file = 0; file < 8; ++file) {
					int square = rank * 8 + file;
					std::cout << ((b >> square) & 1) << " ";
				}
				std::cout << "\n";
			}
		}
		int evaluatePawnStructure(const Position& pos, bool isWhite) {
			int score = 0;
			Bitboard pawns = isWhite ? pos.white[Pawn] : pos.black[Pawn];
			// محاسبه جریمه سربازهای ایزوله
			if ((pawns & FileA) && !(pawns & FileB)) score -= 10;
			// ...
			return score;
		}
		const std::array<Bitboard, 64> Bitboards::KnightAttacks = []() {
			std::array<Bitboard, 64> attacks{};
			for (int square = 0; square < 64; ++square) {
				Bitboard b = 1ULL << square;
				attacks[square] = ((b << 15) & ~FileH) | ((b << 6) & ~FileG & ~FileH) |
					((b >> 10) & ~FileG & ~FileH) | ((b >> 17) & ~FileH) |
					((b << 17) & ~FileA) | ((b << 10) & ~FileA & ~FileB) |
					((b >> 6)  & ~FileA & ~FileB) | ((b >> 15) & ~FileA);
			}
			return attacks;
		}();

		constexpr Square bitScanForward(uint64_t bb) {
			return static_cast<Square>(__builtin_ctzll(bb));
		}

		constexpr int popCount(uint64_t bb) {
			return __builtin_popcountll(bb));
		}
	};

} // namespace ChessEngine
	// پیش‌محاسبه حملات اسب (مقداردهی خارج از کلاس)
	