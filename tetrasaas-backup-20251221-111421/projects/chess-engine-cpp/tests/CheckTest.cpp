#include "gtest/gtest.h"  
#include "../src/Board/Board.h"  

TEST(CheckTest, KingInCheck) {
	Board board;
	board.set_from_fen("4k3/8/8/8/8/8/4r3/4K3 w - - 0 1");
	ASSERT_TRUE(board.is_in_check(true)); // شاه سفید در کیش  
}

TEST(CheckmateTest, Foolsmate) {
	Board board;
	board.set_from_fen("rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 0 1");
	ASSERT_TRUE(board.is_checkmate(true)); // مات در دو حرکت!  
}