import { hashPassword, verifyPassword } from './bcrypt.js';
import { generateAccessToken, generateRefreshToken } from './jwtUtils.js';

/**
 * 사용자 등록 로직
 * @param {Object} userModel 사용자 모델
 * @param {String} id 사용자 아이디
 * @param {String} password 사용자 비밀번호
 * @returns {Object} 생성된 사용자 정보
 */
export const registerUser = async (userModel, id, password) => {
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
export const loginUser = async (userModel, id, password) => {
  const user = await userModel.findOne({ id }); // 아이디로 사용자 검색
  if (!user) throw new Error('User not found'); // 사용자 없으면 예외 처리

  const isValid = await verifyPassword(password, user.password); // 비밀번호 검증
  if (!isValid) throw new Error('Invalid credentials'); // 비밀번호 불일치 시 예외 처리

  const accessToken = generateAccessToken(user); // 액세스 토큰 생성
  const refreshToken = generateRefreshToken(user); // 리프레시 토큰 생성
  return { accessToken, refreshToken };
};
