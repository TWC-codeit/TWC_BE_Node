const { fetchArticlesByKeyword, fetchArticleCounts } = require("./keywordService");
const redis = require("../../config/redis.js"); // Redis 클라이언트 불러오기

const getArticlesByKeyword = async (req, res) => {
  const { keyword } = req.params;
  console.log('조회 키워드: ', keyword);

  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required" });
  }

  try {
    const articles = await fetchArticlesByKeyword(keyword);
    res.status(200).json({ keyword, articles });
  } catch (error) {
    console.error("Error fetching articles:", error.message);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};

const getArticleCounts = async (req, res) => {
  const { keyword } = req.params;
  console.log('개수 조회 키워드: ', keyword);

  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required" });
  }

  try {
    const count = await fetchArticleCounts(keyword);
    if (count === null) {
      return res.status(404).json({ error: "Keyword not found in stats" });
    }

    res.status(200).json({ keyword, count });
  } catch (error) {
    console.error("Error fetching article count:", error.message);
    res.status(500).json({ error: "Failed to fetch article count" });
  }
};

module.exports = { getArticlesByKeyword, getArticleCounts };
