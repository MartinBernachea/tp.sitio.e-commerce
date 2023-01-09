const apiController = require('./../controllers/apiController');
const express = require("express");
const router = express.Router();


router.get("/users", apiController.usersList);
router.get("/users/:id", apiController.user);
router.get("/products", apiController.productsList);
router.get("/products/lastProduct", apiController.lastProduct);
router.get("/products/:id", apiController.product);
router.get("/categories", apiController.categories);


module.exports = router;



