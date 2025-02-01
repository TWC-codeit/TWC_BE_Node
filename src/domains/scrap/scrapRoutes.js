const express = require('express');
const { createScrap, deleteScrap, getScraps } = require('./controller/scrapController')
const { authMiddleware } = require("../../shared/middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get('/', getScraps);
router.post('/', createScrap);
router.delete('/:id', deleteScrap);

module.exports = router;