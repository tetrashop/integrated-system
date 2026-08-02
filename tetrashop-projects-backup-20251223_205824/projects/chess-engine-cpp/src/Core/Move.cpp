#include "Move.h"
#include <sstream>

// سازنده پیش‌فرض (حرکت نامعتبر)
Move::Move() : startPos(-1, -1), endPos(-1, -1), piece(PieceType::None),
capturedPiece(PieceType::None), promotion(PieceType::None),
flag(MoveFlag::None) {}

// سازنده برای حرکت‌های معمولی یا قلعه/آنپاسان
Move::Move(Position start, Position end, PieceType p, PieceType captured, MoveFlag f)
	: startPos(start), endPos(end), piece(p), capturedPiece(captured),
	promotion(PieceType::None), flag(f) {}

// سازنده برای حرکت ارتقاء پیاده
Move::Move(Position start, Position end, PieceType p, PieceType captured,
	PieceType promo, MoveFlag f)
	: startPos(start), endPos(end), piece(p), capturedPiece(captured),
	promotion(promo), flag(f) {}

// --- متدهای دسترسی ---
Position Move::getStart() const { return startPos; }
Position Move::getEnd() const { return endPos; }
PieceType Move::getPiece() const { return piece; }
PieceType Move::getCapturedPiece() const { return capturedPiece; }
PieceType Move::getPromotion() const { return promotion; }
MoveFlag Move::getFlag() const { return flag; }

// بررسی معتبر بودن حرکت
bool Move::isValid() const {
	return (startPos.row >= 0 && startPos.row < 8 &&
		startPos.col >= 0 && startPos.col < 8 &&
		endPos.row >= 0 && endPos.row < 8 &&
		endPos.col >= 0 && endPos.col < 8);
}

// بررسی نوع حرکت
bool Move::isCapture() const { return flag == MoveFlag::Capture || capturedPiece != PieceType::None; }
bool Move::isPromotion() const { return flag == MoveFlag::Promotion; }
bool Move::isCastling() const { return flag == MoveFlag::Castling; }
bool Move::isEnPassant() const { return flag == MoveFlag::EnPassant; }

// تبدیل به نماد شطرنج
std::string Move::toString() const {
	if (!isValid()) return "Invalid Move";

	std::stringstream ss;
	char startCol = 'a' + startPos.col;
	char startRow = '1' + startPos.row;
	char endCol = 'a' + endPos.col;
	char endRow = '1' + endPos.row;

	ss << startCol << startRow << endCol << endRow;

	// اگر ارتقاء پیاده باشد، نماد مهره ارتقاء اضافه می‌شود (مثال: e7e8q)
	if (isPromotion()) {
		switch (promotion) {
		case PieceType::Queen: ss << 'q'; break;
		case PieceType::Rook: ss << 'r'; break;
		case PieceType::Bishop: ss << 'b'; break;
		case PieceType::Knight: ss << 'n'; break;
		default: break;
		}
	}
	return ss.str();
}

// عملگرهای مقایسه
bool Move::operator==(const Move& other) const {
	return (startPos.row == other.startPos.row &&
		startPos.col == other.startPos.col &&
		endPos.row == other.endPos.row &&
		endPos.col == other.endPos.col &&
		promotion == other.promotion);
}

bool Move::operator!=(const Move& other) const {
	return !(*this == other);
}


std::string Move::toString() const {
	// تبدیل به نماد استاندارد شطرنج (UCI)
	std::string str;
	str += (char)('a' + from.y);
	str += (char)('8' - from.x);
	str += (char)('a' + to.y);
	str += (char)('8' - to.x);

	if (promotion != Piece::None)
		str += tolower(pieceToChar(promotion));

	return str;
}

bool Move::isValid() const {
	return from.x >= 0 && from.x < 8 &&
		from.y >= 0 && from.y < 8 &&
		to.x >= 0 && to.x < 8 &&
		to.y >= 0 && to.y < 8;
}
