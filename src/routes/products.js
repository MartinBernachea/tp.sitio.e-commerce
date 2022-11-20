//***  REQUIRES  ****/

const productsController = require('./../controllers/productsController');

const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const { productCreateValidation } = require("../utils/validations")

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
router.get('/carrito', productsController.chart);

/*** COMING SOON ***/
router.get('/coming-soon', productsController.comingSoon);

/*** GET ONE PRODUCT (DETAIL OF ONE PRODUCT) ***/
router.get('/detail/:id', productsController.detail);

/*** CREATE ONE PRODUCT ***/
router.get('/create', productsController.create);
router.post('/create', multipleImages, productCreateValidation, productsController.store); // FALTA AGREGAR 'validaciones' de img

/*** EDIT ONE PRODUCT ***/
router.get('/edit/:id', productsController.edit);
router.put('/edit/:id', productsController.update);

/*** DELETE ONE PRODUCT ***/
router.delete('/:id', productsController.destroy);

module.exports = router;
