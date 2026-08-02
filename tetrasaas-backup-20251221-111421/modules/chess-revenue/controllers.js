/**
 * کنترلرهای ماژول شطرجد درآمدزا
 */

const ChessEngine = require('./engine');

class ChessRevenueControllers {
    constructor() {
        this.engine = new ChessEngine();
    }
    
    /**
     * شروع بازی جدید
     */
    async startGame(req, res) {
        try {
            const { username, difficulty = 'intermediate', gameType = 'free' } = req.body;
            
            if (!username) {
                return res.json({ 
                    success: false, 
                    error: 'نام کاربری الزامی است' 
                });
            }
            
            const gameId = `chess_game_${Date.now()}`;
            const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
            
            // اگر بازی حرفه‌ای است، بررسی موجودی سکه
            if (gameType === 'premium') {
                const user = this.getUser(username);
                if (!user || user.coins < 10) {
                    return res.json({
                        success: false,
                        error: 'برای بازی حرفه‌ای حداقل ۱۰ سکه نیاز دارید',
                        requiredCoins: 10,
                        userCoins: user ? user.coins : 0
                    });
                }
            }
            
            const game = {
                id: gameId,
                username,
                difficulty,
                gameType,
                fen,
                moves: [],
                status: 'active',
                createdAt: new Date().toISOString(),
                lastMoveAt: new Date().toISOString()
            };
            
            this.saveGame(game);
            
            res.json({
                success: true,
                gameId,
                fen,
                message: gameType === 'free' 
                    ? 'بازی رایگان شروع شد!'
                    : 'بازی حرفه‌ای شروع شد! (۱۰ سکه کسر شد)'
            });
            
        } catch (error) {
            res.json({ success: false, error: error.message });
        }
    }
    
    /**
     * دریافت حرکت موتور
     */
    async getEngineMove(req, res) {
        try {
            const { gameId, fen, difficulty = 'intermediate' } = req.query;
            
            if (!fen) {
                return res.json({ 
                    success: false, 
                    error: 'موقعیت بازی (FEN) الزامی است' 
                });
            }
            
            const move = this.engine.getBestMove(fen, difficulty);
            
            // به‌روزرسانی بازی
            if (gameId) {
                const game = this.getGame(gameId);
                if (game) {
                    game.moves.push({ fen, move: move.uci });
                    game.fen = this.engine.applyMove(fen, move.uci);
                    game.lastMoveAt = new Date().toISOString();
                    this.saveGame(game);
                }
            }
            
            res.json({
                success: true,
                move: move.uci,
                from: move.from,
                to: move.to,
                evaluation: move.evaluation,
                depth: move.depth
            });
            
        } catch (error) {
            res.json({ success: false, error: error.message });
        }
    }
    
    /**
     * پایان بازی
     */
    async endGame(req, res) {
        try {
            const { gameId, result, username } = req.body;
            
            if (!gameId || !result || !username) {
                return res.json({ 
                    success: false, 
                    error: 'پارامترهای الزامی ارسال نشده‌اند' 
                });
            }
            
            const game = this.getGame(gameId);
            if (!game) {
                return res.json({ 
                    success: false, 
                    error: 'بازی یافت نشد' 
                });
            }
            
            game.status = 'completed';
            game.result = result;
            game.completedAt = new Date().toISOString();
            
            this.saveGame(game);
            
            // به‌روزرسانی آمار کاربر
            this.updateUserStats(username, result);
            
            // اعطای سکه بر اساس نتیجه
            const coinsEarned = this.calculateCoinsEarned(result, game.difficulty);
            if (coinsEarned > 0) {
                this.addUserCoins(username, coinsEarned);
            }
            
            res.json({
                success: true,
                coinsEarned,
                message: `بازی با نتیجه ${result} به پایان رسید. ${coinsEarned} سکه دریافت کردید!`
            });
            
        } catch (error) {
            res.json({ success: false, error: error.message });
        }
    }
    
    /**
     * دریافت لیست بازی‌های کاربر
     */
    getUserGames(req, res) {
        try {
            const { username, limit = 10 } = req.query;
            
            if (!username) {
                return res.json({ 
                    success: false, 
                    error: 'نام کاربری الزامی است' 
                });
            }
            
            const games = this.getAllGames()
                .filter(game => game.username === username)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, parseInt(limit));
            
            res.json({
                success: true,
                games,
                total: games.length
            });
            
        } catch (error) {
            res.json({ success: false, error: error.message });
        }
    }
    
    /**
     * دریافت رده‌بندی کاربران
     */
    getLeaderboard(req, res) {
        try {
            const { limit = 50 } = req.query;
            
            const users = this.getAllUsers();
            const leaderboard = Object.values(users)
                .filter(user => user.gamesPlayed > 0)
                .map(user => ({
                    username: user.username,
                    rating: user.rating,
                    gamesPlayed: user.gamesPlayed,
                    wins: user.wins,
                    losses: user.losses,
                    winRate: user.gamesPlayed > 0 
                        ? Math.round((user.wins / user.gamesPlayed) * 100) 
                        : 0,
                    coins: user.coins,
                    level: this.getUserLevel(user.rating)
                }))
                .sort((a, b) => b.rating - a.rating)
                .slice(0, parseInt(limit));
            
            res.json({
                success: true,
                leaderboard,
                lastUpdated: new Date().toISOString()
            });
            
        } catch (error) {
            res.json({ success: false, error: error.message });
        }
    }
    
    // ==================== توابع کمکی ====================
    
    getUser(username) {
        try {
            const users = JSON.parse(fs.readFileSync(
                path.join(__dirname, '../../data/chess/users.json'), 
                'utf8'
            ));
            return users[username];
        } catch (error) {
            return null;
        }
    }
    
    getAllUsers() {
        try {
            return JSON.parse(fs.readFileSync(
                path.join(__dirname, '../../data/chess/users.json'), 
                'utf8'
            ));
        } catch (error) {
            return {};
        }
    }
    
    getGame(gameId) {
        try {
            const games = JSON.parse(fs.readFileSync(
                path.join(__dirname, '../../data/chess/games.json'), 
                'utf8'
            ));
            return games.find(game => game.id === gameId);
        } catch (error) {
            return null;
        }
    }
    
    getAllGames() {
        try {
            return JSON.parse(fs.readFileSync(
                path.join(__dirname, '../../data/chess/games.json'), 
                'utf8'
            ));
        } catch (error) {
            return [];
        }
    }
    
    saveGame(game) {
        try {
            const games = this.getAllGames();
            const index = games.findIndex(g => g.id === game.id);
            
            if (index !== -1) {
                games[index] = game;
            } else {
                games.push(game);
            }
            
            fs.writeFileSync(
                path.join(__dirname, '../../data/chess/games.json'),
                JSON.stringify(games, null, 2)
            );
        } catch (error) {
            console.error('خطا در ذخیره بازی:', error.message);
        }
    }
    
    updateUserStats(username, result) {
        try {
            const users = this.getAllUsers();
            const user = users[username];
            
            if (!user) return;
            
            user.gamesPlayed = (user.gamesPlayed || 0) + 1;
            
            switch (result) {
                case 'win':
                    user.wins = (user.wins || 0) + 1;
                    user.rating = Math.min(3000, (user.rating || 1200) + 20);
                    break;
                case 'loss':
                    user.losses = (user.losses || 0) + 1;
                    user.rating = Math.max(800, (user.rating || 1200) - 15);
                    break;
                case 'draw':
                    user.rating = (user.rating || 1200) + 5;
                    break;
            }
            
            users[username] = user;
            
            fs.writeFileSync(
                path.join(__dirname, '../../data/chess/users.json'),
                JSON.stringify(users, null, 2)
            );
        } catch (error) {
            console.error('خطا در به‌روزرسانی آمار کاربر:', error.message);
        }
    }
    
    addUserCoins(username, coins) {
        try {
            const users = this.getAllUsers();
            const user = users[username];
            
            if (!user) return;
            
            user.coins = (user.coins || 0) + coins;
            users[username] = user;
            
            fs.writeFileSync(
                path.join(__dirname, '../../data/chess/users.json'),
                JSON.stringify(users, null, 2)
            );
        } catch (error) {
            console.error('خطا در افزایش سکه کاربر:', error.message);
        }
    }
    
    calculateCoinsEarned(result, difficulty) {
        const baseCoins = {
            'win': { beginner: 10, intermediate: 20, advanced: 50, expert: 100 },
            'loss': { beginner: 2, intermediate: 5, advanced: 10, expert: 20 },
            'draw': { beginner: 5, intermediate: 10, advanced: 25, expert: 50 }
        };
        
        return baseCoins[result]?.[difficulty] || 0;
    }
    
    getUserLevel(rating) {
        if (rating >= 2000) return 'استاد';
        if (rating >= 1600) return 'پیشرفته';
        if (rating >= 1400) return 'متوسط';
        return 'مبتدی';
    }
}

module.exports = ChessRevenueControllers;
