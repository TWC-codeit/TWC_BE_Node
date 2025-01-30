const { client } = require('../../../config/redis');
const scrapService = require('../service/scrapService')

async function createScrap(req, res) {
    console.log('스크랩 생성 API');

}

async function getScraps(req, res) {
    const userId = req.user.id;

    try {
        const scraps = await scrapService.getAllScrap(userId);

        res.status(201).json(scraps);
    } catch (error) {
        res.status(400).send('No scraps found')
    }
}

async function deleteScrap(req, res) {
    console.log('스크랩 삭제 API');
}

module.exports = {
    createScrap,
    getScraps,
    deleteScrap,
};