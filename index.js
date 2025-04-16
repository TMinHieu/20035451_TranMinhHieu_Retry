const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

let counter = 0; // Dùng chung cho cả 2 trường hợp nếu muốn tách thì tách riêng ra
let counterNhieuLan = 0; // Đếm số lần gọi /goi-nhieu-lan
let cbOpen = false;

// Trường hợp 1: Gọi 5 lần, lần thứ 6 thì hiển thị CB OPEN
app.get('/goi-tung-lan', async (req, res) => {
  if (cbOpen) {
    return res.send('CB OPEN – Dịch vụ đã đóng, không thể gọi Service 2 nữa.');
  }

  counter++;

  if (counter <= 5) {
    try {
      await axios.get('http://localhost:3001/goi');
      res.send(`Đã gọi tới Service 2 lần thứ ${counter}`);
    } catch (err) {
      res.status(500).send('Không thể kết nối tới Service 2');
    }
  } else {
    // Bật CB OPEN và ngừng các yêu cầu tiếp theo
    cbOpen = true;
    res.send('CB OPEN – Đã gọi quá 5 lần, dịch vụ đóng lại.');
  }
});

// Trường hợp 2: Chỉ tới lần thứ 6 mới gọi nhiều lần đến service 2
app.get('/goi-nhieu-lan', async (req, res) => {
  const tongSoLan = 6;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked'); // Cho phép gửi từng khúc

  res.write(`Bắt đầu gọi tới Service 2 ${tongSoLan} lần...\n`);

  for (let i = 1; i <= tongSoLan; i++) {
    res.write(`Lần ${i}: Đang cố gắng kết nối tới Service 2...\n`);
    res.flush?.(); // flush nếu server hỗ trợ

    await new Promise(resolve => setTimeout(resolve, 1000)); // delay 1s

    if (i < tongSoLan) {
      res.write(`Lần ${i}: Không kết nối được tới Service 2\n`);
    } else {
      try {
        const response = await axios.get('http://localhost:3001/goi');
        res.write(`Lần ${i}: Kết nối thành công - ${response.data}\n`);
      } catch (err) {
        res.write(`Lần ${i}: Gọi thất bại - ${err.message}\n`);
      }
    }

    res.flush?.(); // Gửi ra ngay lập tức nếu có flush()
  }

  res.write('Hoàn tất gọi service 2.\n');
  res.end();
});

app.listen(PORT, () => {
  console.log(`Service 1 đang chạy tại http://localhost:${PORT}`);
});
