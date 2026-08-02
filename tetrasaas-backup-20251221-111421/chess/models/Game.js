/**
 * مدل بازی شطرجد
 */

class Game {
    constructor() {
        this.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        this.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
        this.moves = [];
        this.players = {
            white: { name: 'بازیکن سفید', type: 'human' },
            black: { name: 'Chess AI', type: 'ai' }
        };
        this.difficulty = 'intermediate';
        this.status = 'active'; // active, checkmate, stalemate, draw
        this.winner = null;
        this.createdAt = new Date();
        this.lastMoveAt = new Date();
        this.timeControl = {
            white: 600, // 10 دقیقه
            black: 600,
            increment: 0
        };
        this.metadata = {
            event: 'بازی دوستانه',
            site: 'TetraShop Chess',
            date: new Date().toISOString().split('T')[0],
            round: '1'
        };
    }

    addMove(move) {
        this.moves.push({
            move: move.move,
            fen: move.fen,
            evaluation: move.evaluation,
            time: move.time || 0,
            timestamp: new Date()
        });
        this.lastMoveAt = new Date();
    }

    getPGN() {
        let pgn = '';
        
        // هدرها
        pgn += `[Event "${this.metadata.event}"]\n`;
        pgn += `[Site "${this.metadata.site}"]\n`;
        pgn += `[Date "${this.metadata.date}"]\n`;
        pgn += `[Round "${this.metadata.round}"]\n`;
        pgn += `[White "${this.players.white.name}"]\n`;
        pgn += `[Black "${this.players.black.name}"]\n`;
        pgn += `[Result "*"]\n`;
        pgn += `[WhiteElo "?"]\n`;
        pgn += `[BlackElo "?"]\n\n`;
        
        // حرکات
        for (let i = 0; i < this.moves.length; i += 2) {
            const moveNumber = Math.floor(i / 2) + 1;
            const whiteMove = this.moves[i]?.move || '';
            const blackMove = this.moves[i + 1]?.move || '';
            
            pgn += `${moveNumber}. ${whiteMove} ${blackMove} `;
        }
        
        return pgn;
    }

    toJSON() {
        return {
            id: this.id,
            fen: this.fen,
            moves: this.moves,
            players: this.players,
            difficulty: this.difficulty,
            status: this.status,
            winner: this.winner,
            createdAt: this.createdAt,
            lastMoveAt: this.lastMoveAt,
            timeControl: this.timeControl,
            metadata: this.metadata,
            pgn: this.getPGN()
        };
    }
}

module.exports = Game;
