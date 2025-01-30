const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 비밀번호 해싱 함수
async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function main() {
  // 1. 기존 데이터 삭제
  await prisma.$executeRaw`TRUNCATE TABLE "users" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "articles" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "scraps" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "timeline_items" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "timelines" RESTART IDENTITY CASCADE`;
  
  // 2. 여러 User 더미 데이터 생성 (id는 자동 생성됨)
  const users = await prisma.user.createMany({
    data: [
      { username: 'user1', password: await hashPassword('password1'), name: '테스트 유저 1', gender: 'm', birthDate: '1990-01-01' },
      { username: 'user2', password: await hashPassword('password2'), name: '테스트 유저 2', gender: 'f', birthDate: '1992-02-02' },
      { username: 'user3', password: await hashPassword('password3'), name: '테스트 유저 3', gender: 'm', birthDate: '1993-03-03' },
      { username: 'user4', password: await hashPassword('password4'), name: '테스트 유저 4', gender: 'f', birthDate: '1994-04-04' },
    ]
  });

  // 3. Article 더미 데이터 생성 (10개)
  const articles = await prisma.article.createMany({
    data: [
      { keyword: '키워드1', title: '테스트 아티클 1', publishedAt: new Date(), source: '뉴스 소스 1', content: '본문1', imageUrl: 'https://example.com/image1.jpg', url: 'https://example.com/article1' },
      { keyword: '키워드2', title: '테스트 아티클 2', publishedAt: new Date(), source: '뉴스 소스 2', content: '본문2', imageUrl: 'https://example.com/image2.jpg', url: 'https://example.com/article2' },
      { keyword: '키워드3', title: '테스트 아티클 3', publishedAt: new Date(), source: '뉴스 소스 3', content: '본문3', imageUrl: 'https://example.com/image3.jpg', url: 'https://example.com/article3' },
      { keyword: '키워드4', title: '테스트 아티클 4', publishedAt: new Date(), source: '뉴스 소스 4', content: '본문4', imageUrl: 'https://example.com/image4.jpg', url: 'https://example.com/article4' },
      { keyword: '키워드5', title: '테스트 아티클 5', publishedAt: new Date(), source: '뉴스 소스 5', content: '본문5', imageUrl: 'https://example.com/image5.jpg', url: 'https://example.com/article5' },
      { keyword: '키워드6', title: '테스트 아티클 6', publishedAt: new Date(), source: '뉴스 소스 6', content: '본문6', imageUrl: 'https://example.com/image6.jpg', url: 'https://example.com/article6' },
      { keyword: '키워드7', title: '테스트 아티클 7', publishedAt: new Date(), source: '뉴스 소스 7', content: '본문7', imageUrl: 'https://example.com/image7.jpg', url: 'https://example.com/article7' },
      { keyword: '키워드8', title: '테스트 아티클 8', publishedAt: new Date(), source: '뉴스 소스 8', content: '본문8', imageUrl: 'https://example.com/image8.jpg', url: 'https://example.com/article8' },
      { keyword: '키워드9', title: '테스트 아티클 9', publishedAt: new Date(), source: '뉴스 소스 9', content: '본문9', imageUrl: 'https://example.com/image9.jpg', url: 'https://example.com/article9' },
      { keyword: '키워드10', title: '테스트 아티클 10', publishedAt: new Date(), source: '뉴스 소스 10', content: '본문10', imageUrl: 'https://example.com/image10.jpg', url: 'https://example.com/article10' }
    ]
  });

  // 4. Scrap 더미 데이터 생성 (각 유저별 1~5개 스크랩)
  const articlesFromDB = await prisma.article.findMany();
  const usersFromDB = await prisma.user.findMany();

  // 유저에 대해 스크랩 생성
  for (const user of usersFromDB) {
    const numScraps = Math.floor(Math.random() * 5) + 1; // 1~5개 스크랩
    const randomArticles = articlesFromDB.sort(() => 0.5 - Math.random()).slice(0, numScraps);

    // 각 유저에 대해 1~5개의 스크랩 생성
    await prisma.scrap.createMany({
      data: randomArticles.map(article => ({
        userId: user.id,
        articleId: article.id,
      }))
    });
  }

  console.log('더미 데이터 생성 완료!');
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
