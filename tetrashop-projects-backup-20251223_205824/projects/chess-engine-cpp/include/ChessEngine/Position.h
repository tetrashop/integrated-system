#pragma once

struct Position {
	int x; // 0-7 (ستون)
	int y; // 0-7 (ردیف)

	bool operator==(const Position& other) const {
		return x == other.x && y == other.y;
	}

	bool isValid() const {
		return x >= 0 && x < 8 && y >= 0 && y < 8;
	}
};