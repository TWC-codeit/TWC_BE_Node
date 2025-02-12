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

    const itemsWithArticles = await Promise.all(
      timeline.items.map(async (item) => {
        const article = await timelineItemRepository.findArticleByScrapId(item.scrapId);
        return { ...item, article };
      })
    );

    logger.info(`Successfully retrieved timeline with ID: ${timelineId} for user: ${userId}`);
    return { ...timeline, items: itemsWithArticles };
  } catch (error) {
    logger.error(`Error retrieving timeline with ID: ${timelineId} for user: ${userId}, Error: ${error.message}`);
    throw error;
  }
};

// 타임라인 수정
const updateTimeline = async (userId, timelineId, name, items) => {
  logger.info(`Updating timeline: userId = ${userId}, timelineId = ${timelineId}`);

  try {
    // 해당 타임라인이 본인 소유인지 확인
    const existingTimeline = await timelineRepository.findById(timelineId, userId);
    if (!existingTimeline) {
      logger.warn(`Timeline not found or unauthorized: userId = ${userId}, timelineId = ${timelineId}`);
      return null;
    }

    return await prisma.$transaction(async (prisma) => {
      // 타임라인 이름 수정
      if (name) {
        await timelineRepository.updateName(timelineId, name);
        logger.info(`Timeline name updated: timelineId = ${timelineId}, newName = ${name}`);
      }

      // 타임라인 아이템 수정
      if (items) {
        // position 유효성 체크
        // positions 추출
        const positions = items.map(item => item.position);

        // 1부터 시작하는 연속된 숫자인지 확인
        const sortedPositions = positions.sort((a, b) => a - b); // 오름차순 정렬
        const isValidSequence = sortedPositions.every((val, i) => val === i + 1);

        // 중복된 값이 있는지 확인
        const hasDuplicates = new Set(positions).size !== positions.length;

        if (!isValidSequence || hasDuplicates) {
          logger.warn(`Invalid positions: timelineId = ${timelineId}, positions = ${positions}`);
          throw { code: 'INVALID_POSITIONS' };
        }

        // scrapId 중복 체크
        const scrapIds = items.map(item => item.scrapId);
        const hasDuplicateScrapIds = new Set(scrapIds).size !== scrapIds.length;

        if (hasDuplicateScrapIds) {
          logger.warn(`Duplicate scrapIds: timelineId = ${timelineId}`);
          throw { code: 'DUPLICATE_SCRAPS' };
        }

        await timelineItemRepository.updateItems(timelineId, items);
        logger.info(`Timeline items updated: timelineId = ${timelineId}, itemCount = ${items.length}`);
     
      }

      const updatedTimeline = await timelineRepository.findById(timelineId, userId);
      const itemsWithArticles = await Promise.all(
        updatedTimeline.items.map(async (item) => {
          const article = await timelineItemRepository.findArticleByScrapId(item.scrapId);
          return { ...item, article };
        })
      );

      updatedTimeline.items = itemsWithArticles;

      logger.info(`Timeline updated successfully: timelineId = ${timelineId}`);
      return updatedTimeline;
    });
  } catch (error) {
    logger.error(`Error updating timeline: ${error.message}, userId = ${userId}, timelineId = ${timelineId}`);
    throw error;
  }
};

module.exports = {
  createTimeline,
  deleteTimeline,
  getTimelines,
  getTimelineById,
  updateTimeline,
};
