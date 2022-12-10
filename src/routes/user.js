const userController = require('./../controllers/userController');

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const path = require('path');
const multer = require('multer');

const { userRegisterValidation } = require("../utils/validations");
const { userPermissions, adminPermissions, noUserPermissions, superPermissions, superPermissionsJSON } = require('./permission');

//***  MULTER  ****/
const multerDiskStorage = multer.diskStorage({
    destination: function (req, file, cb) {       // request, archivo y callback que almacena archivo en destino
        cb(null, path.join(__dirname, '../../public/img'));    // Ruta donde almacenamos el archivo
    },
    filename: function (req, file, cb) {          // request, archivo y callback que almacena archivo en destino
        let imageName = Date.now() + path.extname(file.originalname);   // milisegundos y extensión de archivo original
        cb(null, imageName);
    }
});

const uploadFile = multer({ storage: multerDiskStorage });

router.get('/register', noUserPermissions, userController.register);
router.post('/register', noUserPermissions, userRegisterValidation, userController.userStore); //uploadFile.single('uImage')

router.get('/account', userPermissions, userController.account);

router.get('/panel', superPermissions, userController.panel);
router.post('/editUser/:id', superPermissionsJSON, userController.editUser);

router.get('/login', noUserPermissions, userController.login);
router.post('/login', noUserPermissions, userController.processLogin);

router.get('/logOut', userPermissions, userController.logOut);

module.exports = router;