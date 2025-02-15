const { prisma } = require("../../../config/db");

const createArticle = async (articleData, s3Url, keyword = "default") => {
  const publishedAt = isNaN(new Date(articleData.write_time)) ? new Date() : new Date(articleData.write_time);  
  
  return prisma.article.create({
        data: {
            keyword,
            title: articleData.title,
            publishedAt,
            source: articleData.company,
            content: articleData.short_content,
            imageUrl: s3Url,
            url: articleData.link,
        },
    });
};

module.exports = {
    createArticle,
};
