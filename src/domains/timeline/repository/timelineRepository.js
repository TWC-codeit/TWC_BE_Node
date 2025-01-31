const { prisma } = require('../../../config/db');
const logger = require('../../../config/logger');

// 타임라인 생성
const create = async ({ name, userId }) => {
  return await prisma.timeline.create({
    data: {
      name,
      userId,
    },
  });
};

// 타임라인 조회
const findById = async (id, userId) => {
  return await prisma.timeline.findFirst({
    where: { 
      id: parseInt(id),
      userId: userId,
    },
    include: {
      items: true,
    }
  });
};

// 타임라인 목록 조회
const findByUserId = async (userId) => {
  return await prisma.timeline.findMany({
    where: { userId },
  });
};

// 타임라인 삭제
const deleteById = async (id) => {
  return await prisma.timeline.delete({
    where: { id: parseInt(id) },
  });
};

module.exports = {
  create,
  findById,
  findByUserId,
  deleteById,
};