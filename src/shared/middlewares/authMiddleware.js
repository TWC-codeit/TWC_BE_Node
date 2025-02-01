// src/shared/middlewares/authMiddleware.js

// JWT 토큰 검증 유틸리티와 환경 변수를 가져옵니다.
const { verifyToken } = require('../../domains/auth/common/jwtUtils');
const { env } = require('../../config/env');

/**
 * 인증 미들웨어
 * Authorization 헤더의 토큰을 검증하고 사용자 정보를 요청 객체에 추가
 */
const authMiddleware = (req, res, next) => {
  // Authorization 헤더에서 토큰 추출
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // 토큰 유효성 검증
  const decoded = verifyToken(token, env.jwtSecret);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // 요청 객체에 사용자 정보 추가
  req.user = decoded;
  next(); // 다음 미들웨어 또는 라우터로 이동
};

module.exports = {
  authMiddleware,
}

