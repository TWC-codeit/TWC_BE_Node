const { client } = require('../../../config/redis');
const scrapService = require('../service/scrapService')

async function createScrap(req, res) {
    console.log('스크랩 생성 API');

}

async function getScraps(req, res) {
    const userId = req.user.id;

    try {
        const scraps = await scrapService.getAllScrap(userId);

        res.status(200).json({ scraps: scraps });
    } catch (error) {
        res.status(400).json({ error: '기사 스크랩을 하지 않은 사용자입니다.' });
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