const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

module.exports = s3;



///// scrap 만들 때, 해당 scrap의 기사도 가져오는 것으로
// scrap 만들 때 -> 해당 scrap 기사를 DB에 저장, thumbnail 링크도 저장하기