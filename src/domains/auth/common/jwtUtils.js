const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// .env 파일 경로 설정
const ENV_PATH = path.join(__dirname, '../../../../.env');

// 비밀 키 생성 함수
function generateSecretKey(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

// .env 파일에 비밀 키 추가
function ensureSecretKeys() {
  if (process.env.NODE_ENV === 'test') {
    console.log('Skipping secret key generation in test environment.');
    return;
  }

  if (!fs.existsSync(ENV_PATH)) {
    fs.writeFileSync(ENV_PATH, '');
  }
  const envContent = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf-8') : '';
  const secretsToAdd = [];

  if (!process.env.JWT_SECRET) {
    const jwtSecret = generateSecretKey();
    secretsToAdd.push(`JWT_SECRET=${jwtSecret}`);
    process.env.JWT_SECRET = jwtSecret; // 프로세스에 키 추가
    console.log('Generated JWT_SECRET:', jwtSecret);
  }

  if (!process.env.REFRESH_TOKEN_SECRET) {
    const refreshTokenSecret = generateSecretKey();
    secretsToAdd.push(`REFRESH_TOKEN_SECRET=${refreshTokenSecret}`);
    process.env.REFRESH_TOKEN_SECRET = refreshTokenSecret; // 프로세스에 키 추가
    console.log('Generated REFRESH_TOKEN_SECRET:', refreshTokenSecret);
  }

  if (secretsToAdd.length > 0) {
    fs.appendFileSync(ENV_PATH, `\n${secretsToAdd.join('\n')}`);
    console.log('Secrets added to .env file.');
  }
}

// 액세스 토큰 생성
function generateAccessToken(user, expiresIn = '1h') {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn });
}

// 리프레시 토큰 생성
function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

// 토큰 검증
function verifyToken(token, secret) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error(err.message === 'jwt expired' ? 'Token has expired' : 'Invalid token');
  }
}

// 비밀 키 초기화 호출
ensureSecretKeys();

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  ensureSecretKeys, // 필요하면 외부에서 호출 가능
};
