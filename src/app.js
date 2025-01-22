const express = require('express');
const app = express();
const authRouter = require('./domains/auth/authRoutes');
const cors = require('cors');

// 미들웨어 설정
app.use(express.json());
app.use(cors());

// 예시 라우터
app.get('/', (req, res) => {
  res.send('테스트입니다.');
});

app.use('/api/auth', authRouter);

module.exports = app;