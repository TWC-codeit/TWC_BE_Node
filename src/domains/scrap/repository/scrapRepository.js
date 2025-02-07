const { prisma } = require("../../../config/db");

const createScrap = async (userId, articleId) => {
    const isExistArticle = await prisma.article.findUnique({
        where: {
            id: articleId,
        }
    });

    if (!isExistArticle) {
        throw new Error('존재하지 않는 기사입니다.');
    }

    const isExistScrap = await prisma.scrap.findFirst({
        where: {
            userId: userId,
            articleId: articleId,
        },
    });

    if (isExistScrap) {
        throw new Error('이미 스크랩한 기사입니다.');
    }

    const newScrap = await prisma.scrap.create({
        data: {
            userId: userId,
            articleId: articleId,
        },

        include: {
            article: {
                select: {
                    title: true,
                },
            },
        },
    });

    return {
        id: newScrap.id,
        articleId: newScrap.articleId,
        title: newScrap.article.title,
        scrapedAt: newScrap.createdAt,
    }
}

const getAllScraps = async (userId) => {
    const scraps = await prisma.scrap.findMany({
        where: {
            userId: userId
        },

        include: {
            article: {
                select: {
                    source: true,
                    imageUrl: true,
                    keyword: true,
                    publishedAt: true,
                    title: true,
                    url: true,
                },
            },
        },

        orderBy: {
            createdAt: 'desc',
        },
    });

    return scraps.map(scrap => ({
        articleId: scrap.articleId,
        title: scrap.article.title,
        keyword: scrap.article.keyword,
        imageUrl: scrap.article.imageUrl,
        url: scrap.article.url,
        source: scrap.article.source,
        scrapedAt: scrap.createdAt,
        publishedAt: scrap.article.publishedAt
    }));
}

const deleteScrap = async (userId, scrapId) => {
    const scrap = await prisma.scrap.findUnique({
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

    await prisma.scrap.delete({
        where: {
            id: scrapId,
        }
    });
}

module.exports = {
    createScrap,
    getAllScraps,
    deleteScrap,
};