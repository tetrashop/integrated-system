#pragma once
#include "ChessBoard.h"
#include <string>

class UCIHandler {
public:
	void processCommand(const std::string& command);

private:
	ChessBoard board;

	void processPosition(const std::string& command);
	void processGo(const std::string& command);
	void handleUCICommand(const string& command) {
		if (command == "uci") {
			cout << "id name MyEngine\n";
			cout << "id author YourName\n";
			cout << "uciok\n";
		}
		else if (command.substr(0, 8) == "position") {
			// پردازش وضعیت تخته
		}
		else if (command.substr(0, 2) == "go") {
			// شروع جستجو
			Move bestMove = findBestMove(currentBoard, 6);
			cout << "bestmove " << toChessNotation(bestMove.from) << toChessNotation(bestMove.to) << endl;
		}
	}

	void handleUCICommands() {
		string command;
		ChessBoard board;

		while (getline(cin, command)) {
			if (command == "uci") {
				cout << "id name MyChessEngine\n";
				cout << "id author YourName\n";
				cout << "uciok\n";
			}
			else if (command.substr(0, 8) == "position") {
				// پردازش وضعیت (مثلاً position startpos moves e2e4 e7e5)
			}
			else if (command.substr(0, 2) == "go") {
				thread searchThread([&] {
					Move bestMove = board.findBestMove(6); // عمق ۶
					cout << "bestmove " << toChessNotation(bestMove.from)
						<< toChessNotation(bestMove.to) << endl;
				});
				searchThread.detach();
			}
		}
	}

};