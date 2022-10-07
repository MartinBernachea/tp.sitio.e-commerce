const productsController = require('./../controllers/productsController');

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');


//***  Validations  ****/

let validaciones = [
    body('name').notEmpty().withMessage('Completar campo'),
    body('price').notEmpty().withMessage('Completar campo'), // .isNumeric([locale(['ar']), options({no_symbols: true})])
    body('category').notEmpty().withMessage('Completar campo'),
]


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
router.post('/create', validaciones, productsController.store);

/*** EDIT ONE PRODUCT ***/
router.get('/edit/:id', productsController.edit);
router.put('/edit/:id', productsController.update);

/*** DELETE ONE PRODUCT ***/
router.delete('/:id', productsController.destroy);

module.exports = router;
