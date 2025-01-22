const { prisma } = require('../../../config/db');
const bcrypt = require('bcryptjs');

async function findUserByUsername(username) {
    return await prisma.user.findUnique({
        where: { username },
    });
}

async function authenticateUser(username, inputPassword) {
    const user = await findUserByUsername(username);

    if (!user) {
        throw new Error('잘못된 요청입니다');
    }

 //   const isMatch = await bcrypt.compare(inputPassword, user.password);   -> 비밀번호를 해시로 저장하도록 하는 로직 구현 후에 사용할 코드
    const isMatch = inputPassword === user.password
    if (!isMatch) {
        throw new Error('잘못된 요청입니다');
    }

    return user;
}

module.exports = {
    findUserByUsername,
    authenticateUser,
}