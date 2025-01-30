const scrapRepository = require('../repository/scrapRepository');

const getAllScrap = async (userId) => {
    return await scrapRepository.getAllScraps(userId);
};

module.exports = {
    getAllScrap,
}