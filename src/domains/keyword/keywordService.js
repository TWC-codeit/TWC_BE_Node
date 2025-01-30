const { client: redisClient } = require("../../config/redis.js"); // Redis 클라이언트 설정
const { normalizeData } = require("./redisUtils");

const fetchKeywords = async () => {
  try {
    const keywords = await redisClient.sMembers('keywords'); // 'keywords' 키의 데이터를 가져옴
    console.log('Fetched keywords:', keywords);
    return keywords;
  } catch (error) {
    console.error('Error fetching keywords:', error);
    throw error;
  }
};


module.exports = { fetchKeywords };
