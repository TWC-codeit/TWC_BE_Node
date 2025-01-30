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

    return res.status(201).json(newTimeline);
  } catch (error) {
    logger.error(`Error creating timeline: ${error.message}`);
    return res.status(500).send('Error creating timeline');
  }
};

// 타임라인 삭제
const deleteTimeline = async (req, res) => {
  try {
    const userId = req.user.id;    
    const { timelineId } = req.params;

    logger.info(`Received request to delete timeline: userId = ${userId}, timelineId = ${timelineId}`);

    const result = await timelineService.deleteTimeline(userId, timelineId);
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Error deleting timeline: ${error.message}`);
    return res.status(500).send('Error deleting timeline');
  }
};

// 타임라인 목록 조회
const getTimelines = async (req, res) => {
  try {
    const userId = req.user.id;

    logger.info(`Received request to fetch timelines for user: ${userId}`);

    const timelines = await timelineService.getTimelines(userId);
    return res.status(200).json( { timelines });
  } catch (error) {
    logger.error(`Failed to fetch timelines: ${error.message}`);
    return res.status(500).send('Error fetching timelines');
  }
};

module.exports = {
  createTimeline,
  deleteTimeline,
  getTimelines,
};