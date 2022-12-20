const apiController = require('./../controllers/apiController');
const express = require("express");
const router = express.Router();


router.get ("/users", apiController.usersList);
router.get("/:id", apiController.user)


module.exports = router;



