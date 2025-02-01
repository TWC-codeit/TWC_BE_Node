const express = require('express');
const app = express();
const authRouter = require('./domains/auth/authRoutes');
const cors = require('cors');
const errorHandler = require('./shared/middlewares/errorHandler');
const keywordRouter = require('./domains/keyword/keywordRoutes');


// 미들웨어
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

// API 엔드포인트
app.use('/api/auth', authRouter);
app.use('/api', keywordRouter);

module.exports = app;