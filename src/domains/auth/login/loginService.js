const { authenticateUser } = require('../common/authService');
const { generateAccessToken } = require('../common/jwtUtils');

async function loginUser(username, password) {
    const user = await authenticateUser(username, password);
    const token = "token_will_be_here"; // 차후 토큰 발급 로직 추가 예정
    const accessToken = generateAccessToken({ id: user.id, username: user.username });

    return { user, accessToken };
}

module.exports = {
    loginUser,
};