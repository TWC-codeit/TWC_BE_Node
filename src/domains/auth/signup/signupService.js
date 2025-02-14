const bcrypt = require('bcryptjs');
const signupRepository = require('./signupRepository');
const signupDto = require('./signupDto');

const createUser = async (userData) => {
  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const gender = signupDto.convertGenderToEnglish(userData.gender);

  // DB에 저장할 객체 생성
  const newUser = {
    username: userData.username,
    password: hashedPassword,
    name: userData.name,
    gender: gender,
    birthDate: userData.birthDate,
  };

  // 유저 생성
  return await signupRepository.createUser(newUser);
};

module.exports = { createUser };