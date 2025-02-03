# Node.js 이미지 사용
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사 후 의존성 설치
COPY package*.json ./
RUN npm install

# 앱 코드 복사
COPY . .

# Prisma 클라이언트 생성
RUN npm run prisma:generate

# 애플리케이션 실행
CMD ["npm", "start"]