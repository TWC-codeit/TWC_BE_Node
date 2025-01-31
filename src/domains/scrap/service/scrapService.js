const scrapRepository = require('../repository/scrapRepository');

const getAllScrap = async (userId) => {
    return await scrapRepository.getAllScraps(userId);
};

const deleteSelectedScrap = async (userId, scrapId) => {
    return await scrapRepository.deleteScrap(userId, scrapId);
}

module.exports = {
    getAllScrap,
    deleteSelectedScrap,
}