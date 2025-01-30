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

const fetchArticleCounts = async (field) => {
  const key = "keyword:stats";

  try {
    // 키 존재 여부 확인
    const exists = await redisClient.exists(key);
    if (!exists) {
      console.log(`Key does not exist: ${key}`);
      return null;
    }

    // 키의 데이터 타입 확인
    const type = await redisClient.type(key);

    let data = null;
    if (type === "hash") {
      // 특정 필드 값 조회
      data = await redisClient.hGet(key, field);
      if (!data) {
        console.log(`Field does not exist: ${field}`);
        return null;
      }
    } else {
      throw new Error(`Unsupported data type: ${type}`);
    }

    return data;
  } catch (err) {
    console.error("Error fetching article counts:", err);
    throw err;
  }
};



module.exports = { fetchArticlesByKeyword, fetchArticleCounts };
