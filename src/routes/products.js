//***  REQUIRES  ****/

const productsController = require('./../controllers/productsController');

const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const {
    productCreateValidation
} = require("../utils/validations");
const {
    adminPermissions,
    userPermissions,
    adminPermissionsJSON
} = require('./permission');

//***  MULTER  ****/
const multerDiskStorage = multer.diskStorage({
    destination: function (req, file, cb) { // request, archivo y callback que almacena archivo en destino
        cb(null, path.join(__dirname, '../../public/img/products')); // Ruta donde almacenamos el archivo
    },
    filename: function (req, file, cb) { // request, archivo y callback que almacena archivo en destino
        let imageName = file.fieldname + "-" + Date.now() + path.extname(file.originalname); // milisegundos y extensión de archivo original
        cb(null, imageName);
    }
});

const uploadFile = multer({
    storage: multerDiskStorage
});
const multipleImages = uploadFile.fields([{
        name: "cImage1",
        maxCount: 10
    },
    {
        name: "cImage2",
        maxCount: 10
    },
    {
        name: "cImage3",
        maxCount: 10
    },
    {
        name: "cImage4",
        maxCount: 10
    },
    {
        name: "cImage5",
        maxCount: 10
    },
])

/*** GET ALL PRODUCTS ***/
router.get('/', productsController.index)

/*** CARRITO ***/
router.get('/carrito', userPermissions, productsController.chart);

/*** COMING SOON ***/
router.get('/coming-soon', adminPermissions, productsController.comingSoon);

/*** PRODUCTS-PANEL ***/
router.get('/admin/panel/products', adminPermissions, productsController.productsPanel);
router.get('/admin/panel/categories', adminPermissions, productsController.categoriesPanel);
router.get('/admin/panel/genres', adminPermissions, productsController.genresPanel);
router.get('/admin/panel/brands', adminPermissions, productsController.brandsPanel);

router.post("/admin/panel/createNewGenre", adminPermissionsJSON, productsController.createNewGenre);
router.post("/admin/panel/createNewBrand", adminPermissionsJSON, productsController.createNewBrand);
router.post("/admin/panel/createNewCategory", adminPermissionsJSON, productsController.createNewCategory);

router.post("/admin/panel/deleteCategory", adminPermissionsJSON, productsController.deleteCategory);
router.post("/admin/panel/deleteGenre", adminPermissionsJSON, productsController.deleteGenre);
router.post("/admin/panel/deleteBrand", adminPermissionsJSON, productsController.deleteBrand);


router.post("/admin/panel/editCategory", adminPermissionsJSON, productsController.editCategory);
router.post("/admin/panel/editGenre", adminPermissionsJSON, productsController.editGenre);
router.post("/admin/panel/editBrand", adminPermissionsJSON, productsController.editBrand);

/*** GET ONE PRODUCT (DETAIL OF ONE PRODUCT) ***/
router.get('/detail/:id', productsController.detail);

/*** STORE CON FILTROS ***/
router.get('/store', productsController.store);

/*** CREATE ONE PRODUCT ***/
router.get('/admin/panel/products/create', adminPermissions, productsController.getCreateProduct);
router.post('/admin/panel/products/create', adminPermissions, multipleImages, productCreateValidation, productsController.postCreateProduct);

/*** EDIT ONE PRODUCT ***/
router.get('/admin/panel/products/edit/:id', adminPermissions, productsController.getEditProduct);
router.post('/admin/panel/products/edit/:id', adminPermissions, multipleImages, productCreateValidation, productsController.postEditProduct);

/*** DELETE ONE PRODUCT ***/
router.delete('/:id', adminPermissions, productsController.destroy);

module.exports = router;