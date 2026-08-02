
// src/search/Search.h
#pragma once
#include "../board/Board.h"
#include "../evaluation/Evaluator.h"
#include "Board.h"  


class Search {
		public:
			static Move findBestMove(Board& board, int depth);

		private:
			static int alphaBeta(Board& board, int depth, int alpha, int beta, bool maximizing);
			static int quiescenceSearch(Board& board, int alpha, int beta);
	
public:
	static Move findBestMove(Board& board, int depth);

private:
	static int alphaBeta(Board& board, int depth, int alpha, int beta, bool maximizingPlayer);
	static int quiescenceSearch(Board& board, int alpha, int beta);

public:
	int history[64][64]; // [from][to] تاریخچه حرکات موفق
	struct SearchResult {
		Move bestMove;
		int score;
		int nodesVisited;
	};
	// در Search.h  
	int alpha_beta(Board& board, int depth, int alpha, int beta, bool maximizing_player);
	Search(Board& board, Evaluator& evaluator);

	SearchResult startSearch(int depth);

	SearchResult iterativeDeepeningSearch(int maxDepth, int timeLimit) {
		SearchResult finalResult;
		auto start = std::chrono::high_resolution_clock::now();

		for (int depth = 1; depth <= maxDepth; depth++) {
			auto currentResult = startSearch(depth);

			auto elapsed = std::chrono::high_resolution_clock::now() - start;
			if (std::chrono::duration_cast<std::chrono::milliseconds>(elapsed).count() > timeLimit)
				break;

			finalResult = currentResult;
		}
		return finalResult;
	}
	void orderMoves(std::vector<Move>& moves, const Board& board) {
		std::sort(moves.begin(), moves.end(), [&](const Move& a, const Move& b) {
			return board.getCapturedPiece(a) > board.getCapturedPiece(b);
		});
	}
	// در کلاس Search
	void orderMoves(std::vector<Move>& moves, const Board& board) {
		std::sort(moves.begin(), moves.end(), [&](const Move& a, const Move& b) {
			// اولویت ۱: حرکات تاکتیکی (کشتن مهره باارزشتر)
			int aCaptureValue = board.getPieceValue(a.getCapturedPiece());
			int bCaptureValue = board.getPieceValue(b.getCapturedPiece());

			// اولویت ۲: حرکات Killer (حرکاتی که قبلاً باعث برش بتا شدند)
			bool aIsKiller = (a == killerMoves[board.getPly()][0] || a == killerMoves[board.getPly()][1]);
			bool bIsKiller = (b == killerMoves[board.getPly()][0] || b == killerMoves[board.getPly()][1]);

			return (aCaptureValue > bCaptureValue) || (aIsKiller && !bIsKiller);
		});
	}
private:
	Board& currentBoard;
	Evaluator& evaluator;

	int alphaBeta(Board& board, int depth, int alpha, int beta, bool maximizingPlayer);
};

// در Search.h  

struct TranspositionTableEntry {
	uint64_t hash;
	int score;
	int depth;
	enum Flag { EXACT, LOWER_BOUND, UPPER_BOUND } flag;
};


class TranspositionTable {
private:
	std::unordered_map<uint64_t, TranspositionEntry> table;
	std::shared_mutex mutex;
	std::unordered_map<uint64_t, TTEntry> table;
public:
	struct Entry { uint64_t key; int score; int depth; };
	std::unordered_map<uint64_t, Entry> table;
	struct Entry {
		uint64_t key;
		int score;
		int depth;
		// ...
	};
	std::unordered_map<uint64_t, Entry> table;

	void store(uint64_t key, int score, int depth) { /*...*/ }
	Entry* probe(uint64_t key) { /*...*/ }

	void save(uint64_t hash, const TranspositionTableEntry& entry);
	std::optional<TranspositionTableEntry> probe(uint64_t hash);
	int quiescence(...) {
		int standPat = evaluate();
		if (standPat >= beta) return beta;
		// ...
	}
	void store(uint64_t hash, int score, int depth, TranspositionEntry::Flag flag) {
		std::unique_lock lock(mutex);
		table[hash] = { hash, score, depth, flag };
	}

	TranspositionEntry probe(uint64_t hash) {
		std::shared_lock lock(mutex);
		return table.count(hash) ? table[hash] : TranspositionEntry{ 0, 0, 0, TranspositionEntry::EXACT };
	}

private:
	std::unordered_map<uint64_t, TranspositionTableEntry> table;
};
struct SearchResult {
	Move best_move;
	int score;
};
SearchResult minimax(Board board, int depth);