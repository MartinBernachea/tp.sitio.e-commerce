const productsController = require('./../controllers/productsController');

const express = require('express');
const router = express.Router();


/*** GET ALL PRODUCTS ***/
router.get('/', productsController.index)

/*** CARRITO ***/
router.get('/carrito', productsController.chart);

/*** COMING SOON ***/
router.get('/coming-soon', productsController.comingSoon);

/*** GET ONE PRODUCT (DETAIL OF ONE PRODUCT) ***/
router.get('/detail/:id', productsController.detail);

/*** CREATE ONE PRODUCT ***/
router.get('/create', productsController.create);
router.post('/create',productsController.store);

/*** EDIT ONE PRODUCT ***/
router.get('/edit', productsController.edit);

/*** DELETE ONE PRODUCT ***/
router.delete('/:id', productsController.destroy);

module.exports = router;
