const { body } = require('express-validator');
const { prisma } = require('../../../config/db');

const signupValidation = [
  body('username')
  .isString()
  .notEmpty()
  .withMessage('Username is required.')
  .isLength({ min: 5, max: 20 })
  .withMessage('Username must be between 5 and 20 characters.')
  .custom(async (value) => {
    // Prisma를 사용해 username 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { username: value },
    });

    if (existingUser) {
      throw new Error('Username already exists. Please choose another.');
    }
  }),

  body('password')
    .isString()
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.'),
  
  body('gender')
    .isIn(['남성', '여성', '비공개'])
    .withMessage('Gender must be either 남성, 여성, or 비공개.'),
  
  body('birthDate')
    .matches(/^\d{4}-\d{2}-\d{2}$/)  // YYYY-MM-DD 형식을 검증하는 정규 표현식
    .withMessage('Birthdate must be a valid date in YYYY-MM-DD format.'),

  body('name')
    .isString()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ max: 50 })
    .withMessage('Name must not exceed 50 characters.')
];

module.exports = { signupValidation };
