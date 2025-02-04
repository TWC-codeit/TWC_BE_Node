const { prisma } = require("../../../config/db");

const createArticle = async (articleData, s3Url, keyword = "default") => {
    return prisma.article.create({
        data: {
            keyword,
            title: articleData.title,
            publishedAt: new Date(articleData.write_time),
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
