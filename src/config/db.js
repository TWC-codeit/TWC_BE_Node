const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function connect() {
  try {
    // Prisma로 DB 연결 테스트
    await prisma.$connect();
    console.log('Successfully connected to the database');
  } catch (err) {
    console.error('Error connecting to the database:', err.stack);  // 에러 스택을 출력하여 더 상세한 정보 제공
    process.exit(1);  // 연결 실패 시 프로세스 종료
  }
}

// Prisma 클라이언트 종료
process.on('SIGINT', async () => {
  try {
    await prisma.$disconnect();
    console.log('Prisma client disconnected');
    process.exit(0);
  } catch (err) {
    console.error('Error disconnecting Prisma client:', err.stack);
    process.exit(1);
  }
});

module.exports = { connect, prisma };
