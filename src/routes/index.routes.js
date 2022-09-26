const express = require('express');
const router = express.Router();

router.use('/', require('./main'));
router.use('/productos', require('./products'));
router.use('/carrito', require('./chart'));
router.use('/user', require('./user'));


module.exports = router;