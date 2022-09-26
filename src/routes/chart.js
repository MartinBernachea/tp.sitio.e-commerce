const chartController = require('./../controllers/chartController');

const express = require('express');
const router = express.Router();

router.get('/carrito', chartController.chart);
module.exports = router;