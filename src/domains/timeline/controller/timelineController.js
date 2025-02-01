const logger = require('../../../config/logger');
const timelineService = require('../service/timelineService');

// 타임라인 생성
const createTimeline = async (req, res) => {
  const userId = req.user.id; // JWT 토큰에서 사용자 정보 가져오기
  const { name, items } = req.body; // 요청 본문에서 타임라인 이름과 아이템들 받기
  logger.info(`Received request to create timeline: userId = ${userId}, name = ${name}`);

  try {
    const newTimeline = await timelineService.createTimeline(userId, name, items);

    logger.info(`Successfully created timeline: userId = ${userId}, timelineId = ${newTimeline.id}`);
    return res.status(201).json(newTimeline);
  } catch (error) {
    logger.error(`Error creating timeline: userId = ${userId}, timelineId = ${newTimeline.id}, error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to create timeline' });
  }
};

// 타임라인 삭제
const deleteTimeline = async (req, res) => {
  const userId = req.user.id;    
  const { timelineId } = req.params;
  logger.info(`Received request to delete timeline: userId = ${userId}, timelineId = ${timelineId}`);

  try {
    const isDeleted = await timelineService.deleteTimeline(userId, timelineId);

    if (!isDeleted) {
      logger.error(`Unauthorized attempt or timeline not found: userId = ${userId}, timelineId = ${timelineId}`);
      return res.status(403).json({ success: false, message: 'Unauthorized or Timeline not found'});
    }

    logger.info(`Successfully deleted timeline: userId = ${userId}, timelineId = ${timelineId}`);
    return res.status(200).json({ success: true, message: 'Timeline deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting timeline: userId = ${userId}, timelineId = ${timelineId}, error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to delete timeline' });
  }
};

// 타임라인 목록 조회
const getTimelines = async (req, res) => {
  const userId = req.user.id;
  logger.info(`Received request to fetch timelines for user: ${userId}`);
  
  try {
    const timelines = await timelineService.getTimelines(userId);
    logger.info(`Successfully fetched timelines: userId = ${userId}`);
    return res.status(200).json( { timelines });
  } catch (error) {
    logger.error(`Error fetching timelines: userId = ${userId}, error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to fetch timeline lists' });
  }
};

// 특정 타임라인 조회
const getTimelineById = async (req, res) => {
  const { timelineId } = req.params; 
  const userId = req.user.id;
  logger.info(`Received request to fetch a timeline: userId = ${userId}, timelineId = ${timelineId}`);

  try {
    const timeline = await timelineService.getTimelineById(timelineId, userId);

    if (!timeline) {
      logger.warn(`Timeline with ID: ${timelineId} not found for user: ${userId}`);
      return res.status(403).json({ success: false, message: 'Unauthorized or Timeline not found'});
    }

    logger.info(`Successfully fetched a timeline: userId = ${userId}, timelineId = ${timelineId}`);
    return res.status(200).json({ timeline: timeline, items: timeline.timelineItems });
  } catch (error) {
    logger.error(`Failed to fetch a timeline with ID: ${timelineId} for user: ${userId}, Error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to retrieve timeline' });
  }
};

// 타임라인 수정
const updateTimeline = async (req, res) => {
  const { timelineId } = req.params;
  const userId = req.user.id;
  const { name, items } = req.body;
  logger.info(`Received request to update a timeline: userId = ${userId}, timelineId = ${timelineId}`);

  try {
    const updatedTimeline = await timelineService.updateTimeline(userId, timelineId, name, items);

    if (!updatedTimeline) {
      logger.warn(`Timeline with ID: ${timelineId} not found for user: ${userId}`);
      return res.status(403).json({ success: false, message: 'Unauthorized or Timeline not found' });
    }

    logger.info(`Successfully updated a timeline: userId = ${userId}, timelineId = ${timelineId}`);
    return res.status(200).json({ success: true, timeline: updatedTimeline });
  } catch (error) {
    // 순서 이상 오류 처리
    if (error.code === 'INVALID_POSITIONS') {
      return res.status(400).json({
        success: false,
        message: 'Positions must be consecutive starting from 1 and cannot have duplicates.',
      });
    }
  
    // 중복된 scrapId 오류 처리
    if (error.code === 'DUPLICATE_SCRAPS') {
      return res.status(400).json({
        success: false,
        message: 'Duplicate scrapId found within the same timeline.',
      });
    }

    logger.error(`Failed to update a timeline with ID: ${timelineId} for user: ${userId}, Error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to update timeline' });
  }
};


module.exports = {
  createTimeline,
  deleteTimeline,
  getTimelines,
  getTimelineById,
  updateTimeline,
};