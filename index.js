const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const ordersFile = './orders.json';

// 读取订单
app.get('/orders', (req, res) => {
  fs.readFile(ordersFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: '读取失败' });
    res.json(JSON.parse(data || '[]'));
  });
});

// 保存订单
app.post('/orders', (req, res) => {
  const { orderCode, games } = req.body;
  if (!orderCode || !games) return res.status(400).json({ error: '缺少参数' });

  fs.readFile(ordersFile, 'utf8', (err, data) => {
    const orders = err ? [] : JSON.parse(data || '[]');
    orders.push({ orderCode, games });
    fs.writeFile(ordersFile, JSON.stringify(orders, null, 2), err => {
      if (err) return res.status(500).json({ error: '保存失败' });
      res.json({ success: true });
    });
  });
});

app.listen(port, () => {
  console.log(`服务器已启动：http://localhost:${port}`);
});
