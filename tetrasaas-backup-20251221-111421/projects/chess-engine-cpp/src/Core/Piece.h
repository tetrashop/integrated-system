#pragma once

namespace ChessEngine {
	enum class PieceType {
		None, Pawn, Knight, Bishop, Rook, Queen, King
	};

	enum class Color { White, Black };

	struct Piece {
		PieceType type = PieceType::None;
		Color color = Color::White;

		explicit operator bool() const { return type != PieceType::None; }
		char symbol() const;
	};
}