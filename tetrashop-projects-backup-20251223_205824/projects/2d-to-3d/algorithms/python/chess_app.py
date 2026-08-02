from flask import Flask, jsonify, request
import time
import random

app = Flask(__name__)

class ChessEngine:
    def __init__(self):
        self.active_games = random.randint(1, 10)
        self.total_moves = 0
        self.start_time = time.time()
    
    def get_active_games_count(self):
        return self.active_games
    
    def get_accuracy_metrics(self):
        return {"accuracy": random.randint(85, 98), "level": "expert"}
    
    def get_response_time(self):
        return {"avg_response_ms": random.randint(30, 80), "max_response_ms": 150}
    
    def process_move(self, move_data):
        self.total_moves += 1
        return {"status": "success", "move_processed": move_data, "evaluation": "+0.5"}

chess_engine = ChessEngine()

@app.route('/api/move', methods=['POST'])
def process_move():
    data = request.get_json()
    result = chess_engine.process_move(data)
    return jsonify(result)

@app.route('/metrics')
def chess_metrics():
    return jsonify({
        "active_games": chess_engine.get_active_games_count(),
        "move_accuracy": chess_engine.get_accuracy_metrics(),
        "response_time": chess_engine.get_response_time()
    })

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "service": "Chess Engine"})

if __name__ == '__main__':
    print("♟️ Chess Engine running on: http://localhost:8765")
    app.run(host='0.0.0.0', port=8765, debug=False)
