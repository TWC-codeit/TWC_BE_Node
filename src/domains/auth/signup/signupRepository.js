//const prisma = require('../../../config/db');
const { PrismaClient } = require('@prisma/client');
const SignupDto = require('./signupDto');
const logger = require('../../../config/logger');

const prisma = new PrismaClient();

const createUser = async (SignupDto) => {
  try {
    console.log('SignupDto:', SignupDto);

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
    console.error('Error stack trace:', error.stack);  // 에러 스택을 콘솔에 출력
    logger.error(`createUser failed: ${error.message}`);
    throw new Error('createUser 실패');
  }
};

module.exports = { createUser };