const scrapRepository = require('../repository/scrapRepository');
const articleRepository = require('../repository/articleRepository');
const { prisma } = require("../../../config/db");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const fetch = require("node-fetch");
const s3 = require("../../../config/s3Client");
const path = require("path");
const { client: redisClient } = require("../../../config/redis");


const createScrap = async (userId, articleId) => {
    return await scrapRepository.createScrap(userId, articleId);
}

const createScrapFromRedis = async (userId, redisKey, index = 0) => {
    const articleRawData = await redisClient.lIndex(redisKey, index);
    if (!articleRawData) {
        throw new Error("데이터가 존재하지 않습니다.");
    }
    const articleData = JSON.parse(articleRawData);

    let s3Url = null;
    if (articleData.thumbnail) {
        const thumbnailUrl = articleData.thumbnail;

        const response = await fetch(thumbnailUrl);
        if (response.ok) {
            const imageBuffer = await response.buffer();
            const contentType = response.headers.get("content-type") || "application/octet-stream";
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const ext = path.extname(thumbnailUrl) || ".jpg";
            const s3Key = `thumbnails/${uniqueSuffix}${ext}`;

            const putCommand = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: s3Key,
                Body: imageBuffer,
                ContentType: contentType,
            });
            await s3.send(putCommand);
            s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
            console.log("썸네일 이미지가 S3에 업로드 되었습니다:", s3Url);
        } else {
            console.warn("썸네일 다운로드에 실패했습니다.")
            s3Url = null;
        }
    } else {
        console.warn("이미지가 없는 기사입니다.")
        s3Url = null;
    }

    const kwd = redisKey.split(":")[1]
    const createdArticle = await articleRepository.createArticle(articleData, s3Url, kwd);
    console.log("기사를 저장했습니다.");

    const newScrap = await prisma.scraps.create({
        data: {
            userId: userId,
            articleId: createdArticle.id,
        },
        include: {
            articles: {
                select: { title: true }
            }
        },
    });

    return {
        id: newScrap.id,
        articleId: newScrap.articleId,
        title: newScrap.articles.title,
        scrapedAt: newScrap.createdAt,
    };
}

const getAllScrap = async (userId) => {
    return await scrapRepository.getAllScraps(userId);
};

const deleteSelectedScrap = async (userId, scrapId) => {
    return await scrapRepository.deleteScrap(userId, scrapId);
}

module.exports = {
    createScrap,
    createScrapFromRedis,
    getAllScrap,
    deleteSelectedScrap,
}