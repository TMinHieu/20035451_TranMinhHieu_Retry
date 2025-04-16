const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3002;

// === Cấu hình giới hạn ===
const LIMIT = 2; // tối đa 2 lần
const WINDOW_TIME = 20 * 1000; // 20 giây tính bằng ms

let requestLog = []; // lưu timestamp của các lần gọi

app.get('/goi-service2', async (req, res) => {
  const now = Date.now();

  // Xoá các request cũ ngoài khoảng thời gian 20 giây
  requestLog = requestLog.filter(ts => now - ts < WINDOW_TIME);

  if (requestLog.length >= LIMIT) {
    const timeToReset = WINDOW_TIME - (now - requestLog[0]);
    const giayConLai = Math.ceil(timeToReset / 1000);

    res.status(429).send(`Vượt quá số lần gọi! Vui lòng thử lại sau ${giayConLai} giây.`);
    return;
  }

  // Nếu chưa vượt, thêm thời gian gọi và gọi tới Service 2
  requestLog.push(now);

  try {
    const response = await axios.get('http://localhost:3001/goi');
    res.send(`Service2 trả về: ${response.data}`);
  } catch (err) {
    res.status(500).send('Không kết nối được tới Service 2');
  }
});

app.listen(PORT, () => {
  console.log(`Service 3 đang chạy tại http://localhost:${PORT}`);
});
