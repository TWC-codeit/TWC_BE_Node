const express = require('express');
const { loginController } = require('./login/loginController');

const router = express.Router();

router.post('/login', loginController);

router.post('/logout', (req, res) => {
    try {
        return res.status(200).json({ message: '로그아웃 되었습니다.' });
    } catch (error) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }
});

module.exports = router;