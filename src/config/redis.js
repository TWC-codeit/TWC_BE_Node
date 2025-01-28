const { createClient } = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

client.on('error', err => console.log('Redis Client Error', err));

const connect = async () => {
    try {
        await client.connect();
        console.log("Redis Cloud에 연결 성공했습니다.");
    } catch (err) {
        console.error("Redis Cloud에 연결하지 못했습니다. \n 에러 코드: ", err);
    }
}

const disconnect = async () => {
    try {
        await client.disconnect();
        console.log('Redis Cloud 연결이 종료되었습니다.');
    } catch (err) {
        console.error('연결 해제에 실패했습니다. \n 에러 코드: ', err);
    }
};

process.on('SIGINT', async () => {
    await disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await disconnect();
    process.exit(0);
});

connect();

module.exports = {
    client,
    connect,
    disconnect,
};