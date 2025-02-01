const { prisma } = require("../../../config/db");
const {error} = require("winston");

const createScrap = async (userId, articleId) => {
    const isExistArticle = await prisma.articles.findUnique({
        where: {
            id: articleId,
        }
    });

    if (!isExistArticle) {
        throw new Error('존재하지 않는 기사입니다.');
    }

    const isExistScrap = await prisma.scraps.findFirst({
        where: {
            userId: userId,
            articleId: articleId,
        },
    });

    if (isExistScrap) {
        throw new Error('이미 스크랩한 기사입니다.');
    }

    const newScrap = await prisma.scraps.create({
        data: {
            userId: userId,
            articleId: articleId,
        },

        include: {
            articles: {
                select: {
                    title: true,
                },
            },
        },
    });

    return {
        id: newScrap.id,
        articleId: newScrap.articleId,
        title: newScrap.articles.title,
        scrapedAt: newScrap.createdAt,
    }
}


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
    createScrap,
    getAllScraps,
    deleteScrap,
};