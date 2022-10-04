const userController = require('./../controllers/userController');

const express = require('express');
const router = express.Router();

router.get('/register', userController.register);
router.get('/login', userController.login)

module.exports = router;