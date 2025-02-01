const { client: redisClient } = require("../../config/redis.js"); // Redis 클라이언트 설정
const { normalizeData } = require("./redisUtils");

const fetchArticlesByKeyword = async (keyword) => {
  try {
    // 키 존재 여부 확인
    const key = `keyword:${keyword}:company_articles:*`;
    const companyKeys = await redisClient.keys(key);
    console.log(companyKeys)
    if (!companyKeys || companyKeys.length === 0) {
      console.log(`Key does not exist: ${key}`);
      return {};
    }
    const articlesByCompany = {};

    await Promise.all(
      companyKeys.map(async (companyKey) => {
        const company = companyKey.split(":").pop();
        const type = await redisClient.type(companyKey); // `TYPE` 명령어 호출

        // 키의 데이터 타입 확인

        let data = [];
        if (type === "string") {
          const rawData = await redisClient.get(companyKey);
          data = normalizeData([rawData]);
        } else if (type === "list") {
          data = normalizeData(await redisClient.lRange(companyKey, 0, -1));
        } else if (type === "set") {
          data = normalizeData(await redisClient.sMembers(companyKey));
        } else {
          throw new Error(`Unsupported data type: ${type}`);
        }

        articlesByCompany[company] = data;
      })
    );
    return articlesByCompany;
  } catch (err) {
    console.error("Error fetching articles by keyword:", err);
    throw err;
  }
};

const fetchArticlesByCompany = async (keyword, company) => {
  console.log(`조회 키워드: ${keyword}, 언론사: ${company}`);

  try {
    const allArticles = await fetchArticlesByKeyword(keyword);
    const companyArticles = allArticles[company] || [];

    if (companyArticles.length === 0) {
      console.log(`No articles found for ${company} on keyword: ${keyword}`);
      return [];
    }
    return companyArticles;
  } catch (err) {
    console.error("[fetchArticlesByCompany] Redis 조회 에러", err);
    throw err;
  }

}

const fetchArticleCounts = async (keyword) => {
  console.log(`[fetchArticlesCounts] 조회 키워드: ${keyword}`);
  const key = "keyword:stats";
  const companyCntKey = `keyword:${keyword}:company_stats`;

  // keyword:stats 값 조회
  try {
    // keyword:stats 키 존재 여부 확인
    const companyKeys = await redisClient.keys(key);
    if (!companyKeys) {
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

    const mediaCounts = (await redisClient.hGetAll(companyCntKey)) || {};

    console.log(`키워드 전체 개수: ${totalCount}`);
    console.log("언론사별 개수: ", mediaCounts);

    return {
      keyword,
      totalCount: parseInt(totalCount, 10),
      mediaCounts: mediaCounts,
    };
  } catch (err) {
    console.error("Error fetching article counts:", err);
    throw err;
  }
};

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

module.exports = { fetchArticlesByKeyword, fetchArticlesByCompany, fetchArticleCounts, fetchKeywords };
