const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Gateway is working!' });
});

app.listen(PORT, () => {
  console.log(`✅ Gateway running on http://localhost:${PORT}`);
});
