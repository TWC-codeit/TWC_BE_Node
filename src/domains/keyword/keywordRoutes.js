const express = require('express');
const { getKeywords } = require('./keywordController.js');

const router = express.Router();

// 키워드 50개 조회
router.get('/keywords', getKeywords);


module.exports = router;