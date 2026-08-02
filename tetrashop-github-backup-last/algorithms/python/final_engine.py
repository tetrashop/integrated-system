import chess

class FinalChessEngine:
    def __init__(self, depth=3):
        self.board = chess.Board()
        self.depth = depth
    
    def get_best_move(self):
        """بهترین حرکت با Alpha-Beta و ارزیابی پیشرفته"""
        best_move = None
        best_value = -float('inf')
        alpha = -float('inf')
        beta = float('inf')
        
        # مرتب‌سازی حرکات برای بهره‌وری بیشتر
        moves = list(self.board.legal_moves)
        
        for move in moves:
            self.board.push(move)
            move_value = self._minimax(self.depth - 1, False, alpha, beta)
            self.board.pop()
            
            if move_value > best_value:
                best_value = move_value
                best_move = move
            
            alpha = max(alpha, best_value)
            if beta <= alpha:
                break
        
        return best_move or moves[0]
    
    def _minimax(self, depth, maximizing, alpha, beta):
        if depth == 0 or self.board.is_game_over():
            return self._evaluate_position()
        
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
    
    def _evaluate_position(self):
        """ارزیابی کامل موقعیت"""
        if self.board.is_checkmate():
            return -1000 if self.board.turn else 1000
        if self.board.is_stalemate() or self.board.is_insufficient_material():
            return 0
        
        piece_values = {
            chess.PAWN: 100, chess.KNIGHT: 320, chess.BISHOP: 330,
            chess.ROOK: 500, chess.QUEEN: 900, chess.KING: 0
        }
        
        score = 0
        
        # ارزش مهره‌ها
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
    
    def play_game(self, moves=5):
        """بازی خودکار برای تست"""
        print("♟️ شروع بازی خودکار")
        for i in range(moves):
            print(f"\n--- حرکت {i+1} ---")
            self.display()
            move = self.get_best_move()
            self.make_move(move)
            print(f"حرکت: {move}")
        
        print(f"\n🎯 بازی پس از {moves} حرکت:")
        self.display()
