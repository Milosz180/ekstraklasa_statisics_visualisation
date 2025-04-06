const express = require('express');
const router = express.Router();
const { getCsvData } = require('../controllers/dataController');

// Endpoint: /api/data/:season/:filename
router.get('/:season/:filename', getCsvData);

module.exports = router;
