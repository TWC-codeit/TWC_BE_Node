const { prisma } = require('../../../config/db');

const getAllScrap = async (userId) => {
    const scraps = await prisma.scraps.findMany({
        where: {
            userId: userId,
        },

        include: {
            articles: {
                select: {
                    title: true,
                },
            },
        },

        orderBy: {
            createdAt: 'desc',
        },
    });

    return scraps.map(scrap => ({
        id: scrap.id,
        articleId: scrap.articleId,
        title: scrap.articles.title,
        scrapedAt: scrap.createdAt,
    }));
}

module.exports = {
    getAllScrap,
}