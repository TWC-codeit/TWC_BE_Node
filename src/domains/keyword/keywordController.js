const { fetchKeywords } = require("./keywordService");
const redis = require("../../config/redis.js"); // Redis 클라이언트 불러오기


const getKeywords = async (req, res) => {
  try {
    const keywords = await fetchKeywords();
    res.status(200).json({ keywords });
  } catch (error) {
    console.error('Error fetching keywords:', error.message);
    res.status(500).json({ error: 'Failed to fetch keywords' });
  }
};


module.exports = { getKeywords };
