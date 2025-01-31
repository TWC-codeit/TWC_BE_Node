const express = require('express');
const router = express.Router();
const timelineController = require('../controller/timelineController');
const { authMiddleware } = require('../../../shared/middlewares/authMiddleware');
const logger = require('../../../config/logger');

// 인증 미들웨어
router.use(authMiddleware);

// 타임라인 생성
router.post('/', (req, res, next) => {
  logger.info('타임라인 생성 요청'); // 요청이 들어오면 로깅
  next(); // 다음 미들웨어로 넘김
}, timelineController.createTimeline);

// 타임라인 삭제
router.delete('/:timelineId', (req, res, next) => {
  logger.info('타임라인 삭제 요청');
  next();
}, timelineController.deleteTimeline);

// 타임라인 목록 조회
router.get('/', (req, res, next) => {
  logger.info('타임라인 목록 조회 요청');
  next();
}, timelineController.getTimelines);

// 특정 타임라인 조회
router.get('/:timelineId', (req, res, next) => {
  logger.info('특정 타임라인 조회 요청');
  next();
}, timelineController.getTimelineById);

module.exports = router;
