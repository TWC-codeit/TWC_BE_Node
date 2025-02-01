const express = require('express');
const { getArticlesByKeyword, getKeywords, getArticleCounts } = require('./keywordController.js');

const router = express.Router();


// 키워드별 개수 조회
router.get('/articles/count/:keyword', getArticleCounts);

// 특정 키워드를 포함한 기사 목록 조회
router.get('/articles/:keyword', getArticlesByKeyword);


// 키워드에 대한 언론사 별 개수 조회
router.get('/articles/count')
module.exports = router;