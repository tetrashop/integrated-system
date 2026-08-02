import chess
import random

class ChessAIEngine:
    def __init__(self):
        self.board = chess.Board()
    
    def get_ai_move(self):
        """حرکت هوش مصنوعی - انتخاب تصادفی از بین حرکات قانونی"""
        legal_moves = list(self.board.legal_moves)
        return random.choice(legal_moves) if legal_moves else None
    
    def make_move(self, move):
        self.board.push(move)
    
    def display(self):
        print("\n" + str(self.board))
    
    def play_ai_vs_ai(self, moves=10):
        """بازی هوش مصنوعی مقابل خودش"""
        print("🤖 بازی AI مقابل AI")
        self.display()
        
        for i in range(moves):
            if self.board.is_game_over():
                print(f"🎯 بازی تمام شد! نتیجه: {self.board.result()}")
                break
            
            move = self.get_ai_move()
            player = "سفید" if self.board.turn == chess.WHITE else "سیاه"
            print(f"\nحرکت {i+1} ({player}): {move}")
            self.make_move(move)
            self.display()

# تست
engine = ChessAIEngine()
engine.play_ai_vs_ai()
