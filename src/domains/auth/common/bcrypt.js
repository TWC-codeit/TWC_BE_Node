const bcrypt = require('bcrypt');

/**
 * 비밀번호를 해싱
 * @param {String} password 평문 비밀번호
 * @returns {String} 해싱된 비밀번호
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // 솔트 값 생성
  return bcrypt.hash(password, salt); // 비밀번호 해싱
};

/**
 * 비밀번호 검증
 * @param {String} password 평문 비밀번호
 * @param {String} hashedPassword 해싱된 비밀번호
 * @returns {Boolean} 검증 결과
 */
const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword); // 비밀번호 일치 여부 확인
};

module.exports = {
  hashPassword,
  verifyPassword,
};