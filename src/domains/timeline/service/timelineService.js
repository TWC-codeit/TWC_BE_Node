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

module.exports = {
  createTimeline,
};
