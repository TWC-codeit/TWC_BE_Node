const express = require('express');
const router = express.Router();
const { signupController } = require('./signup/signupController');

// 회원가입 라우트
router.post('/signup', signupController);

module.exports = router;