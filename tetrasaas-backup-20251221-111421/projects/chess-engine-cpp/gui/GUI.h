#pragma once  
#include <SFML/Graphics.hpp>  

class ChessGUI {
public:
	void DrawBoard(const ChessBoard& board);
	// ترمیم: افزودن Drag & Drop  
	void HandleMouseClick(int x, int y);
};
