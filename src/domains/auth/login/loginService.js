const { authenticateUser } = require('../common/authService');

async function loginUser(username, password) {
    const user = await authenticateUser(username, password);
    const token = "token_will_be_here"; // 차후 토큰 발급 로직 추가 예정

    return { user, token };
}

module.exports = {
    loginUser,
};