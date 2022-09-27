const productsController = require('./../controllers/productsController');

const express = require('express');
const router = express.Router();

router.get('/', productsController.products);
module.exports = router;
