const { prisma } = require("../../../config/db");

const getAllScraps = async (userId) => {
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

const deleteScrap = async (userId, scrapId) => {
    const scrap = await prisma.scraps.findUnique({
        where: {
            id: scrapId,
        },
        select: {
            userId: true,
        },
    });

    if (!scrap || scrap.userId !== userId) {
        throw new Error('요청한 스크랩 내용이 존재하지 않습니다.');
    }

    await prisma.scraps.delete({
        where: {
            id: scrapId,
        }
    });
}

module.exports = {
    getAllScraps,
    deleteScrap,
};