const { client: redisClient } = require("../../config/redis.js"); // Redis 클라이언트 설정
const { normalizeData } = require("./redisUtils");


const fetchArticlesByKeyword = async (keyword) => {
  const key = `keyword:${keyword}:articles`;

  try {
    // 키 존재 여부 확인
    const exists = await redisClient.exists(key);
    if (!exists) {
      console.log(`Key does not exist: ${key}`);
      return null;
    }

    // 키의 데이터 타입 확인
    const type = await redisClient.type(key); // `TYPE` 명령어 호출

    let data = [];
    if (type === "string") {
      const rawData = await redisClient.get(key);
      data = normalizeData([rawData]);
    } else if (type === "list") {
      data = normalizeData(await redisClient.lRange(key, 0, -1));
    } else if (type === "set") {
      data = normalizeData(await redisClient.sMembers(key));
    } else {
      throw new Error(`Unsupported data type: ${type}`);
    }

    return data;
  } catch (err) {
    console.error("Error fetching articles by keyword:", err);
    throw err;
  }
};

const fetchArticleCounts = async (keyword) => {
  console.log(`[fetchArticleCounts] Redis에서 조회 - keyword: ${keyword}`); // 로그 추가 ✅

  try {
    const redisKey = `keyword:stats:${keyword}`; // 🔥 키워드 포함된 키 생성
    console.log(`[fetchArticleCounts] Redis Key: ${redisKey}`); // 로그 추가 ✅
    const temp = redisClient.get(redisKey);
    console.log(temp);
    const count = await redisClient.hGet(redisKey, keyword);
    console.log(`[fetchArticleCounts] 조회 결과: ${count}`); // 로그 추가 ✅

    return count ? parseInt(count, 10) : null;
  } catch (error) {
    console.error("[fetchArticleCounts] Redis 조회 에러 ❌", error.message);
    throw new Error("Failed to fetch article count");
  }
};

module.exports = { fetchArticlesByKeyword, fetchArticleCounts };
