const express = require('express');
const app = express();
const PORT = 3001;

app.get('/goi', (req, res) => {
  const now = new Date().toLocaleTimeString();
  res.send(`Service 2 đã nhận được yêu cầu lúc ${now}`);
});

app.listen(PORT, () => {
  console.log(`Service 2 đang chạy tại http://localhost:${PORT}`);
});
