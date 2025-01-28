const express = require('express');

const router = express.Router();

router.get('/scraps', scrapController);
router.post('/scraps', scrapController);
router.delete('/scraps', scrapController);

module.exports = router;