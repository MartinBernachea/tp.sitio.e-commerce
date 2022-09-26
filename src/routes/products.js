const productsController = require('./../controllers/productsController');

const express = require('express');
const router = express.Router();

router.get('/producto', productsController.products);
module.exports = router;
