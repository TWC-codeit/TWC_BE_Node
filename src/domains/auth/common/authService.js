const { prisma } = require('../../../config/db');
const bcrypt = require('bcryptjs');
import { hashPassword, verifyPassword } from './bcrypt.js';
import { generateAccessToken, generateRefreshToken } from './jwtUtils.js';

async function findUserByUsername(username) {
    return await prisma.user.findUnique({
        where: { username },
    });
}

async function authenticateUser(username, inputPassword) {
    const user = await findUserByUsername(username);

    if (!user) {
        throw new Error('잘못된 요청입니다');
    }

 //   const isMatch = await bcrypt.compare(inputPassword, user.password);   -> 비밀번호를 해시로 저장하도록 하는 로직 구현 후에 사용할 코드
    const isMatch = inputPassword === user.password
    if (!isMatch) {
        throw new Error('잘못된 요청입니다');
    }

    return user;
}

/**
 * 사용자 등록 로직
 * @param {Object} userModel 사용자 모델
 * @param {String} id 사용자 아이디
 * @param {String} password 사용자 비밀번호
 * @returns {Object} 생성된 사용자 정보
 */
const registerUser = async (userModel, id, password) => {
  const hashedPassword = await hashPassword(password); // 비밀번호 해싱
  const user = new userModel({ id, password: hashedPassword });
  return user.save(); // 데이터베이스에 사용자 저장
};

/**
 * 사용자 로그인 로직
 * @param {Object} userModel 사용자 모델
 * @param {String} id 사용자 아이디
 * @param {String} password 사용자 비밀번호
 * @returns {Object} 토큰 정보
 */
const loginUser = async (userModel, id, password) => {
  const user = await userModel.findOne({ id }); // 아이디로 사용자 검색
  if (!user) throw new Error('User not found'); // 사용자 없으면 예외 처리

  const isValid = await verifyPassword(password, user.password); // 비밀번호 검증
  if (!isValid) throw new Error('Invalid credentials'); // 비밀번호 불일치 시 예외 처리

  const accessToken = generateAccessToken(user); // 액세스 토큰 생성
  const refreshToken = generateRefreshToken(user); // 리프레시 토큰 생성
  return { accessToken, refreshToken };
};


module.exports = {
    findUserByUsername,
    authenticateUser,
    registerUser,
    loginUser,
}