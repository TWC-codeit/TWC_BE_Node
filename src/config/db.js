const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function connect() {
  try {
    // Prisma로 DB 연결 테스트
    await prisma.$connect();
    console.log('Successfully connected to the database');
  } catch (err) {
    console.error('Error connecting to the database', err);
    process.exit(1);  // 연결 실패시 프로세스 종료
  }
}

module.exports = { connect, prisma };
