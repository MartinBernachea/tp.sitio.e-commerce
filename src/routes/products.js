const productsController = require('./../controllers/productsController');

const express = require('express');
const router = express.Router();

router.get('/', productsController.index)
router.get('/producto/:id', productsController.products);
router.get('/carrito', productsController.chart);
router.get('/coming-soon', productsController.comingSoon);
router.get('/edit', productsController.edit);

// CREATE ONE PRODUCT
router.get('/create', productsController.create);
router.post('/create',productsController.store);

// GET ONE PRODUCT (DETAIL OF ONE PRODUCT)
// router.get('/detail/:id', productsController.detail);

module.exports = router;
