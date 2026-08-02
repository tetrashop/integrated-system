#ifndef CHESSENGINE_BOARD_H
#define CHESSENGINE_BOARD_H

#include <array>
#include <vector>
#include <string>
#include <cstdint>
#include <immintrin.h>
#include <vector>  
#include <string>  
#pragma once
#include <optional>
#include "Piece.h"
#include "Move.h"
#include "Zobrist.h"
namespace ChessEngine {
	// در Board.h  


	// انواع مهره‌ها
	enum class Piece {
		None = 0,
		WhitePawn, WhiteKnight, WhiteBishop, WhiteRook, WhiteQueen, WhiteKing,
		BlackPawn, BlackKnight, BlackBishop, BlackRook, BlackQueen, BlackKing
	};
	// در Board.h  
	struct CastlingRights {
		bool white_kingside = true;
		bool white_queenside = true;
		bool black_kingside = true;
		bool black_queenside = true;
	};
	// رنگ بازیکن
	enum class Color { White, Black, None };

	// موقعیت مهره‌ها با استفاده از Bitboard (بهینه‌سازی)
	using Bitboard = uint64_t;
	// کلاس اصلی صفحه شطرنج
	class Board {
			// انواع وضعیت‌های بازی
			enum class GameState { Playing, Checkmate, Stalemate, Draw };

			// ساختار حقوق قلعه
			struct CastlingRights {
				bool whiteKingside = true;
				bool whiteQueenside = true;
				bool blackKingside = true;
				bool blackQueenside = true;
			};

			// متغیرهای عضو
			std::array<uint64_t, 12> pieceBitboards; // [WhitePawn, WhiteKnight,... BlackKing]
			uint64_t occupied = 0;
			uint64_t empty = ~0ULL;
			Color turn = Color::White;
			CastlingRights castling;
			std::optional<Square> enPassantTarget;
			int halfMoveClock = 0;
			int fullMoveNumber = 1;
			uint64_t zobristKey = 0;
			std::vector<MoveHistory> moveHistory;

			// توابع اصلی
			Board();
			void setFromFEN(const std::string& fen);
			std::vector<Move> generateLegalMoves();
			void makeMove(const Move& move);
			void undoMove();
			GameState getGameState() const;
			std::string toFEN() const;

			// توابع کمکی
			uint64_t getAttackers(Square sq, Color attackerColor) const;
			bool isSquareAttacked(Square sq, Color attackerColor) const;
			bool isInCheck(Color color) const;
			bool isMoveLegal(const Move& move) const;

		private:
			// توابع داخلی
			void clearBoard();
			void updateOccupancy();
			void updateZobristKey(const Move& move);
			void handleCastling(Move& move);
			void handleEnPassant(Move& move);
			void handlePromotion(Move& move);

		public:
			// انواع وضعیت‌های بازی
			enum class GameState { Playing, Checkmate, Stalemate, Draw };

			// ساختار حقوق قلعه
			struct CastlingRights {
				bool whiteKingside = true;
				bool whiteQueenside = true;
				bool blackKingside = true;
				bool blackQueenside = true;
			};

			// متغیرهای عضو
			std::array<uint64_t, 12> pieceBitboards; // [WhitePawn, WhiteKnight,... BlackKing]
			uint64_t occupied = 0;
			uint64_t empty = ~0ULL;
			Color turn = Color::White;
			CastlingRights castling;
			std::optional<Square> enPassantTarget;
			int halfMoveClock = 0;
			int fullMoveNumber = 1;
			uint64_t zobristKey = 0;
			std::vector<MoveHistory> moveHistory;

			// توابع اصلی
			Board();
			void setFromFEN(const std::string& fen);
			std::vector<Move> generateLegalMoves();
			void makeMove(const Move& move);
			void undoMove();
			GameState getGameState() const;
			std::string toFEN() const;

			// توابع کمکی
			uint64_t getAttackers(Square sq, Color attackerColor) const;
			bool isSquareAttacked(Square sq, Color attackerColor) const;
			bool isInCheck(Color color) const;
			bool isMoveLegal(const Move& move) const;

		private:
			// توابع داخلی
			void clearBoard();
			void updateOccupancy();
			void updateZobristKey(const Move& move);
			void handleCastling(Move& move);
			void handleEnPassant(Move& move);
			void handlePromotion(Move& move);
	
		Board();
		void resetToStartPosition();
		void setFromFEN(const std::string& fen);
		std::string toFEN() const;

		std::vector<Move> generateLegalMoves();
		bool makeMove(const Move& move);
		bool isInCheck(Color color) const;
		void print() const;

		Piece getPiece(Square sq) const;

		// وضعیت بازی
		Color turn = Color::White;
		struct CastlingRights {
			bool whiteKingside = true;
			bool whiteQueenside = true;
			bool blackKingside = true;
			bool blackQueenside = true;
		} castling;
		Square enPassantTarget = { -1, -1 };
		int halfMoveClock = 0;
		int fullMoveNumber = 1;

	private:
		std::array<std::array<Piece, 8>, 8> m_board;
		std::vector<Move> m_moveHistory;

		bool isSquareAttacked(Square sq, Color attacker) const;
		void clearBoard();
	public:
		Board();
		uint64_t pawns = 0;
		uint64_t knights = 0;
		uint64_t bishops = 0;
		uint64_t rooks;
		uint64_t queens;
		uint64_t kings;
		uint64_t white;  // تمام مهرههای سفید  
		uint64_t black;  // تمام مهرههای سیاه  
	
		std::vector<Move> generate_pawn_moves(int x, int y);
		std::array<std::array<Piece, 8>, 8> squares;
		std::vector<Move> generate_knight_moves(int x, int y);
		std::array<std::array<Piece, 8>, 8> squares;
		std::vector<Move> generate_pawn_moves(int x, int y);
		bool is_in_check(bool is_white); // بررسی کیش بودن رنگ خاص  
		bool is_move_legal(const Move& move); // بررسی قانونی بودن حرکت  
		std::array<std::array<Piece, 8>, 8> squares;
		bool is_white_turn = true; // نوبت بازیکن  
		void set_from_fen(const std::string& fen);
		std::vector<Move> generate_all_moves();
		bool is_in_check(bool is_white);
		bool is_move_legal(const Move& move);
		bool is_checkmate(bool is_white);
		std::optional<std::pair<int, int>> en_passant_target; // موقعیت پیاده قابل آنپاسان  
		CastlingRights castling_rights;
		std::optional<std::pair<int, int>> en_passant_target; // موقعیت پیاده هدف برای آنپاسان  

		

		void set_from_fen(const std::string& fen) {
			// پیادهسازی سادهی FEN Parser برای موقعیت شروع
			if (fen == "startpos") {
				// تنظیم مهرهها در موقعیت اولیه
				squares[0] = { /* رخ, اسب, فیل, وزیر, شاه, ... */ };
				// ...
			}
		}
		// تولید تمام حرکات مجاز
		std::vector<Move> generateLegalMoves() const;

		// اعمال یک حرکت روی صفحه
		void makeMove(const Move& move);

		// بازگرداندن آخرین حرکت
		void undoMove();

		// تبدیل به FEN (برای ذخیره موقعیت)
		std::string toFEN() const;

		// چاپ صفحه به صورت متن
		void print() const;

		// بررسی وضعیت بازی (مات، پات، تساوی)
		GameState getGameState() const;

	private:
		// داده‌های صفحه
		std::array<Piece, 64> m_squares;
		Color m_turn;
		bool m_castlingRights[4]; // [WhiteKingSide, WhiteQueenSide, BlackKingSide, BlackQueenSide]
		Square m_enPassantSquare;
		int m_halfMoveClock;
		int m_fullMoveNumber;

		// تاریخچه حرکات برای undo
		std::vector<MoveHistory> m_moveHistory;

		// توابع کمکی
		Bitboard getPawnAttacks(Square sq, Color color) const;
		Bitboard getKnightAttacks(Square sq) const;
		bool isSquareAttacked(Square sq, Color attackerColor) const;
	};

	// ساختار حرکت
	struct Move {
		Square from;
		Square to;
		Piece piece;
		Piece promotion; // برای ارتقاء پیاده
		MoveType type;   // عادی، En Passant، قلعه، ارتقاء
		int from_x, from_y;
		int to_x, to_y;
		std::string to_string() const {
			char cols[] = { 'a','b','c','d','e','f','g','h' };
			return std::string(1, cols[from_y]) + std::to_string(8 - from_x) +
				std::string(1, cols[to_y]) + std::to_string(8 - to_x);
		}
	};




	
#endif // CHESSENGINE_BOARD_H
