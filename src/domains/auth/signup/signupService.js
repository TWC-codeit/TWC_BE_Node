const bcrypt = require('bcryptjs');
const signupRepository = require('./signupRepository');
const SignupDto = require('./signupDto');

const signupUser = async (signupData) => {
  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(signupData.password, 10);

  const signupDto = new SignupDto(
    signupData.username,
    hashedPassword,
    signupData.name,
    signupData.gender,
    signupData.birthDate
  );

  // 유저 생성
  const newUser = await signupRepository.createUser(signupDto);

  return newUser;
};

module.exports = { signupUser };