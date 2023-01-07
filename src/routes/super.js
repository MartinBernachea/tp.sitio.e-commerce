const superController = require('./../controllers/superController');

const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const { userRegisterValidation } = require("../utils/validations");
const { userPermissions, adminPermissions, noUserPermissions, superPermissions, superPermissionsJSON } = require('./permission');


router.get('/panel', superPermissions, superController.usersPanel);
router.get('/panel/users', superPermissions, superController.usersPanel);
router.get('/panel/config', superPermissions, superController.configPanel);



module.exports = router;