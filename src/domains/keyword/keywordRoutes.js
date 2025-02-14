const express = require('express');
const { getArticleTotalCount, getArticlesByKeywords, getArticlesByCompany, getArticleCounts, getKeywords } = require('./keywordController.js');

const router = express.Router();

// 키워드 별 기사 개수 조회
router.get('/articles/count/total', getArticleTotalCount);

// 특정 키워드를 포함한 언론사 별 기사 목록 조회 (list?keywords=a,b,c)
router.get('/articles/list', getArticlesByKeywords);

// 키워드별 기사 개수 조회 (count?keywords=a,b,c)
router.get('/articles/count', getArticleCounts);

// 특정 키워드에 대한 언론사 별 기사 조회
router.get('/articles/:keyword/:company', getArticlesByCompany);

// 키워드 50개 조회
router.get('/keywords', getKeywords);

module.exports = router;