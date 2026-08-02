# chess_engine/core/engine.py
import chess
import chess.engine
from typing import List, Tuple
import numpy as np

class IntelligentChessEngine:
    def __init__(self, depth: int = 4):
        self.board = chess.Board()
        self.depth = depth
        self.opening_book = self._load_opening_book()
    
    def get_best_move(self, time_limit: float = 2.0) -> chess.Move:
        """پیدا کردن بهترین حرکت با الگوریتم Minimax و Alpha-Beta Pruning"""
        if self.board.fullmove_number < 10:
            # استفاده از کتاب گشایش در شروع بازی
            opening_move = self._get_opening_move()
            if opening_move:
                return opening_move
        
        best_move = self._minimax(self.depth, -float('inf'), float('inf'), True)[1]
        return best_move or list(self.board.legal_moves)[0]
    
    def _minimax(self, depth: int, alpha: float, beta: float, maximizing: bool) -> Tuple[float, chess.Move]:
        """الگوریتم Minimax با هرس آلفا-بتا"""
        if depth == 0 or self.board.is_game_over():
            return self._evaluate_board(), None
        
        best_move = None
        if maximizing:
            max_eval = -float('inf')
            for move in self.board.legal_moves:
                self.board.push(move)
                eval = self._minimax(depth-1, alpha, beta, False)[0]
                self.board.pop()
                
                if eval > max_eval:
                    max_eval = eval
                    best_move = move
                
                alpha = max(alpha, eval)
                if beta <= alpha:
                    break
            return max_eval, best_move
        else:
            min_eval = float('inf')
            for move in self.board.legal_moves:
                self.board.push(move)
                eval = self._minimax(depth-1, alpha, beta, True)[0]
                self.board.pop()
                
                if eval < min_eval:
                    min_eval = eval
                    best_move = move
                
                beta = min(beta, eval)
                if beta <= alpha:
                    break
            return min_eval, best_move
    
    def _evaluate_board(self) -> float:
        """ارزیابی موقعیت棋盘 با وزن‌دهی به مهره‌ها"""
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

    def _load_opening_book(self) -> dict:
        """بارگذاری کتاب گشایش‌های شطرنج"""
        return {
            "e2e4": "e7e5", "e2e4 c7c5": "g1f3",  # Sicilian Defense
            "d2d4": "d7d5", "d2d4 g8f6": "c2c4",  # Queen's Gambit
              }
