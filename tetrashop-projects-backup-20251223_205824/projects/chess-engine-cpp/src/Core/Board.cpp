#include "Board.h"
#include "MoveGenerator.h"
#include <iostream>
#include <sstream>
#include <immintrin.h>  

namespace ChessEngine {

	Board::Board() {
		setToStartPosition();
	}

	void Board::setToStartPosition() {
		// پاکسازی صفحه
		m_squares.fill(Piece::None);

		// تنطیم مهره‌های سفید
		m_squares[0] = Piece::WhiteRook;
		m_squares[1] = Piece::WhiteKnight;
		m_squares[2] = Piece::WhiteBishop;
		m_squares[3] = Piece::WhiteQueen;
		m_squares[4] = Piece::WhiteKing;
		m_squares[5] = Piece::WhiteBishop;
		m_squares[6] = Piece::WhiteKnight;
		m_squares[7] = Piece::WhiteRook;
		for (int i = 8; i < 16; i++) m_squares[i] = Piece::WhitePawn;

		// تنطیم مهره‌های سیاه
		m_squares[56] = Piece::BlackRook;
		m_squares[57] = Piece::BlackKnight;
		m_squares[58] = Piece::BlackBishop;
		m_squares[59] = Piece::BlackQueen;
		m_squares[60] = Piece::BlackKing;
		m_squares[61] = Piece::BlackBishop;
		m_squares[62] = Piece::BlackKnight;
		m_squares[63] = Piece::BlackRook;
		for (int i = 48; i < 56; i++) m_squares[i] = Piece::BlackPawn;

		// تنظیمات اولیه
		m_turn = Color::White;
		std::fill(m_castlingRights, m_castlingRights + 4, true);
		m_enPassantSquare = Square::None;
		m_halfMoveClock = 0;
		m_fullMoveNumber = 1;
	}

	std::vector<Move> Board::generateLegalMoves() const {
		return MoveGenerator::generateLegalMoves(*this);
	}
	
	void Board::makeMove(const Move& move) {
		// ذخیره تاریخچه برای undo
		MoveHistory history;
		history.move = move;
		history.castlingRights = { m_castlingRights[0], m_castlingRights[1], m_castlingRights[2], m_castlingRights[3] };
		history.enPassantSquare = m_enPassantSquare;
		history.halfMoveClock = m_halfMoveClock;
		m_moveHistory.push_back(history);

		// اعمال حرکت
		m_squares[move.to] = m_squares[move.from];
		m_squares[move.from] = Piece::None;

		if (move.type == MoveType::EnPassant) {
			// حذف پیاده حریف
		}
		// پردازش حرکات خاص
		if (move.type == MoveType::Castling) {
			// حرکت قلعه
			// ...
		}
		else if (move.type == MoveType::EnPassant) {
			// حذف پیاده حریف در En Passant
			// ...
		}
		else if (move.type == MoveType::Promotion) {
			// ارتقای پیاده
			m_squares[move.to] = move.promotion;
		}

		// به‌روزرسانی وضعیت
		m_turn = (m_turn == Color::White) ? Color::Black : Color::White;
	}

	void Board::undoMove() {
		if (m_moveHistory.empty()) return;

		const auto& history = m_moveHistory.back();
		const Move& move = history.move;

		// بازگرداندن حرکت
		m_squares[move.from] = m_squares[move.to];
		m_squares[move.to] = Piece::None;

		// بازگردانی وضعیت
		std::copy(history.castlingRights.begin(), history.castlingRights.end(), m_castlingRights);
		m_enPassantSquare = history.enPassantSquare;
		m_halfMoveClock = history.halfMoveClock;
		m_turn = (m_turn == Color::White) ? Color::Black : Color::White;

		m_moveHistory.pop_back();
	}

	std::string Board::toFEN() const {
		std::stringstream fen;
		int empty = 0;

		// موقعیت مهره‌ها
		for (int rank = 7; rank >= 0; rank--) {
			for (int file = 0; file < 8; file++) {
				int sq = rank * 8 + file;
				Piece piece = m_squares[sq];
				if (piece == Piece::None) {
					empty++;
				}
				else {
					if (empty > 0) fen << empty;
					empty = 0;
					fen << pieceToChar(piece);
				}
			}
			if (empty > 0) fen << empty;
			if (rank > 0) fen << '/';
			empty = 0;
		}

		// رنگ نوبت
		fen << (m_turn == Color::White ? " w " : " b ");

		// حقوق قلعه
		bool anyCastling = false;
		if (m_castlingRights[0]) { fen << 'K'; anyCastling = true; }
		if (m_castlingRights[1]) { fen << 'Q'; anyCastling = true; }
		if (m_castlingRights[2]) { fen << 'k'; anyCastling = true; }
		if (m_castlingRights[3]) { fen << 'q'; anyCastling = true; }
		if (!anyCastling) fen << '-';

		// En Passant
		fen << (m_enPassantSquare == Square::None ? " - " : " " + squareToString(m_enPassantSquare) + " ");

		// ساعت حرکت
		fen << m_halfMoveClock << " " << m_fullMoveNumber;

		return fen.str();
	}

	void Board::print() const {
		const std::string pieces = " PNBRQK  pnbrqk";
		for (int rank = 7; rank >= 0; rank--) {
			std::cout << rank + 1 << " ";
			for (int file = 0; file < 8; file++) {
				int sq = rank * 8 + file;
				std::cout << pieces[static_cast<int>(m_squares[sq])] << " ";
			}
			std::cout << "\n";
		}
		std::cout << "  a b c d e f g h\n";
	}

	// توابع کمکی
	Bitboard Board::getPawnAttacks(Square sq, Color color) const {
		// محاسبه حمله‌های پیاده با Bitboard
		// ...
	}

	Bitboard Board::getKnightAttacks(Square sq) const {
		// جدول از پیش محاسبه شده برای حرکت اسب
		static const Bitboard knightAttacks[64] = {/*...*/ };
		return knightAttacks[sq];
	}

	bool Board::isSquareAttacked(Square sq, Color attackerColor) const {
		// بررسی حمله توسط تمام مهره‌های حریف
		// ...
	}
	

// تکمیل پارسر FEN
	void Board::ResetToFEN(const std::string& fen) {
		// مثال FEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
		std::istringstream iss(fen);
		std::string piecePlacement, activeColor, castling, enPassant, halfMove, fullMove;

		iss >> piecePlacement >> activeColor >> castling >> enPassant >> halfMove >> fullMove;

		// ریست تخته
		memset(bitboards, 0, sizeof(bitboards));

		int row = 7, col = 0;
		for (char c : piecePlacement) {
			if (c == '/') {
				row--;
				col = 0;
			}
			else if (isdigit(c)) {
				col += c - '0';
			}
			else {
				int piece = CharToPiece(c);
				SetBit(bitboards[piece], row * 8 + col);
				col++;
			}
		}

		isWhiteTurn = (activeColor == "w");
		// مدیریت وضعیت قلعه و آنپاسان (نیاز به پیاده‌سازی)
	}
	// MoveGenerator.cpp
	std::vector<Move> Board::GenerateKnightMoves(int square, Color color) {
		std::vector<Move> moves;
		uint64_t knightAttacks = precomputedKnightAttacks[square];
		uint64_t targetSquares = knightAttacks & ~GetColorBitboard(color);

		while (targetSquares) {
			int target = GetLSB(targetSquares);
			moves.push_back(CreateMove(square, target));
			targetSquares &= targetSquares - 1;
		}
		return moves;
	}
	

	// در Board.cpp  
	std::vector<Move> Board::generate_pawn_moves(int x, int y) {
		uint64_t white_pawns = pawns & white;
		uint64_t single_push = (white_pawns << 8) & ~(white | black);
		uint64_t double_push = ((single_push & 0x0000000000FF0000) << 8) & ~(white | black);

		std::vector<Move> moves;
		Piece piece = squares[x][y];

		// حرکت سفیدها به جلو  
		if (piece == Piece::WhitePawn) {
			// حرکت ۱ خانه  
			if (x > 0 && squares[x - 1][y] == Piece::None) {
				moves.push_back({ x, y, x - 1, y });
				// حرکت ۲ خانه در اولین حرکت  
				if (x == 6 && squares[x - 2][y] == Piece::None) {
					moves.push_back({ x, y, x - 2, y });
				}
			}
			// ضربهی اریب (چپ)  
			if (x > 0 && y > 0 && squares[x - 1][y - 1] != Piece::None) {
				moves.push_back({ x, y, x - 1, y - 1 });
			}
			// ضربهی اریب (راست)  
			if (x > 0 && y < 7 && squares[x - 1][y + 1] != Piece::None) {
				moves.push_back({ x, y, x - 1, y + 1 });
			}
		}
		// حرکت سیاهها به جلو (مشابه با جهت معکوس)  
		return moves;
	}
	// در Board.cpp  
	std::vector<Move> Board::generate_knight_moves(int x, int y) {
		std::vector<Move> moves;
		const int directions[8][2] = {
			{-2, -1}, {-2, 1},
			{-1, -2}, {-1, 2},
			{1, -2},  {1, 2},
			{2, -1},  {2, 1}
		};

		for (const auto& dir : directions) {
			int new_x = x + dir[0];
			int new_y = y + dir[1];
			if (new_x >= 0 && new_x < 8 && new_y >= 0 && new_y < 8) {
				Piece target = squares[new_x][new_y];
				if (target == Piece::None || (is_white(piece) != is_white(target))) {
					moves.push_back({ x, y, new_x, new_y });
				}
			}
		}
		return moves;
	}
	// در Board.cpp  
	bool Board::is_in_check(bool is_white) {
		// پیدا کردن موقعیت شاه  
		int king_x = -1, king_y = -1;
		for (int i = 0; i < 8; i++) {
			for (int j = 0; j < 8; j++) {
				if (squares[i][j] == (is_white ? Piece::WhiteKing : Piece::BlackKing)) {
					king_x = i;
					king_y = j;
					break;
				}
			}
		}

		// بررسی تمام حرکات حریف برای حمله به شاه  
		bool in_check = false;
		for (int i = 0; i < 8; i++) {
			for (int j = 0; j < 8; j++) {
				Piece p = squares[i][j];
				if (p != Piece::None && is_white != is_white_piece(p)) {
					auto moves = generate_moves_for_piece(i, j);
					for (const auto& move : moves) {
						if (move.to_x == king_x && move.to_y == king_y) {
							in_check = true;
							break;
						}
					}
				}
			}
		}
		return in_check;
	}

	bool Board::is_move_legal(const Move& move) {
		// اعمال حرکت موقت  
		Board temp_board = *this;
		temp_board.apply_move(move);

		// بررسی کیش بودن پس از حرکت  
		return !temp_board.is_in_check(is_white_turn);
	}
	void Board::apply_move(const Move& move) {
		// ...  
		// غیرفعال کردن حقوق قلعه پس از حرکت شاه یا رخ  
		if (piece_moved == Piece::WhiteKing) {
			castling_rights.white_kingside = false;
			castling_rights.white_queenside = false;
		}
		else if (piece_moved == Piece::WhiteRook) {
			if (move.from_y == 0) castling_rights.white_queenside = false;
			if (move.from_y == 7) castling_rights.white_kingside = false;
		}
		// ... (منطق مشابه برای سیاه)  
		if (piece_moved == Piece::BlackKing) {
			castling_rights.black_kingside = false;
			castling_rights.black_queenside = false;
		}
		else if (piece_moved == Piece::BlackRook) {
			if (move.from_y == 0) castling_rights.black_queenside = false;
			if (move.from_y == 7) castling_rights.black_kingside = false;
		}
	}

	bool Board::can_castle(bool is_white, bool kingside) {
		if (is_white) {
			if (kingside && !castling_rights.white_kingside) return false;
			// بررسی مسیر و عدم کیش  
			int x = 7;
			return squares[x][5] == Piece::None &&
				squares[x][6] == Piece::None &&
				!is_in_check(is_white);
		}else
			{
				if (kingside && !castling_rights.black_kingside) return false;
				// بررسی مسیر و عدم کیش  
				int x = 7;
				return squares[x][5] == Piece::None &&
					squares[x][6] == Piece::None &&
					!is_in_check(!is_white);
			}
		// ... (منطق مشابه برای سیاه)  
	}
#include "Board.h"  
#include <algorithm>  

	// ... (توابع set_from_fen و generate_all_moves)  

	bool Board::is_in_check(bool is_white) {
		int king_x = -1, king_y = -1;
		for (int i = 0; i < 8; i++) {
			for (int j = 0; j < 8; j++) {
				if (squares[i][j] == (is_white ? Piece::WhiteKing : Piece::BlackKing)) {
					king_x = i;
					king_y = j;
					break;
				}
			}
		}

		// بررسی تمام حرکات حریف  
		for (int i = 0; i < 8; i++) {
			for (int j = 0; j < 8; j++) {
				Piece p = squares[i][j];
				if (p != Piece::None && (is_white != (p == Piece::WhitePawn || p == Piece::WhiteKing /* ... */))) {
					auto moves = generate_moves_for_piece(i, j);
					for (const auto& move : moves) {
						if (move.to_x == king_x && move.to_y == king_y) {
							return true;
						}
					}
				}
			}
		}
		return false;
	}

	bool Board::is_move_legal(const Move& move) {
		Board temp = *this;
		temp.apply_move(move);
		return !temp.is_in_check(is_white_turn);
	}

	bool Board::is_checkmate(bool is_white) {
		if (!is_in_check(is_white)) return false;
		auto moves = generate_all_moves();
		return moves.empty();
	}
	bool Board::can_castle(bool is_white, bool kingside) {
		if (is_white) {
			if (kingside && !castling_rights.white_kingside) return false;
			if (!kingside && !castling_rights.white_queenside) return false;
			// بررسی مسیر آزاد و عدم کیش  
			int x = 7;
			if (kingside) {
				return squares[x][5] == Piece::None &&
					squares[x][6] == Piece::None &&
					!is_in_check(true);
			}
			else {
				return squares[x][1] == Piece::None &&
					squares[x][2] == Piece::None &&
					squares[x][3] == Piece::None &&
					!is_in_check(true);
			}
		}
		// منطق مشابه برای سیاه  
	}
	// در Board.cpp  
	void Board::order_moves(std::vector<Move>& moves) {
		std::sort(moves.begin(), moves.end(), [](const Move& a, const Move& b) {
			// اولویت به حرکات کیشدهنده یا گرفتن مهرهها  
			return a.is_capture || a.gives_check > b.is_capture || b.gives_check;
		});
	}
	void Board::set_from_fen(const std::string& fen) {
		pawns = 0;
		knights = 0;
		// ... (پر کردن Bitboardها بر اساس FEN)  
	}

	int Board::evaluate() {
		// مقادیر پایه مهره‌ها (پیاده=100، اسب=300، فیل=300، رخ=500، وزیر=900)  
		const __m256i piece_values = _mm256_setr_epi32(
			100, 300, 300, 500, 900, 0, 0, 0
		);

		// جمع‌کننده‌های برداری برای سفید و سیاه  
		__m256i white_sum = _mm256_setzero_si256();
		__m256i black_sum = _mm256_setzero_si256();

		// بررسی ۸ خانه همزمان (بهینه برای AVX2)  
		for (int i = 0; i < 64; i += 8) {
			// بارگذاری ۸ مهره از حافظه (هر سلول ۴ بایت)  
			__m256i pieces = _mm256_loadu_si256(
				reinterpret_cast<const __m256i*>(&squares[i])
			);

			// جداسازی رنگ مهره‌ها (بیت ۴)  
			__m256i color_mask = _mm256_set1_epi32(0x10);
			__m256i is_white = _mm256_and_si256(pieces, color_mask);

			// جداسازی نوع مهره (بیت‌های 0-3)  
			__m256i piece_type = _mm256_and_si256(pieces, _mm256_set1_epi32(0x0F));

			// تبدیل نوع مهره به مقادیر امتیازی  
			__m256i values = _mm256_shuffle_epi8(piece_values, piece_type);

			// جمع‌کردن امتیازها بر اساس رنگ  
			white_sum = _mm256_add_epi32(white_sum, _mm256_and_si256(values, _mm256_cmpeq_epi32(is_white, color_mask)));
			black_sum = _mm256_add_epi32(black_sum, _mm256_andnot_si256(_mm256_cmpeq_epi32(is_white, color_mask), values));
		}

		// جمع نهایی برداری به اسکالر  
		int white_total[8], black_total[8];
		_mm256_storeu_si256(reinterpret_cast<__m256i*>(white_total), white_sum);
		_mm256_storeu_si256(reinterpret_cast<__m256i*>(black_total), black_sum);

		return (white_total[0] + white_total[1] + white_total[2] + white_total[3] +
			white_total[4] + white_total[5] + white_total[6] + white_total[7]) -
			(black_total[0] + black_total[1] + black_total[2] + black_total[3] +
				black_total[4] + black_total[5] + black_total[6] + black_total[7]);
	}
	void makeMove(Move move) {
		// به‌روزرسانی Bitboardها با عملیات بیتی
		pawns &= ~(1ULL << move.from);
		pawns |= (1ULL << move.to);
	}
	
}
	// در Search.cpp
	void Search::lazySMP(int depth) {
		std::vector<std::thread> threads;
		for (int i = 0; i < numThreads; i++) {
			threads.emplace_back([this, depth]() {
				// هر ترد جستجو را با عمق متفاوت شروع می‌کند
				alphaBeta(depth + threadId, ...);
			});
		}
		// ...
	}
	void Board::setFromFEN(const std::string& fen) {
		// پیاده‌سازی کامل پارسر FEN
		std::istringstream iss(fen);
		std::string token;

		// پاکسازی صفحه
		for (auto& row : squares) row.fill(Piece::None);

		// بخش موقعیت مهره‌ها
		int row = 7, col = 0;
		iss >> token;
		for (char c : token) {
			if (c == '/') { row--; col = 0; continue; }
			if (isdigit(c)) { col += c - '0'; continue; }

			Piece piece = charToPiece(c);
			squares[row][col++] = piece;
		}

		// بخش رنگ نوبت
		iss >> token;
		turn = (token == "w") ? Color::White : Color::Black;

		// بخش حقوق قلعه
		iss >> token;
		castling = {
			.whiteKingside = token.find('K') != std::string::npos,
			.whiteQueenside = token.find('Q') != std::string::npos,
			.blackKingside = token.find('k') != std::string::npos,
			.blackQueenside = token.find('q') != std::string::npos
		};

		// بخش آنپاسان
		iss >> token;
		enPassant = (token != "-") ? std::make_optional(parseSquare(token)) : std::nullopt;

		// بخش ساعت حرکت
		iss >> halfMoveClock >> fullMoveNumber;
	}
	std::vector<Move> Board::generateLegalMoves() {
		return MoveGenerator::generateLegalMoves(*this);
	}

	bool Board::isInCheck(Color color) const {
		// پیاده‌سازی بهینه با استفاده از Bitboard
		auto kingPos = findKing(color);
		return isSquareAttacked(kingPos, color);
	}

	bool Board::isMoveLegal(const Move& move) {
		Board temp = *this;
		temp.makeMove(move);
		return !temp.isInCheck(turn);
	}
#include "Board.h"
#include "MoveGenerator.h"
#include "BitboardUtils.h"
#include <sstream>

	using namespace ChessEngine;

	Board::Board() {
		setFromFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
	}

	void Board::setFromFEN(const std::string& fen) {
		clearBoard();
		std::istringstream iss(fen);
		std::string token;

		// پارس کردن بخش مهره‌ها
		int rank = 7, file = 0;
		while (iss >> token && token != " ") {
			for (char c : token) {
				if (c == '/') { rank--; file = 0; }
				else if (isdigit(c)) file += c - '0';
				else {
					Piece piece = charToPiece(c);
					setPiece(Square{ rank, file }, piece);
					file++;
				}
			}
		}

		// پارس کردن سایر بخش‌ها
		// ... (پیاده‌سازی کامل)
	}

	std::vector<Move> Board::generateLegalMoves() {
		std::vector<Move> moves = MoveGenerator::generatePseudoLegalMoves(*this);

		// حذف حرکات غیرقانونی
		moves.erase(std::remove_if(moves.begin(), moves.end(),
			[this](const Move& m) { return !isMoveLegal(m); }), moves.end());

		return moves;
	}

	void Board::makeMove(const Move& move) {
		MoveHistory history;
		history.move = move;
		history.state = *this;
		moveHistory.push_back(history);

		// اعمال حرکت
		// ... (پیاده‌سازی کامل با Bitboard)
	}

	bool Board::isInCheck(Color color) const {
		Square kingSquare = bitScanForward(pieceBitboards[color == White ? W_KING : B_KING]);
		return isSquareAttacked(kingSquare, ~color);
	}
	
} // namespace ChessEngine


