const { body } = require('express-validator');
const { prisma } = require('../../../config/db');

const signupValidation = [
  body('username')
    .notEmpty().withMessage('Username is required.')
    .isString().withMessage('Username must be a string.')
    .isLength({ min: 5, max: 20 }).withMessage('Username must be between 5 and 20 characters.')
    .custom(async (value) => {
      const existingUser = await prisma.user.findUnique({
        where: { username: value },
      });
      if (existingUser) {
        throw new Error('Username already exists. Please choose another.');
      }
    }),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .custom((value) => {
      if (value && value.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
      }
      return true;
    }),

  body('name')
    .custom((value) => {
      if (!value) {
        throw new Error('Name is required.');
      }
      if (typeof value !== 'string') {
        throw new Error('Name must be a string.');
      }
      if (value.length > 50) {
        throw new Error('Name must not exceed 50 characters.');
      }
      return true;
    }), 

  body('gender')
    .notEmpty().withMessage('Gender is required.')
    .custom((value) => {
      if (value && !['남성', '여성', '비공개'].includes(value)) {
        throw new Error('Gender must be either 남성, 여성, or 비공개.');
      }
      return true;
    }),

  body('birthDate')
    .custom((value) => {
      if (!value) {
        throw new Error('Birthdate is required.');
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error('Birthdate must be a valid date in YYYY-MM-DD format.');
      }
      return true;
    }),
];

module.exports = { signupValidation };
