const userController = require('./../controllers/userController');

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const path = require('path');
const multer = require('multer');

//***  MULTER  ****/

const multerDiskStorage = multer.diskStorage({
    destination: function(req, file, cb) {       // request, archivo y callback que almacena archivo en destino
        cb(null, path.join(__dirname,'../../public/img'));    // Ruta donde almacenamos el archivo
    },
    filename: function(req, file, cb) {          // request, archivo y callback que almacena archivo en destino
    let imageName = Date.now() + path.extname(file.originalname);   // milisegundos y extensión de archivo original
        cb(null, imageName);         
    }
});

const uploadFile = multer({ storage: multerDiskStorage });

router.get('/register', userController.register);
router.post('/register', userController.userStore); //uploadFile.single('uImage')

router.get('/login', userController.login);
router.post('/login', userController.processLogin);

module.exports = router;