/**
 * سرور مستقل شطرجد برای ادغام با TetraShop
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = 7600;

app.use(express.static(path.join(__dirname)));

// API شطرجد
app.get('/api/status', (req, res) => {
    res.json({
        name: "TetraShop Chess",
        version: "2.5.0",
        integrated: true,
        endpoints: {
            dashboard: "/chess",
            api: "/chess/api",
            game: "/chess/game"
        }
    });
});

app.get('/api/game/status', (req, res) => {
    res.json({
        activeGames: 12,
        onlinePlayers: 45,
        revenueToday: 2500000,
        monthlyProjection: 9500000
    });
});

// صفحه اصلی شطرجد
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`♟️  شطرجد TetraShop در حال اجرا روی پورت ${PORT}`);
    console.log(`🌐 آدرس: http://localhost:${PORT}`);
});
