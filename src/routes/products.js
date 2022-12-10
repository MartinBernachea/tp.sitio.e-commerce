//***  REQUIRES  ****/

const productsController = require('./../controllers/productsController');

const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const { productCreateValidation } = require("../utils/validations");
const { adminPermissions, userPermissions } = require('./permission');

//***  MULTER  ****/
const multerDiskStorage = multer.diskStorage({
    destination: function (req, file, cb) {       // request, archivo y callback que almacena archivo en destino
        cb(null, path.join(__dirname, '../../public/img/products'));    // Ruta donde almacenamos el archivo
    },
    filename: function (req, file, cb) {          // request, archivo y callback que almacena archivo en destino
        let imageName = file.fieldname + "-" + Date.now() + path.extname(file.originalname);   // milisegundos y extensión de archivo original
        cb(null, imageName);
    }
});

const uploadFile = multer({ storage: multerDiskStorage });
const multipleImages = uploadFile.fields([
    { name: "cImage1", maxCount: 10 },
    { name: "cImage2", maxCount: 10 },
    { name: "cImage3", maxCount: 10 },
    { name: "cImage4", maxCount: 10 },
    { name: "cImage5", maxCount: 10 },
])

/*** GET ALL PRODUCTS ***/
router.get('/', productsController.index)

/*** CARRITO ***/
router.get('/carrito', userPermissions, productsController.chart);

/*** COMING SOON ***/
router.get('/coming-soon', adminPermissions, productsController.comingSoon);

/*** GET ONE PRODUCT (DETAIL OF ONE PRODUCT) ***/
router.get('/detail/:id', productsController.detail);

/*** STORE CON FILTROS ***/
router.get('/store', productsController.store);

/*** CREATE ONE PRODUCT ***/
router.get('/create', adminPermissions, productsController.create);
router.post('/create', adminPermissions, multipleImages, productCreateValidation, productsController.store); // FALTA AGREGAR 'validaciones' de img

/*** EDIT ONE PRODUCT ***/
router.get('/edit/:id', adminPermissions, productsController.edit);
router.put('/edit/:id', adminPermissions, productsController.update);

/*** DELETE ONE PRODUCT ***/
router.delete('/:id', adminPermissions, productsController.destroy);

module.exports = router;
