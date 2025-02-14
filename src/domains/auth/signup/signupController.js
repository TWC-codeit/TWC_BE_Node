const signupService = require('./signupService');
const { signupValidation } = require('./signupValidation');
const logger = require('../../../config/logger');
const { validationResult } = require('express-validator');
const SignupDto = require('./signupDto');

const signupController = [
  ...signupValidation, // 유효성 검사 미들웨어 추가

  async (req, res) => {
    try {
      logger.info(`Signup request received for username: ${req.body.username}`); // 요청 로깅
      
      // 데이터 검증
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const statusCode = 400;
        logger.warn(`(${statusCode}) user validation failed: ${errors.array().map(err => err.msg).join(', ')}`); // 검증 실패 로깅
        return res.status(400).json({ 
          "Invalid values": errors.array().map(err => ({ message: err.msg }))
        });
      }

      const userData = new SignupDto(req.body.username, req.body.password, req.body.name, req.body.gender, req.body.birthDate);

      // 회원가입 처리
      const user = await signupService.createUser(userData);
      logger.info(`User created successfully: ID=${user.id}, username=${user.username}`); // 성공 로깅

      const responseUser = {
        ...user,
        gender: SignupDto.convertGenderToKorean(user.gender),
        password: undefined
      };
      
      return res.status(201).json(responseUser);
    } catch (error) {
      const statusCode = 500;
      logger.error(`(${statusCode}) Signup failed: ${error.message}\nStack trace: ${error.stack}`);
      return res.status(500).json({ message: '서버 오류', error: error.message });
    }
  }
];

module.exports = { signupController };
