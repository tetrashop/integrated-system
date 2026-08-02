import chess

class SimpleChessEngine:
    def __init__(self):
        self.board = chess.Board()
        print("✅ موتور شطرنج ساده فعال شد!")
    
    def get_legal_moves(self):
        """لیست حرکات قانونی فعلی"""
        return list(self.board.legal_moves)
    
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
        
        # حداکثر ۵ حرکت
        for i in range(5):
            if self.board.is_game_over():
                print("🎯 بازی تمام شد!")
                break
                
            legal_moves = self.get_legal_moves()
            if not legal_moves:
                break
                
            move = legal_moves[0]  # اولین حرکت قانونی
            print(f"حرکت {i+1}: {move}")
            self.make_move(move)
            self.display_board()

# تست موتور
if __name__ == "__main__":
    engine = SimpleChessEngine()
    engine.play_demo()
