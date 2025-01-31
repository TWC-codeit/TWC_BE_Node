const logger = require('../../../config/logger');
const timelineRepository = require('../repository/timelineRepository');
const timelineItemRepository = require('../repository/timelineItemRepository');
const { prisma } = require('../../../config/db');

// 스크랩 확인
const isScrapExists = async (userId, scrapId) => {
  const scrap = await prisma.scrap.findFirst({
    where: {
      userId: userId,
      id: scrapId,
    }
  });
  return scrap !== null;
};

// 아이템 순서 확인
const validatePositions = (items) => {
  const positions = items.map(item => item.position);
  const sortedPositions = positions.sort((a, b) => a - b);

  // 1부터 아이템 개수까지 연속적인지 확인
  for (let i = 0; i < sortedPositions.length; i++) {
    if (sortedPositions[i] !== i + 1) {
      throw new Error('Positions must be continuous and start from 1.');
    }
  }

  // 중복된 position이 있는지 확인
  const positionSet = new Set(positions);
  if (positionSet.size !== positions.length) {
    throw new Error('Positions must be unique.');
  }
};


// 타임라인 생성
const createTimeline = async (userId, name, items) => {
  logger.info(`Creating timeline for userId = ${userId}, name = ${name}`);

  // 아이템이 있는 경우
  if (items && items.length > 0) {
    const invalidItems = [];

    // 각 아이템을 검증
    for (const item of items) {
      const scrapExists = await isScrapExists(userId, item.scrapId);

      if (!scrapExists) {
        invalidItems.push(item.scrapId);
      }
    }

    // 유효하지 않은 아이템이 하나라도 있으면 에러 발생
    if (invalidItems.length > 0) {
      logger.warn(`Invalid items found: ${invalidItems.join(', ')}`);
      throw new Error(`Only articles in your scrap list can be added as timeline items. Invalid items: ${invalidItems.join(', ')}`);
    }

    validatePositions(items);

    // 1. 새로운 타임라인 생성
    const newTimeline = await timelineRepository.create({ name, userId });

    // 2. 유효한 아이템으로 타임라인 아이템 추가
    const createdItems = [];
    for (const item of items) {
      const createdItem = await timelineItemRepository.create({
        timelineId: newTimeline.id,
        scrapId: item.scrapId,
        position: item.position,
      });

      createdItems.push(createdItem);
      logger.info(`Added item to timeline: scrapId = ${item.scrapId}, position = ${item.position}`);
    }

    // position 기준으로 정렬
    const sortedItems = createdItems.sort((a, b) => a.position - b.position);

    logger.info(`Timeline created successfully: ${newTimeline.id}`);

    return {
      ...newTimeline,
      timelineItems: sortedItems,
    };
  } else {
    // 아이템이 없는 경우: 타임라인만 생성
    const newTimeline = await timelineRepository.create({ name, userId });
    logger.info(`Timeline created successfully: ${newTimeline.id}`);

    return {
      ...newTimeline,
      timelineItems: [],
    };
  }
};

// 타임라인 삭제
const deleteTimeline = async (userId, timelineId) => {
  logger.info(`Deleting a timeline with ID: ${timelineId} for user: ${userId}`);

  try {
    // 해당 타임라인이 존재하는지, 해당 사용자의 것인지 확인
    const timeline = await timelineRepository.findById(timelineId);
    if (!timeline || timeline.userId !== userId) {
      logger.warn(`Timeline with ID: ${timelineId} not found or unauthorized for user: ${userId}`);
      return null;
    }

    // 타임라인 아이템 삭제
    await timelineItemRepository.deleteByTimelineId(timelineId);
    logger.info(`Successfully deleted timeline items for timeline ${timelineId}`);

    // 타임라인 삭제
    await timelineRepository.deleteById(timelineId);
    logger.info(`Successfully deleted timeline ${timelineId} for user ${userId}`);
    return true;
  } catch (error) {
    logger.error(`Error deleting timeline ${timelineId}: ${error.message}`);
    throw error;
  }
};

// 타임라인 목록 조회
const getTimelines = async (userId) => {
  logger.info(`Retrieving timelines for user: ${userId}`);

  try {
    const timelines = await timelineRepository.findByUserId(userId);
    
    if (timelines.length === 0) {
      logger.info(`No timelines found for user: ${userId}`);
    } else {
      logger.info(`Successfully retrieved ${timelines.length} timelines for user: ${userId}`);
    }

    return timelines;
  } catch (error) {
    logger.error(`Error retrieving timelines for user: ${userId}, Error: ${error.message}`);
    throw error; 
  }
};

// 특정 타임라인 조회
const getTimelineById = async (timelineId, userId) => {
  logger.info(`Retrieving timeline with ID: ${timelineId} for user: ${userId}`);

  try {
    const timeline = await timelineRepository.findById(timelineId, userId); // 사용자와 관련된 타임라인만 조회

    if (!timeline) {
      return null; // 타임라인이 없으면 null 반환
    }

    logger.info(`Successfully retrieved timeline with ID: ${timelineId} for user: ${userId}`);
    return timeline;
  } catch (error) {
    logger.error(`Error retrieving timeline with ID: ${timelineId} for user: ${userId}, Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createTimeline,
  deleteTimeline,
  getTimelines,
  getTimelineById,
};
