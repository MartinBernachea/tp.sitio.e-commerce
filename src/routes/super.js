const superController = require('./../controllers/superController');

const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const { userRegisterValidation } = require("../utils/validations");
const { superPermissions } = require('./permission');

router.get('/panel', superPermissions, superController.usersPanel);
router.get('/panel/users', superPermissions, superController.usersPanel);
router.get('/panel/config', superPermissions, superController.configPanel);
router.post('/panel/editConfig', superPermissions, superController.editConfig);

module.exports = router;