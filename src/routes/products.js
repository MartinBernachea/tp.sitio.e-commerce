const productsController = require('./../controllers/productsController');

const express = require('express');
const router = express.Router();

router.get('/', productsController.index)
router.get('/producto', productsController.products);
router.get('/carrito', productsController.chart);
router.get('/coming-soon', productsController.comingSoon);

module.exports = router;
