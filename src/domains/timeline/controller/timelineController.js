const logger = require('../../../config/logger');
const timelineService = require('../service/timelineService');

// 타임라인 생성
const createTimeline = async (req, res) => {
  const userId = req.user.id; // JWT 토큰에서 사용자 정보 가져오기
  const { name, items } = req.body; // 요청 본문에서 타임라인 이름과 아이템들 받기
  
  logger.info(`Received request to create timeline: userId = ${userId}, name = ${name}`);

  try {
    const newTimeline = await timelineService.createTimeline(userId, name, items);

    logger.info(`Successfully created timeline: ${newTimeline.id}`);

    res.status(201).json(newTimeline);
  } catch (error) {
    logger.error(`Error creating timeline: ${error.message}`);

    res.status(500).send('Error creating timeline');
  }
};

module.exports = {
  createTimeline,
};