// src/search/Search.cpp
#include "Search.h"
#include "../utils/MoveGenerator.h"

Search::Search(Board& board, Evaluator& evaluator)
	: currentBoard(board), evaluator(evaluator) {}

SearchResult Search::startSearch(int depth) {
	SearchResult result;
	result.nodesVisited = 0;

	int alpha = -INFINITY;
	int beta = INFINITY;

	Move bestMove = MOVE_NONE;
	int bestValue = -INFINITY;

	MoveGenerator generator(currentBoard);
	auto moves = generator.generateLegalMoves();

	for (const auto& move : moves) {
		currentBoard.makeMove(move);
		int currentValue = alphaBeta(currentBoard, depth - 1, alpha, beta, false);
		currentBoard.unmakeMove(move);

		if (currentValue > bestValue) {
			bestValue = currentValue;
			bestMove = move;
		}

		alpha = std::max(alpha, bestValue);
	}

	result.bestMove = bestMove;
	result.score = bestValue;
	return result;
}

int Search::alphaBeta(Board& board, int depth, int alpha, int beta, bool maximizingPlayer) {
	if (depth == 0 || board.isGameOver()) {
		return evaluator.evaluate(board);
	}

	MoveGenerator generator(board);
	auto moves = generator.generateLegalMoves();

	if (maximizingPlayer) {
		int value = -INFINITY;
		for (const auto& move : moves) {
			board.makeMove(move);
			value = std::max(value, alphaBeta(board, depth - 1, alpha, beta, false));
			board.unmakeMove(move);

			alpha = std::max(alpha, value);
			if (value >= beta)
				break; // Beta cutoff
		}
		return value;
	}
	else {
		int value = INFINITY;
		for (const auto& move : moves) {
			board.makeMove(move);
			value = std::min(value, alphaBeta(board, depth - 1, alpha, beta, true));
			board.unmakeMove(move);

			beta = std::min(beta, value);
			if (value <= alpha)
				break; // Alpha cutoff
		}
		return value;
	}
}
// فعالسازی جستجوی موازی ساده (۲ thread)
void Search::startParallelSearch(int depth) {
	std::vector<std::thread> threads;
	for (int i = 0; i < 2; i++) {
		threads.emplace_back([this, depth]() {
			alphaBeta(currentBoard, depth, -INFINITY, INFINITY, true);
		});
	}
	for (auto& t : threads) t.join();
}
// مثال ساده از Minimax با هرس آلفا-بتا

	// Search.cpp
int Search::AlphaBeta(Board& board, int depth, int alpha, int beta, bool maximizingPlayer) {
	if (depth == 0 || board.IsGameOver()) {
		return evaluator.Evaluate(board);
	}

	auto moves = board.GenerateMoves();
	if (maximizingPlayer) {
		int value = -INFINITY;
		for (Move move : moves) {
			board.MakeMove(move);
			value = std::max(value, AlphaBeta(board, depth - 1, alpha, beta, false));
			board.UndoMove(move);
			alpha = std::max(alpha, value);
			if (alpha >= beta) break; // Beta cutoff
		}
		return value;
	}
	else {
		int value = INFINITY;
		for (Move move : moves) {
			board.MakeMove(move);
			value = std::min(value, AlphaBeta(board, depth - 1, alpha, beta, true));
			board.UndoMove(move);
			beta = std::min(beta, value);
			if (beta <= alpha) break; // Alpha cutoff
		}
		return value;
	}
	int Search::Quiescence(Board& board, int alpha, int beta) {
		int standPat = evaluator.Evaluate(board);
		if (standPat >= beta) return beta;
		if (standPat > alpha) alpha = standPat;

		auto captures = moveGenerator.GenerateCaptures(board);
		for (const auto& move : captures) {
			board.MakeMove(move);
			int score = -Quiescence(board, -beta, -alpha);
			board.UndoMove(move);
			if (score >= beta) return beta;
			if (score > alpha) alpha = score;
		}
		return alpha;
	}

	int Search::AlphaBeta(Board& board, int depth, int alpha, int beta, bool isQuiescence) {
		if (depth == 0) return Quiescence(board, alpha, beta); // فراخوانی Quiescence
		// ... ادامه کد AlphaBeta
	}
	// مرتب‌سازی حرکات بر اساس:
// 1. حرکات کیش
// 2. حرکات با ارزش بالاتر (مثلاً Capture/ Promotion)
	void Search::OrderMoves(std::vector<Move>& moves, const Board& board) {
		std::sort(moves.begin(), moves.end(), [&](const Move& a, const Move& b) {
			return evaluator.EvaluateMove(a, board) > evaluator.EvaluateMove(b, board);
		});
	}
	Move Search::FindBestMove(Board& board, int maxDepth) {
		Move bestMove;
		for (int depth = 1; depth <= maxDepth; depth++) {
			int score = AlphaBeta(board, depth, -INFINITY, INFINITY);
			// به‌روزرسانی بهترین حرکت بر اساس عمق جستجو
		}
		return bestMove;
	}
	// در Search.cpp
	int alphaBeta(...) {
		TTEntry* entry = tt.probe(zobristKey);
		if (entry->depth >= depth) return entry->score;
		// ...
	}

}
// در Search.cpp  
SearchResult minimax(Board board, int depth) {
	if (depth == 0) {
		return { Move(), board.evaluate() };
	}
	auto moves = board.generate_all_moves();
	if (moves.empty()) return { Move(), -9999 }; // مات  

	SearchResult best = { moves[0], -99999 };
	for (const auto& move : moves) {
		Board new_board = board;
		new_board.apply_move(move);
		int score = -minimax(new_board, depth - 1).score;
		if (score > best.score) {
			best = { move, score };
		}
	}
	return best;
}
bool Board::is_checkmate(bool is_white) {
	if (!is_in_check(is_white)) return false;

	// بررسی وجود حرکات قانونی  
	auto moves = generate_all_moves();
	return moves.empty();
}
// در Search.cpp  
int alpha_beta(Board& board, int depth, int alpha, int beta, bool maximizing_player) {
	if (depth == 0 || board.is_checkmate(!maximizing_player)) {
		return board.evaluate();
	}

	auto moves = board.generate_all_moves();
	if (maximizing_player) {
		int value = -9999;
		for (const auto& move : moves) {
			Board new_board = board;
			new_board.apply_move(move);
			value = std::max(value, alpha_beta(new_board, depth - 1, alpha, beta, false));
			alpha = std::max(alpha, value);
			if (beta <= alpha) break; // هرس  
		}
		return value;
	}
	else {
		int value = 9999;
		for (const auto& move : moves) {
			Board new_board = board;
			new_board.apply_move(move);
			value = std::min(value, alpha_beta(new_board, depth - 1, alpha, beta, true));
			beta = std::min(beta, value);
			if (beta <= alpha) break; // هرس  
		}
		return value;
	}
}
// در Search.cpp  
void Search::parallel_search(Board& board, int depth, int threads) {
	std::vector<std::thread> workers;
	auto moves = board.generate_all_moves();

	for (int i = 0; i < threads; i++) {
		workers.emplace_back([&, i]() {
			Board local_board = board;
			alpha_beta(local_board, depth, -INF, INF, true);
		});
	}

	for (auto& thread : workers) thread.join();
}
int Search::quiescence(Board& board, int alpha, int beta) {
	// ارزیابی اولیه موقعیت  
	int stand_pat = evaluator.evaluate(board);
	if (stand_pat >= beta) return beta;
	if (stand_pat > alpha) alpha = stand_pat;

	// تولید حرکات خشن (کیش/گرفتن مهره)  
	auto captures = board.generate_captures();
	for (const Move& move : captures) {
		Board new_board = board;
		new_board.apply_move(move);
		int score = -quiescence(new_board, -beta, -alpha);
		if (score >= beta) return beta;
		if (score > alpha) alpha = score;
	}

	// تولید حرکات کیش + گرفتن مهره
	auto aggressiveMoves = board.generateAggressiveMoves();
	for (const Move& move : aggressiveMoves) {
		board.makeMove(move);
		int score = -quiescence(board, -beta, -alpha);
		board.unmakeMove(move);
		auto checks = board.generateChecks(); // اضافه کردن حرکات کیش

		// ...
	}
	return alpha;
	
}

// در Search.cpp
Move Search::findBestMoveWithTimeControl(int maxDepth, int maxTimeMs) {
	auto start = std::chrono::steady_clock::now();
	Move bestMove;
	for (int depth = 1; depth <= maxDepth; depth++) {
		if (std::chrono::duration_cast<std::chrono::milliseconds>(...).count() > maxTimeMs)
			break;
		bestMove = alphaBetaRoot(depth);
	}
	return bestMove;
}

// در Search.cpp
std::atomic<int> bestScore;

void Search::lazySMP(int depth) {
	
	bestScore = -INFINITY;
	std::vector<std::thread> threads;
	for (int i = 0; i < 4; i++) { // 4 ترد
		threads.emplace_back([this, depth, i]() {
			alphaBeta(depth + i, ...); // جستجو با عمق متفاوت
		});
	}

	for (auto& t : threads) t.join();
}

Move Search::findBestMove(Board& board, int depth) {
	int bestValue = -INFINITY;
	Move bestMove;

	for (auto& move : board.generateLegalMoves()) {
		board.makeMove(move);
		int value = alphaBeta(board, depth - 1, -INFINITY, INFINITY, false);
		board.undoMove();

		if (value > bestValue) {
			bestValue = value;
			bestMove = move;
		}
	}
	return bestMove;
}

int Search::alphaBeta(Board& board, int depth, int alpha, int beta, bool maximizingPlayer) {
	if (depth == 0) return Evaluator::evaluate(board);

	// ... (پیاده‌سازی کامل آلفا-بتا)
}