import chess

class AdvancedChessEngine:
    def __init__(self, depth=3):
        self.board = chess.Board()
        self.depth = depth
    
    def get_best_move(self):
        best_move = None
        best_value = -float('inf')
        alpha = -float('inf')
        beta = float('inf')
        
        for move in self.board.legal_moves:
            self.board.push(move)
            move_value = self._minimax(self.depth - 1, False, alpha, beta)
            self.board.pop()
            
            if move_value > best_value:
                best_value = move_value
                best_move = move
            
            alpha = max(alpha, best_value)
        
        return best_move or list(self.board.legal_moves)[0]
    
    def _minimax(self, depth, maximizing, alpha, beta):
        if depth == 0 or self.board.is_game_over():
            return self._evaluate_advanced()
        
        if maximizing:
            max_eval = -float('inf')
            for move in self.board.legal_moves:
                self.board.push(move)
                eval = self._minimax(depth - 1, False, alpha, beta)
                self.board.pop()
                max_eval = max(max_eval, eval)
                alpha = max(alpha, eval)
                if beta <= alpha:
                    break
            return max_eval
        else:
            min_eval = float('inf')
            for move in self.board.legal_moves:
                self.board.push(move)
                eval = self._minimax(depth - 1, True, alpha, beta)
                self.board.pop()
                min_eval = min(min_eval, eval)
                beta = min(beta, eval)
                if beta <= alpha:
                    break
            return min_eval
    
    def _evaluate_advanced(self):
        piece_values = {
            chess.PAWN: 10,
            chess.KNIGHT: 30,
            chess.BISHOP: 30,
            chess.ROOK: 50,
            chess.QUEEN: 90,
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
