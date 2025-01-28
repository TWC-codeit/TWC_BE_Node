const { client } = require('../../config/redis.js')

async function createScrap(req, res) {
    console.log('스크랩 생성 API');

}

async function getScraps(req, res) {
    console.log('스크랩 조회 API');
}

async function deleteScrap(req, res) {
    console.log('스크랩 삭제 API');
}

module.exports = {
    connectionTest,
    createScrap,
    getScraps,
    deleteScrap,
};