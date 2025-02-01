const { loginUser } = require('./loginService');
const app = require("../../../app");

async function loginController(req, res) {
    try {
        const {username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "잘못된 요청입니다" });
        }

        const {user, accessToken} = await loginUser(username, password);

        return res.status(200).json({
            message: "로그인 성공",
            accessToken,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }
}

module.exports = {
    loginController,
};