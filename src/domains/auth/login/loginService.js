const { authenticateUser } = require('../common/authService');
const {generateAccessToken} = require("../common/jwtUtils");

async function loginUser(username, password) {
    const user = await authenticateUser(username, password);
    const accessToken = generateAccessToken({ id: user.id, username: user.username });

    return { user, accessToken };
}

module.exports = {
    loginUser,
};