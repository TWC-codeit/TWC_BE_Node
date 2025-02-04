const express = require('express');
const { createScrap, deleteScrap, getScraps } = require('./controller/scrapController')
const { authMiddleware } = require("../../shared/middlewares/authMiddleware");
const logger = require("../../config/logger");

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => {
    logger.info('스크랩 가져오기 시도');
    next();
}, getScraps);

router.post('/', (req, res, next) => {
    logger.info('스크랩 시도');
    next();
}, createScrap);

router.delete('/:id', (req, res, next) => {
    logger.info('스크랩 삭제 시도');
    next();
}, deleteScrap);

module.exports = router;