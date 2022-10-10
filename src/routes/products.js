//***  REQUIRES  ****/

const productsController = require('./../controllers/productsController');

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const path = require('path');
const multer = require('multer');


//***  Validations  ****/

let validaciones = [
    body('name').notEmpty().withMessage('Completar campo'),
    body('price').notEmpty().withMessage('Completar campo'),  // .isNumeric([locale(['ar']), options({no_symbols: true})])
    body('category').notEmpty().withMessage('Completar campo'),
    // body('cImage').notEmpty().withMessage('Completa campo')  // NO ANDA -- BUSCAR ERROR o RAZON
]


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
router.post('/create', uploadFile.single('cImage'), validaciones, productsController.store); // FALTA AGREGAR 'validaciones' de img

/*** EDIT ONE PRODUCT ***/
router.get('/edit/:id', productsController.edit);
router.put('/edit/:id', productsController.update);

/*** DELETE ONE PRODUCT ***/
router.delete('/:id', productsController.destroy);

module.exports = router;
