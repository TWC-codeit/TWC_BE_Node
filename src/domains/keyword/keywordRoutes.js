const express = require('express');
const { getArticlesByKeyword, getArticlesByCompany, getArticleCounts, getKeywords } = require('./keywordController.js');

const router = express.Router();


// 키워드별 개수 조회
router.get('/articles/count/:keyword', getArticleCounts);

// 특정 키워드를 포함한 언론사 별 기사 목록 조회
router.get('/articles/:keyword', getArticlesByKeyword);

router.get('/articles/:keyword/:company', getArticlesByCompany);

// 키워드 50개 조회
router.get('/keywords', getKeywords);

module.exports = router;