const { prisma } = require('../../../config/db');
const signupDto = require('./signupDto');
const logger = require('../../../config/logger');

const createUser = async (signupDto) => {
  try {
    
    const birthDateObject = new Date(signupDto.birthDate);

    const user = await prisma.user.create({
      data: {
        username: signupDto.username,
        password: signupDto.password,
        name: signupDto.name,
        gender: signupDto.gender,
        //birthDate: signupDto.birthDate,
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