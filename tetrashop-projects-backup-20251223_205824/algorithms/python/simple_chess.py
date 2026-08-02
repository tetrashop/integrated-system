import chess

class SimpleChessEngine:
    def __init__(self):
        self.board = chess.Board()
        print("✅ موتور شطرنج ساده فعال شد!")
    
    def get_best_move(self):
        """پیدا کردن بهترین حرکت (ساده)"""
        return list(self.board.legal_moves)[0]
    
    def make_move(self, move):
        """انجام حرکت"""
        self.board.push(move)
        print(f"انجام حرکت: {move}")
    
    def display_board(self):
        """نمایش صفحه شطرنج"""
        print("\n" + str(self.board) + "\n")
    
    def play_demo(self):
        """نمایش یک بازی دمو"""
        print("🎲 شروع بازی دمو...")
        self.display_board()
        
        # چند حرکت نمونه
        moves = list(self.board.legal_moves)[:3]
        for i, move in enumerate(moves):
            print(f"حرکت {i+1}: {move}")
            self.make_move(move)
            self.display_board()
            
            if self.board.is_game_over():
                print("🎯 بازی تمام شد!")
                break

# تست موتور
if __name__ == "__main__":
    engine = SimpleChessEngine()
    engine.play_demo()
