const scrapRepository = require('../repository/scrapRepository');

const createScrap = async (userId, articleId) => {
    return await scrapRepository.createScrap(userId, articleId);
}

const getAllScrap = async (userId) => {
    return await scrapRepository.getAllScraps(userId);
};

const deleteSelectedScrap = async (userId, scrapId) => {
    return await scrapRepository.deleteScrap(userId, scrapId);
}

module.exports = {
    createScrap,
    getAllScrap,
    deleteSelectedScrap,
}