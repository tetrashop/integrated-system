import chess

class SimpleChessEngine:
    def __init__(self):
        self.board = chess.Board()
    
    def get_best_move(self):
        """ساده‌ترین نسخه - اولین حرکت قانونی"""
        return list(self.board.legal_moves)[0]
    
    def make_move(self, move):
        """انجام حرکت"""
        self.board.push(move)
    
    def display(self):
        """نمایش صفحه"""
        print(self.board)
        
    def get_board_unicode(self):
        """نمایش صفحه با یونیکد"""
        return str(self.board)
