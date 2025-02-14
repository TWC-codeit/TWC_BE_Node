const express = require('express');
const { getArticlesByKeywords, getArticlesByCompany, getArticleCounts, getKeywords } = require('./keywordController.js');

const router = express.Router();

// 특정 키워드를 포함한 언론사 별 기사 목록 조회
router.get('/articles/list', getArticlesByKeywords);

// 키워드별 개수 조회
router.get('/articles/count', getArticleCounts);


router.get('/articles/:keyword/:company', getArticlesByCompany);

// 키워드 50개 조회
router.get('/keywords', getKeywords);

module.exports = router;