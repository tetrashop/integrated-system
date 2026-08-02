/**
 * سرور API شطرجد TetraShop
 * پورت: 7555
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const ChessEngine = require('../engine/ChessEngine');
const Game = require('../models/Game');

const app = express();
const PORT = process.env.PORT || 7500;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// موتور شطرجد
const engine = new ChessEngine();
const activeGames = new Map();

// مسیر اصلی - رابط کاربری
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API وضعیت
app.get('/api/status', (req, res) => {
    res.json({
        name: 'TetraShop Chess Engine',
        version: '1.0.0',
        status: 'running',
        port: PORT,
        engine: 'JavaScript Chess AI v1.0',
        features: [
            'موتور شطرجد با Minimax',
            'هرس آلفا-بتا',
            'کتاب افتتاحیه',
            '4 سطح دشواری',
            'تحلیل موقعیت',
            'ذخیره PGN'
        ],
        endpoints: [
            { method: 'GET', path: '/api/status', description: 'وضعیت سرور' },
            { method: 'POST', path: '/api/game/new', description: 'شروع بازی جدید' },
            { method: 'POST', path: '/api/game/move', description: 'انجام حرکت' },
            { method: 'GET', path: '/api/game/:id', description: 'دریافت اطلاعات بازی' },
            { method: 'POST', path: '/api/analyze', description: 'تحلیل موقعیت' },
            { method: 'GET', path: '/api/engine/move', description: 'دریافت حرکت از موتور' }
        ],
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// شروع بازی جدید
app.post('/api/game/new', (req, res) => {
    const { difficulty = 'intermediate', playerName = 'بازیکن' } = req.body;
    
    const game = new Game();
    game.players.white.name = playerName;
    game.difficulty = difficulty;
    
    activeGames.set(game.id, game);
    
    res.json({
        success: true,
        gameId: game.id,
        fen: game.fen,
        players: game.players,
        difficulty: game.difficulty
    });
});

// دریافت حرکت از موتور
app.get('/api/engine/move', (req, res) => {
    const { fen, level = 'intermediate' } = req.query;
    
    if (!fen) {
        return res.status(400).json({ error: 'پارامتر fen الزامی است' });
    }
    
    const depths = {
        beginner: 3,
        intermediate: 8,
        advanced: 12,
        expert: 16
    };
    
    const depth = depths[level] || 8;
    
    try {
        const result = engine.getBestMove(fen.split(' ')[0], depth);
        
        res.json({
            success: true,
            move: engine.moveToUCI(result.move),
            fen: fen,
            evaluation: result.evaluation,
            depth: result.depth,
            nodes: result.nodes,
            time: result.time,
            pv: result.pv
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// تحلیل موقعیت
app.post('/api/analyze', (req, res) => {
    const { fen, depth = 15 } = req.body;
    
    if (!fen) {
        return res.status(400).json({ error: 'پارامتر fen الزامی است' });
    }
    
    try {
        const analysis = engine.analyzePosition(fen.split(' ')[0], depth);
        
        res.json({
            success: true,
            fen: fen,
            evaluation: analysis.evaluation,
            bestMove: analysis.bestMove,
            bestLine: analysis.bestLine,
            moves: analysis.moves,
            depth: analysis.depth,
            nodes: analysis.nodes,
            time: analysis.time
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// انجام حرکت در بازی
app.post('/api/game/move', (req, res) => {
    const { gameId, move } = req.body;
    
    if (!gameId || !move) {
        return res.status(400).json({ error: 'پارامترهای gameId و move الزامی هستند' });
    }
    
    const game = activeGames.get(gameId);
    if (!game) {
        return res.status(404).json({ error: 'بازی یافت نشد' });
    }
    
    // اضافه کردن حرکت به بازی
    game.addMove({
        move: move,
        fen: game.fen,
        timestamp: new Date()
    });
    
    // دریافت حرکت موتور
    const engineResult = engine.getBestMove(game.fen.split(' ')[0], 8);
    const engineMove = engine.moveToUCI(engineResult.move);
    
    game.addMove({
        move: engineMove,
        fen: game.fen,
        evaluation: engineResult.evaluation,
        timestamp: new Date()
    });
    
    res.json({
        success: true,
        playerMove: move,
        engineMove: engineMove,
        evaluation: engineResult.evaluation,
        game: game.toJSON()
    });
});

// دریافت اطلاعات بازی
app.get('/api/game/:id', (req, res) => {
    const game = activeGames.get(req.params.id);
    
    if (!game) {
        return res.status(404).json({ error: 'بازی یافت نشد' });
    }
    
    res.json({
        success: true,
        game: game.toJSON()
    });
});

// لیست بازی‌های فعال
app.get('/api/games/active', (req, res) => {
    const games = Array.from(activeGames.values()).map(game => ({
        id: game.id,
        players: game.players,
        moves: game.moves.length,
        status: game.status,
        createdAt: game.createdAt
    }));
    
    res.json({
        success: true,
        count: games.length,
        games: games
    });
});

// ذخیره بازی
app.post('/api/game/save', (req, res) => {
    const { gameId } = req.body;
    
    const game = activeGames.get(gameId);
    if (!game) {
        return res.status(404).json({ error: 'بازی یافت نشد' });
    }
    
    // در نسخه واقعی، در دیتابیس ذخیره می‌شود
    const savedGame = {
        ...game.toJSON(),
        savedAt: new Date()
    };
    
    res.json({
        success: true,
        message: 'بازی ذخیره شد',
        game: savedGame
    });
});

// تست موتور
app.get('/api/test/engine', (req, res) => {
    const testFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
    
    try {
        const result = engine.getBestMove(testFEN, 3);
        
        res.json({
            success: true,
            test: 'موتور شطرجد',
            status: 'فعال',
            move: engine.moveToUCI(result.move),
            evaluation: result.evaluation,
            depth: result.depth
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// راه‌اندازی سرور
app.listen(PORT, () => {
    console.log('');
    console.log('='.repeat(60));
    console.log('♟️  موتور شطرجد TetraShop راه‌اندازی شد!');
    console.log('='.repeat(60));
    console.log('');
    console.log('📊 اطلاعات سرور:');
    console.log(`├── 🏷️  نام: TetraShop Chess Engine`);
    console.log(`├── 🚀 نسخه: 1.0.0`);
    console.log(`├── 📍 پورت: ${PORT}`);
    console.log(`├── 🤖 موتور: JavaScript Chess AI v1.0`);
    console.log(`└── 🕒 زمان: ${new Date().toLocaleString('fa-IR')}`);
    console.log('');
    console.log('🌐 آدرس‌های مهم:');
    console.log(`├── 🏠 صفحه اصلی: http://localhost:${PORT}`);
    console.log(`├── 📊 API وضعیت: http://localhost:${PORT}/api/status`);
    console.log(`├── 🎮 بازی جدید: http://localhost:${PORT}/api/game/new`);
    console.log(`└── 🔍 تحلیل: http://localhost:${PORT}/api/analyze`);
    console.log('');
    console.log('✨ ویژگی‌ها:');
    console.log('├── ♟️  موتور Minimax با هرس آلفا-بتا');
    console.log('├── 📚 کتاب افتتاحیه');
    console.log('├── 📊 4 سطح دشواری');
    console.log('├── 🔍 تحلیل موقعیت');
    console.log('└── 💾 ذخیره PGN');
    console.log('');
    console.log('🚀 برای شروع:');
    console.log(`   مرورگر را باز کرده و به آدرس http://localhost:${PORT} بروید`);
    console.log('');
    console.log('='.repeat(60));
});
