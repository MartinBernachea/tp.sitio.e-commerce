const productsController = require('./../controllers/productsController');

const express = require('express');
const router = express.Router();

const productsController = require ('../controllers/productsController');

router.get('/producto', productsController.products);
module.exports = router;
