const { client } = require('../../../config/redis');
const scrapService = require('../service/scrapService')

async function createScrap(req, res) {
    try {
        const userId = req.user.id;

        if (req.body.articleId) {
            const { articleId } = req.body;
            const createdScrap = await scrapService.createScrap(userId, articleId);
            res.status(201).json(createdScrap);
        } else if (req.body.redisKey) {
            const { redisKey, index}  = req.body;
            const createdScrap = await scrapService.createScrapFromRedis(userId, redisKey, index);
            res.status(201).json(createdScrap);
        } else {
            res.status(400).json({ error: "필수 정보가 누락되었습니다." });
        }
    } catch (error) {
        res.status(400).json({ error: "스크랩에 실패했습니다." });
    }

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
    try {
        const userId = req.user.id;
        const scrapId = parseInt(req.params.id, 10);

        if (isNaN(scrapId)) {
            return res.status(400).json({ error: '유효한 스크랩 ID가 아닙니다.' });
        }

        await scrapService.deleteSelectedScrap(userId, scrapId);

        res.status(200).json({ message: '스크랩이 삭제되었습니다.' });
    } catch (error) {
        res.status(400).json({ error: "스크랩을 찾을 수 없습니다." })
    }
}

module.exports = {
    createScrap,
    getScraps,
    deleteScrap,
};