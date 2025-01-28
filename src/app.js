const express = require('express');
const app = express();
const authRouter = require('./domains/auth/authRoutes');
const scrapRouter = require('./domains/scrap/scrapRoutes');
const cors = require('cors');
const errorHandler = require('./shared/middlewares/errorHandler');

// 미들웨어
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

// API 엔드포인트
app.use('/api/auth', authRouter);

// Scrap Endpoint
app.use('/api/scrap', scrapRouter);

module.exports = app;

