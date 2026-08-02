import chess

class SmartChessEngine:
    def __init__(self, depth=2):  # عمق کم برای سرعت
        self.board = chess.Board()
        self.depth = depth
    
    def get_best_move(self):
        """پیدا کردن بهترین حرکت با Minimax ساده"""
        best_move = None
        best_value = -float('inf')
        
        for move in self.board.legal_moves:
            self.board.push(move)
            move_value = self._minimax(self.depth - 1, False)
            self.board.pop()
            
            if move_value > best_value:
                best_value = move_value
                best_move = move
        
        return best_move or list(self.board.legal_moves)[0]
    
    def _minimax(self, depth, maximizing):
        """الگوریتم Minimax ساده"""
        if depth == 0 or self.board.is_game_over():
            return self._evaluate_board()
        
        if maximizing:
            max_eval = -float('inf')
            for move in self.board.legal_moves:
                self.board.push(move)
                eval = self._minimax(depth - 1, False)
                self.board.pop()
                max_eval = max(max_eval, eval)
            return max_eval
        else:
            min_eval = float('inf')
            for move in self.board.legal_moves:
                self.board.push(move)
                eval = self._minimax(depth - 1, True)
                self.board.pop()
                min_eval = min(min_eval, eval)
            return min_eval
    
    def _evaluate_board(self):
        """ارزیابی ساده موقعیت"""
        piece_values = {
            chess.PAWN: 1,
            chess.KNIGHT: 3,
            chess.BISHOP: 3,
            chess.ROOK: 5,
            chess.QUEEN: 9,
            chess.KING: 0
        }
        
        score = 0
        for square in chess.SQUARES:
            piece = self.board.piece_at(square)
            if piece:
                value = piece_values[piece.piece_type]
                score += value if piece.color == chess.WHITE else -value
        
        return score
    
    def make_move(self, move):
        self.board.push(move)
    
    def display(self):
        print(self.board)
