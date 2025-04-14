const express = require('express');
const { createItem } = require('../controllers/itemController');
const router = express.Router();

router.post('/', createItem);

module.exports = router;
