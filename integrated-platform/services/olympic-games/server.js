// سرور فوری تترا المپیک
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/status', (req, res) => {
    res.json({
        status: "فعال",
        version: "المپیک 3.0",
        time: new Date().toLocaleString('fa-IR')
    });
});

app.listen(PORT, () => {
    console.log(`🏆 تترا المپیک: http://localhost:${PORT}`);
});
