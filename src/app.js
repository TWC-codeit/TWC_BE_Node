const express = require('express');
const app = express();

// 미들웨어 설정
app.use(express.json());

// 예시 라우터
app.get('/', (req, res) => {
  res.send('테스트입니다.');
});

module.exports = app;
