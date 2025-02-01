const { prisma } = require('../../../config/db');

// 타임라인 아이템 추가
const create = async ({ timelineId, scrapId, position }) => {
  return await prisma.timelineItem.create({
    data: {
      timelineId,
      scrapId,
      position,
    },
  });
};

// 타임라인 아이템 삭제
const deleteById = async (id) => {
  return await prisma.timelineItem.delete({
    where: { id },
  });
};

const deleteByTimelineId = async (timelineId) => {
  // 주어진 timelineId에 해당하는 모든 타임라인 아이템 삭제
  return await prisma.timelineItem.deleteMany({
    where: { timelineId: parseInt(timelineId) },
  });
};

// 타임라인 아이템 position 업데이트
const updatePosition = async (id, position) => {
  return await prisma.timelineItem.update({
    where: { id },
    data: { position },
  });
};


// 타임라인 수정
const updateItems = async (timelineId, items) => {
  // 기존 아이템 삭제
  await prisma.timelineItem.deleteMany({
    where: { timelineId: parseInt(timelineId) },
  });

   // 새로운 아이템 추가
   await prisma.timelineItem.createMany({
    data: items.map(item => ({
      timelineId: parseInt(timelineId),
      scrapId: item.scrapId,
      position: item.position,
    })),
  });
};

// 타임라인 아이템 찾기
const findByTimelineId = async (timelineId) => {
  return await prisma.timelineItem.findMany({
    where: { timelineId: parseInt(timelineId) },
    orderBy: { position: 'asc' },
  });
};

module.exports = {
  create,
  deleteById,
  deleteByTimelineId,
  updatePosition,
  updateItems,
  findByTimelineId,
};