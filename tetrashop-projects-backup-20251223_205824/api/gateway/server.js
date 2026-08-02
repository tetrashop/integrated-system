const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// لیست ۲۳ سرویس
const services = [
  {id: 1, name: 'پردازش زبان طبیعی', category: 'هوش مصنوعی', price: 299000, status: 'فعال'},
  {id: 2, name: 'تبدیل تصویر', category: 'گرافیک', price: 99000, status: 'فعال'}
];

app.get('/health', (req, res) => {
  res.json({status: 'healthy', services: services.length});
});

app.get('/api/services', (req, res) => {
  res.json({success: true, data: services});
});

app.listen(PORT, () => {
  console.log('Tetrashop Gateway running on port ' + PORT);
});
