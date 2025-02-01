const dotenv = require('dotenv');

dotenv.config(); // .env 파일 로드

const env = {
  jwtSecret: process.env.JWT_SECRET, // 환경 변수에서 JWT_SECRET 가져오기
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
};

module.exports = { env };