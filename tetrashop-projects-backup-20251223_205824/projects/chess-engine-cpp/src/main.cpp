#include <iostream>
#include <vector>
#include <unordered_map>
#include <queue>
#include <algorithm>
#include <bitset>

using namespace std;

enum class PieceType { King, Queen, Rook, Bishop, Knight, Pawn, None };
enum class Color { White, Black, None };

struct Piece {
	PieceType type = PieceType::None;
	Color color = Color::None;
};

struct Position {
	int x, y;
	bool operator==(const Position& other) const { return x == other.x && y == other.y; }
};

namespace std {
	template<> struct hash<Position> {
		size_t operator()(const Position& pos) const {
			return hash<int>()(pos.x) ^ (hash<int>()(pos.y) << 1);
		}
	};
}

class ChessBoard {
private:
	Piece board[8][8];
	unordered_map<Position, Piece> pieces;

public:
	void initializeEndgame(Color winningSide, Position kingPos, vector<Position> attackerPositions) {
		// Initialize board with endgame configuration
		clearBoard();
		placePiece(kingPos, { PieceType::King, oppositeColor(winningSide) });
		for (auto& pos : attackerPositions) {
			placePiece(pos, { PieceType::King, winningSide });
		}
	}

	vector<Position> getPossibleMoves(Position pos) const {
		vector<Position> moves;
		const Piece& piece = getPiece(pos);
		if (piece.type == PieceType::King) {
			generateKingMoves(pos, piece.color, moves);
		}
		// Add other piece types as needed
		return moves;
	}

	bool isCheckmate(Color color) const {
		// Checkmate detection logic
		return isInCheck(color) && !hasLegalMoves(color);
	}

private:
	void generateKingMoves(Position pos, Color color, vector<Position>& moves) const {
		static const int dx[] = { -1, 0, 1, -1, 1, -1, 0, 1 };
		static const int dy[] = { -1, -1, -1, 0, 0, 1, 1, 1 };

		for (int i = 0; i < 8; ++i) {
			Position newPos = { pos.x + dx[i], pos.y + dy[i] };
			if (isValidPosition(newPos) && !isAlly(newPos, color)) {
				moves.push_back(newPos);
			}
		}
	}

	bool isValidPosition(Position pos) const {
		return pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8;
	}

	bool isAlly(Position pos, Color color) const {
		return getPiece(pos).color == color;
	}

	bool isInCheck(Color color) const {
		// Check detection logic
		return false;
	}

	bool hasLegalMoves(Color color) const {
		// Move generation for all pieces of given color
		return false;
	}

	void clearBoard() {
		for (int i = 0; i < 8; ++i) {
			for (int j = 0; j < 8; ++j) {
				board[i][j] = { PieceType::None, Color::None };
			}
		}
	}

	void placePiece(Position pos, Piece piece) {
		board[pos.x][pos.y] = piece;
		pieces[pos] = piece;
	}

	Piece getPiece(Position pos) const {
		return board[pos.x][pos.y];
	}

	Color oppositeColor(Color color) const {
		return (color == Color::White) ? Color::Black : Color::White;
	}
};

class EndgameSolver {
public:
	struct GameState {
		ChessBoard board;
		int depth;
	};

	int findMinimumMovesToCheckmate(ChessBoard initialBoard, Color winningSide) {
		queue<GameState> q;
		unordered_map<Position, int> visited;

		q.push({ initialBoard, 0 });

		while (!q.empty()) {
			GameState current = q.front();
			q.pop();

			if (current.board.isCheckmate(oppositeColor(winningSide))) {
				return current.depth;
			}

			// Generate all possible moves and add to queue
			// (Implementation depends on specific move generation logic)
		}
		return -1; // No checkmate possible
	}

private:
	Color oppositeColor(Color color) const {
		return (color == Color::White) ? Color::Black : Color::White;
	}
};

#include "uci/uci.hpp"

int main() {
	UCI uci;
	uci.start();
	return 0;
}
#include <iostream>
#include <functional>
#include <atomic>
#include <thread>
#include <vector>

// کلاس اصلی موتور شطرنج
class ChessEngine {
public:
	// تابع callback برای گزارش پیشرفت (درصد و توضیحات)
	using ProgressCallback = std::function<void(int percentage, const std::string& task)>;

	ChessEngine(ProgressCallback callback) : progressCallback(callback) {}

	// شروع محاسبات موتور
	void startProcessing() {
		// شبیه‌سازی مراحل مختلف موتور
		generateMoves();
		searchTree();
		evaluatePosition();
	}

private:
	ProgressCallback progressCallback;
	std::atomic<int> totalProgress{ 0 };

	// مراحل مختلف موتور
	void generateMoves() {
		reportProgress(0, "Generating Moves");
		// شبیه‌سازی تولید حرکات (مثلاً 30٪ زمان کل)
		simulateWork(30, "Generating Moves");
		totalProgress += 30;
	}

	void searchTree() {
		reportProgress(totalProgress, "Searching Tree");
		// شبیه‌سازی جستجوی درختی (مثلاً 50٪ زمان کل)
		simulateWork(50, "Searching Tree");
		totalProgress += 50;
	}

	void evaluatePosition() {
		reportProgress(totalProgress, "Evaluating Position");
		// شبیه‌سازی ارزیابی موقعیت (مثلاً 20٪ زمان کل)
		simulateWork(20, "Evaluating Position");
		totalProgress += 20;
		reportProgress(100, "Completed");
	}

	// تابع کمکی برای شبیه‌سازی کارهای زمان‌بر
	void simulateWork(int percentContribution, const std::string& task) {
		int steps = 10;
		for (int i = 1; i <= steps; ++i) {
			std::this_thread::sleep_for(std::chrono::milliseconds(100)); // تاخیر مصنوعی
			int current = totalProgress + (i * percentContribution / steps);
			reportProgress(current, task);
		}
	}

	// گزارش پیشرفت به callback
	void reportProgress(int percentage, const std::string& task) {
		if (progressCallback) {
			progressCallback(percentage, task);
		}
	}
	// مثال برای جستجوی آلفا-بتا با گزارش پیشرفت
		// ...
		void alphaBetaSearch(int depth, int currentDepth = 0) {
			if (currentDepth == depth) {
				return;
			}

			// شبیه‌سازی جستجو در هر عمق
			int totalNodes = 1000; // فرضی
			for (int i = 0; i < totalNodes; ++i) {
				// محاسبه پیشرفت بر اساس گره‌های پردازش‌شده
				int progress = (i * 100) / totalNodes;
				reportProgress(progress, "Alpha-Beta Search");

				std::this_thread::sleep_for(std::chrono::microseconds(100));
			}

			alphaBetaSearch(depth, currentDepth + 1);
		
public:
	using ProgressCallback = std::function<void(int totalProgress, const Task& task)>;

	ChessEngine(ProgressCallback callback) : progressCallback(callback) {
		// تعریف زیرکارها با وزن‌های مختلف
		tasks = {
			{"Move Generation", 30, 0},   // 30% وزن
			{"Tree Search",      50, 0},   // 50% وزن
			{"Position Evaluation", 20, 0} // 20% وزن
		};
	}

	// شروع پردازش
	void startProcessing() {
		// اجرای موازی زیرکارها (یا سریال)
		std::thread moveThread([this]() { generateMoves(); });
		std::thread searchThread([this]() { searchTree(); });
		std::thread evalThread([this]() { evaluatePosition(); });

		moveThread.join();
		searchThread.join();
		evalThread.join();
	}

private:
	std::vector<Task> tasks;
	ProgressCallback progressCallback;

	// زیرکار ۱: تولید حرکات
	void generateMoves() {
		Task& task = tasks[0];
		simulateWork(task, 10); // 10 مرحله برای تکمیل
	}

	// زیرکار ۲: جستجوی درختی
	void searchTree() {
		Task& task = tasks[1];
		simulateWork(task, 20); // 20 مرحله
	}

	// زیرکار ۳: ارزیابی موقعیت
	void evaluatePosition() {
		Task& task = tasks[2];
		simulateWork(task, 5); // 5 مرحله
	}

	// شبیه‌سازی کار برای یک زیرکار
	void simulateWork(Task& task, int steps) {
		for (int i = 1; i <= steps; ++i) {
			std::this_thread::sleep_for(std::chrono::milliseconds(100));
			task.progress = (i * 100) / steps; // پیشرفت داخلی زیرکار
			reportProgress(task);
		}
	}

	// گزارش پیشرفت کلی و جزئیات
	void reportProgress(const Task& task) {
		int total = 0;
		for (const auto& t : tasks) {
			total += (t.progress * t.weight) / 100;
		}
		if (progressCallback) {
			progressCallback(total, task);
		}
	}
};
int main() {
	// تعریف callback برای دریافت پیشرفت
	auto progressHandler = [](int totalProgress, const Task& task) {
		std::cout << "Total: " << totalProgress << "% | "
			<< "Task: " << task.name << " (" << task.progress << "%)\n";
	};
	// در تابع main  
	Board board;
	board.set_from_fen("startpos");
	auto start = std::chrono::high_resolution_clock::now();
	int score = board.evaluate();
	auto end = std::chrono::high_resolution_clock::now();
	std::cout << "Evaluation time: " << (end - start).count() << " ns\n";  
	UCIHandler uci;
	std::string cmd;
	while (std::getline(std::cin, cmd)) {
		if (cmd == "uci") {
			std::cout << "id name MyEngine\nuciok\n";
		}
		else if (cmd.starts_with("position")) {
			uci.process_command(cmd);
		}
		else if (cmd.starts_with("go depth")) {
			int depth = std::stoi(cmd.substr(9));
			SearchResult result = minimax(uci.board, depth);
			std::cout << "bestmove " << result.best_move.to_string() << "\n";
		}
	}
	
	board.set_from_fen("startpos");


	// ایجاد موتور و اتصال callback
	ChessEngine engine(progressHandler);
	engine.startProcessing();

	return 0;
}