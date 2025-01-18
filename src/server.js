require('dotenv').config(); // 환경 변수 로드
const app = require('./app'); // app.js 로드
const database = require('./config/db'); // 데이터베이스 연결 모듈

// 서버 포트 설정
const port = process.env.PORT || 3000;

async function startServer() {
  try {
    // 데이터베이스 연결
    await database.connect(); // 데이터베이스 연결 테스트

    // 서버 시작
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database:', err);
    process.exit(1); // 데이터베이스 연결 실패 시 프로세스 종료
  }
}

startServer(); // 서버 시작
