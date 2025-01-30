const express = require('express');
const { createScrap, deleteScrap, getScraps } = require('./controller/scrapController')

const router = express.Router();

router.get('/', createScrap);
router.post('/', deleteScrap);
router.delete('/:id', getScraps);

module.exports = router;