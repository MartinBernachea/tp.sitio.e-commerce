const productsController = require('./../controllers/productsController');

const express = require('express');
const router = express.Router();

router.get('/', productsController.products);
router.get('/edit/:id',productsController.edit );
module.exports = router;
