const { prisma } = require('../../../config/db');

const getAllScrap = async (userId) => {
    const scraps = await prisma.scraps.findMany({
        where: {
            userId: userId,
        }
    });

    return scraps;
}

module.exports = {
    getAllScrap,
}