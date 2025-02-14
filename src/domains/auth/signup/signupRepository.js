const { prisma } = require('../../../config/db');
const SignupDto = require('./signupDto');
const logger = require('../../../config/logger');

const createUser = async (SignupDto) => {
  try {
    
    const birthDateObject = new Date(SignupDto.birthDate);

    const user = await prisma.user.create({
      data: {
        username: SignupDto.username,
        password: SignupDto.password,
        name: SignupDto.name,
        gender: SignupDto.gender,
        //birthDate: SignupDto.birthDate,
        //birthDate: birthDateObject,
        birthDate: birthDateObject.toISOString().split('T')[0],
      },
    });
    return user;
  } catch (error) {
    logger.error(`createUser failed: ${error.message}`);
    throw new Error('createUser 실패');
  }
};

module.exports = { createUser };