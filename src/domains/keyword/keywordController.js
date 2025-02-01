const { fetchArticlesByKeyword, fetchArticlesByCompany, fetchArticleCounts, fetchKeywords } = require("./keywordService");
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

const getArticlesByCompany = async (req, res) => {
  const { keyword, company } = req.params;
  console.log("[getArticlesByCompany] 요청된 키워드:", keyword, "언론사:", company);

  if (!keyword || !company) {
    return res.status(400).json({ error: "Keyword and company are required" });
  }

  try {
    const articles = await fetchArticlesByCompany(keyword, company);
    if (!articles || articles.length === 0) {
      return res.status(404).json({ error: `No articles found for ${company} on keyword: ${keyword}` });
    }

    res.status(200).json({ keyword, company, articles });
  } catch (error) {
    console.error("[getArticlesByCompany] 에러 발생 ", error.message);
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

    res.status(200).json(count);
  } catch (error) {
    console.error("Error fetching article count:", error.message);
    res.status(500).json({ error: "Failed to fetch article count" });
  }
};

const getKeywords = async (req, res) => {
  try {
    const keywords = await fetchKeywords();
    res.status(200).json({ keywords });
  } catch (error) {
    console.error('Error fetching keywords:', error.message);
    res.status(500).json({ error: 'Failed to fetch keywords' });
  }
};


module.exports = { getArticlesByKeyword, getArticlesByCompany, getArticleCounts, getKeywords };
