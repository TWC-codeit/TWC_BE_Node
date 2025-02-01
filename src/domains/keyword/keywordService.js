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
  console.log(`[fetchArticlesCounts] 조회 키워드: ${keyword}`)
  const key = "keyword:stats";
  const companyCntKey = `keyword:${keyword}:company_stats`;

  // keyword:stats 값 조회
  try {
    // keyword:stats 키 존재 여부 확인
    const exists = await redisClient.exists(key);
    if (!exists) {
      console.log(`Key does not exist: ${key}`);
      return null;
    }

    // 키의 데이터 타입 확인
    const type = await redisClient.type(key);

    let totalCount = null;
    if (type === "hash") {
      // 특정 필드 값 조회
      totalCount = await redisClient.hGet(key, keyword);
      if (!totalCount) {
        console.log(`keyword does not exist: ${keyword}`);
        return null;
      }
    } else {
      throw new Error(`Unsupported totalCount type: ${type}`);
    }

    // keyword:${keyword}:company_stats값 조회
  // == 키워드에 대한 언론사 별 기사 개수 조회

  const mediaCounts = await redisClient.hGetAll(companyCntKey) || {};

  console.log(`키워드 전체 개수: ${totalCount}`);
  console.log('언론사별 개수: ', mediaCounts);

    return {
      keyword,
      totalCount: parseInt(totalCount, 10),
      mediaCounts: mediaCounts
    };
  } catch (err) {
    console.error("Error fetching article counts:", err);
    throw err;
  }

  
};



module.exports = { fetchArticlesByKeyword, fetchArticleCounts };
